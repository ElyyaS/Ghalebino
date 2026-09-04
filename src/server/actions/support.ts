"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, notifications, sellers, supportMessages, supportTickets, type TicketStatus } from "@/db";
import { requireUser } from "@/lib/auth";
import { AppError, firstErrorMessage, type FormState } from "@/lib/errors";
import { notify } from "@/lib/notifications";
import { replySchema, ticketSchema } from "@/lib/validators";

export async function createTicketAction(_prev: FormState, formData: FormData): Promise<FormState> {
  let ticketId = 0;
  try {
    const user = await requireUser();
    const parsed = ticketSchema.safeParse({
      subject: formData.get("subject"),
      type: formData.get("type"),
      message: formData.get("message"),
      sellerId: formData.get("sellerId"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    const d = parsed.data;

    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
    const [ticket] = await db
      .insert(supportTickets)
      .values({
        ticketNumber,
        userId: user.id,
        sellerId: d.sellerId,
        subject: d.subject,
        type: d.type,
        status: "OPEN",
      })
      .returning({ id: supportTickets.id });
    ticketId = ticket.id;

    await db.insert(supportMessages).values({
      ticketId: ticket.id,
      authorId: user.id,
      authorRole: "CUSTOMER",
      content: d.message,
    });

    if (d.sellerId) {
      const [seller] = await db
        .select({ userId: sellers.userId })
        .from(sellers)
        .where(eq(sellers.id, d.sellerId))
        .limit(1);
      if (seller) {
        await notify(seller.userId, {
          type: "SUPPORT",
          title: "تیکت پشتیبانی جدید",
          body: d.subject,
          link: `/dashboard/seller/support/${ticket.id}`,
        });
      }
    }
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
  redirect(`/dashboard/customer/support/${ticketId}`);
}

export async function replyTicketAction(ticketId: number, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const parsed = replySchema.safeParse({ content: formData.get("content") });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };

    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1);
    if (!ticket) throw new AppError("تیکت یافت نشد.", 404);

    let authorRole: "CUSTOMER" | "SELLER" | "ADMIN" = "CUSTOMER";
    if (ticket.userId === user.id) {
      authorRole = "CUSTOMER";
    } else if (user.role === "ADMIN") {
      authorRole = "ADMIN";
    } else if (ticket.sellerId) {
      const [seller] = await db
        .select({ id: sellers.id })
        .from(sellers)
        .where(eq(sellers.userId, user.id))
        .limit(1);
      if (seller && seller.id === ticket.sellerId) authorRole = "SELLER";
      else throw new AppError("دسترسی غیرمجاز.", 403);
    } else {
      throw new AppError("دسترسی غیرمجاز.", 403);
    }

    await db.insert(supportMessages).values({
      ticketId,
      authorId: user.id,
      authorRole,
      content: parsed.data.content,
    });

    const nextStatus =
      authorRole === "CUSTOMER"
        ? ticket.sellerId
          ? "WAITING_FOR_SELLER"
          : "OPEN"
        : authorRole === "SELLER"
          ? "WAITING_FOR_CUSTOMER"
          : ticket.status;
    await db
      .update(supportTickets)
      .set({ status: nextStatus })
      .where(eq(supportTickets.id, ticketId));

    const notifyTarget = authorRole === "CUSTOMER" ? ticket.sellerId : ticket.userId;
    if (notifyTarget && authorRole !== "ADMIN") {
      const [targetSeller] = authorRole === "CUSTOMER"
        ? await db.select({ userId: sellers.userId }).from(sellers).where(eq(sellers.id, notifyTarget)).limit(1)
        : [null];
      const targetUserId = authorRole === "CUSTOMER" ? targetSeller?.userId : notifyTarget;
      if (targetUserId) {
        await notify(targetUserId, {
          type: "SUPPORT",
          title: "پاسخ جدید در تیکت پشتیبانی",
          body: ticket.subject,
        });
      }
    }
    return { message: "پاسخ شما ثبت شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function changeTicketStatusAction(ticketId: number, status: string): Promise<FormState> {
  try {
    const user = await requireUser();
    const allowed = ["RESOLVED", "CLOSED", "IN_PROGRESS", "ESCALATED"];
    if (!allowed.includes(status)) throw new AppError("وضعیت نامعتبر است.");

    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId))
      .limit(1);
    if (!ticket) throw new AppError("تیکت یافت نشد.", 404);

    const isAdmin = user.role === "ADMIN";
    const isOwner = ticket.userId === user.id;
    const [seller] = ticket.sellerId
      ? await db.select({ id: sellers.id }).from(sellers).where(eq(sellers.userId, user.id)).limit(1)
      : [null];
    const isSeller = seller && seller.id === ticket.sellerId;
    if (!isAdmin && !isOwner && !isSeller) throw new AppError("دسترسی غیرمجاز.", 403);

    await db
      .update(supportTickets)
      .set({ status: status as TicketStatus })
      .where(eq(supportTickets.id, ticketId));
    return { message: "وضعیت تیکت تغییر کرد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function markNotificationsReadAction() {
  try {
    const user = await requireUser();
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, user.id));
    return { ok: true };
  } catch {
    return { ok: false, error: "خطا" };
  }
}
