"use server";

import { redirect } from "next/navigation";
import { destroySession, requireUser, startSession } from "@/lib/auth";
import { emailProvider } from "@/lib/email";
import {
  AppError,
  firstErrorMessage,
  type FormState,
} from "@/lib/errors";
import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "@/lib/validators";
import { generateToken } from "@/lib/utils";
import { createHash } from "node:crypto";
import {
  addMockNotification,
  addPasswordResetToken,
  getMockUserByEmail,
  getMockUserById,
  mockStore,
  updateMockUser,
  updatePassword,
  getPasswordResetToken,
} from "@/server/mock-store";

const RESET_BASE = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  }/auth/reset-password`;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  let userId: number;

  try {
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const name = parsed.data.name.trim();
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;

    const existing = getMockUserByEmail(email);

    if (existing) {
      return { error: "این نشانی ایمیل قبلاً ثبت شده است." };
    }

    const now = new Date();

    const nextId =
      mockStore.users.reduce(
        (max, user) => Math.max(max, user.id),
        0,
      ) + 1;

    const user = {
      id: nextId,
      email,
      passwordHash: "mock",
      name,
      role: "CUSTOMER" as const,
      status: "ACTIVE" as const,
      avatarUrl: null,
      bio: null,
      emailVerifiedAt: now,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    };

    mockStore.users.push(user);
    mockStore.passwords.set(user.id, password);

    addMockNotification(user.id, {
      type: "SECURITY",
      title: "به قالبی نو خوش آمدید",
      body: "حساب کاربری شما با موفقیت ساخته شد.",
    });

    await startSession(user.id);

    userId = user.id;

  } catch (err) {
    if (err instanceof AppError) {
      return { error: err.message };
    }

    console.error("[register]", err);

    return {
      error: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    };

  }

  void userId;
  redirect("/dashboard/customer");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  let role: "ADMIN" | "SELLER" | "CUSTOMER";

  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;

    const user = getMockUserByEmail(email);

    if (!user) {
      return { error: "ایمیل یا رمز عبور نادرست است." };
    }

    const storedPassword = mockStore.passwords.get(user.id);

    if (!storedPassword || storedPassword !== password) {
      return { error: "ایمیل یا رمز عبور نادرست است." };
    }

    updateMockUser(user.id, {
      lastLoginAt: new Date(),
    });

    await startSession(user.id);

    role = user.role;

  } catch (err) {
    if (err instanceof AppError) {
      return { error: err.message };
    }

    console.error("[login]", err);

    return {
      error: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    };

  }

  if (role === "ADMIN") {
    redirect("/admin");
  }

  if (role === "SELLER") {
    redirect("/dashboard/seller");
  }

  redirect("/dashboard/customer");
}

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const parsed = forgotSchema.safeParse({
      email: formData.get("email"),
    });

    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = getMockUserByEmail(email);

    if (user) {
      const token = generateToken();
      const tokenHash = sha256(token);

      addPasswordResetToken(
        user.id,
        tokenHash,
        new Date(Date.now() + 60 * 60 * 1000),
      );

      const link = `${RESET_BASE}?token=${token}`;

      if (process.env.NODE_ENV !== "production") {
        return {
          message: "محیط دمو: لینک بازیابی آماده شد.",
          devLink: link,
        };
      }

      await emailProvider.send({
        to: user.email,
        subject: "بازیابی رمز عبور قالبی نو",
        html: `برای بازیابی رمز عبور روی این لینک کلیک کنید: ${link}`,
      });
    }

    return {
      message: "اگر ایمیلی ثبت شده باشد، لینک بازیابی ارسال خواهد شد.",
    };

  } catch (err) {
    console.error("[forgot]", err);

    return { error: "خطایی رخ داد." };

  }
}

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  let shouldRedirect = false;

  try {
    const parsed = resetSchema.safeParse({
      token: formData.get("token"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const tokenHash = sha256(parsed.data.token);
    const record = getPasswordResetToken(tokenHash);

    if (
      !record ||
      record.usedAt ||
      record.expiresAt.getTime() < Date.now()
    ) {
      return {
        error: "لینک بازیابی نامعتبر یا منقضی شده است.",
      };
    }

    const user = getMockUserById(record.userId);

    if (!user) {
      return { error: "حساب کاربری یافت نشد." };
    }

    updatePassword(user.id, parsed.data.password);
    record.usedAt = new Date();
    shouldRedirect = true;

  } catch (err) {
    console.error("[reset]", err);

    return { error: "خطایی رخ داد." };

  }

  if (shouldRedirect) {
    redirect("/auth/login?reset=1");
  }

  return {};
}

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await requireUser();

    const name = String(formData.get("name") ?? "").trim();

    if (name.length < 2) {
      return { error: "نام نامعتبر است." };
    }

    updateMockUser(user.id, { name });

    return { message: "اطلاعات حساب ذخیره شد." };

  } catch (err) {
    if (err instanceof AppError) {
      return { error: err.message };
    }

    return { error: "خطایی رخ داد." };

  }
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}