import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";

import { db, sessions, sellers, users } from "@/db";
import { AppError } from "@/lib/errors";

const SESSION_COOKIE = "ghalebi_session";
const SESSION_DAYS = 30;

export const CART_COOKIE = "ghalebi_cart";

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  status: string;
  avatarUrl: string | null;
};

export type SellerAccount = {
  id: number;
  userId: number;
  username: string;
  storeName: string;
  status: string;
};

export type CartOwner =
  | {
      userId: number;
    }
  | {
      sessionKey: string;
    };

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  );

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db
      .delete(sessions)
      .where(eq(sessions.tokenHash, hashToken(token)));
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const result = await db
    .select({
      sessionId: sessions.id,
      userId: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
      avatarUrl: users.avatarUrl,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  const record = result[0];

  if (record === undefined) {
    return null;
  }

  return {
    id: record.userId,
    email: record.email,
    name: record.name,
    role: record.role,
    status: record.status,
    avatarUrl: record.avatarUrl,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    throw new AppError(
      "برای ادامه لازم است وارد حساب کاربری شوید.",
      401,
      "UNAUTHENTICATED",
    );
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(
      "حساب کاربری شما فعال نیست.",
      403,
      "ACCOUNT_INACTIVE",
    );
  }

  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    throw new AppError(
      "دسترسی غیرمجاز.",
      403,
      "FORBIDDEN",
    );
  }

  return user;
}

export async function requireSeller(): Promise<SellerAccount> {
  const user = await requireUser();

  if (user.role !== "SELLER") {
    throw new AppError(
      "برای دسترسی به پنل فروشنده، ابتدا به عنوان فروشنده ثبت‌نام کنید.",
      403,
      "NOT_A_SELLER",
    );
  }

  const result = await db
    .select({
      id: sellers.id,
      userId: sellers.userId,
      username: sellers.username,
      storeName: sellers.storeName,
      status: sellers.status,
    })
    .from(sellers)
    .where(
      and(
        eq(sellers.userId, user.id),
        eq(sellers.status, "ACTIVE"),
      ),
    )
    .limit(1);

  const seller = result[0];

  if (seller === undefined) {
    throw new AppError(
      "حساب فروشنده یافت نشد.",
      404,
      "SELLER_NOT_FOUND",
    );
  }

  return seller;
}

export async function getSellerByUserId(
  userId: number,
): Promise<SellerAccount | null> {
  const result = await db
    .select({
      id: sellers.id,
      userId: sellers.userId,
      username: sellers.username,
      storeName: sellers.storeName,
      status: sellers.status,
    })
    .from(sellers)
    .where(eq(sellers.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function startSession(userId: number): Promise<void> {
  const token = await createSession(userId);
  await setSessionCookie(token);
}

export async function getCartOwner(
  create = false,
): Promise<CartOwner> {
  const user = await getSessionUser();

  if (user) {
    return {
      userId: user.id,
    };
  }

  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;

  if (existing) {
    return {
      sessionKey: existing,
    };
  }

  if (!create) {
    return {
      sessionKey: "",
    };
  }

  const key = randomBytes(16).toString("hex");

  cookieStore.set(CART_COOKIE, key, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  return {
    sessionKey: key,
  };
}