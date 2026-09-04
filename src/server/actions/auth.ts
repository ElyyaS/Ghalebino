"use server";

import { redirect } from "next/navigation";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { eq, and, gt, isNull } from "drizzle-orm";

import { db, notifications, passwordResetTokens, users } from "@/db";
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

const scrypt = promisify(scryptCallback);

const RESET_BASE = `${
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
}/auth/reset-password`;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, salt, hash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const storedKey = Buffer.from(hash, "hex");
  const derivedKey = (await scrypt(password, salt, storedKey.length)) as Buffer;

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
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
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return { error: "این نشانی ایمیل قبلاً ثبت شده است." };
    }

    const inserted = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        role: "CUSTOMER",
        status: "ACTIVE",
        avatarUrl: null,
        bio: null,
        emailVerifiedAt: now,
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: users.id });

    const user = inserted[0];

    if (!user) {
      throw new Error("User creation failed.");
    }

    userId = user.id;

    await db.insert(notifications).values({
      userId,
      type: "SECURITY",
      title: "به قالبی نو خوش آمدید",
      body: "حساب کاربری شما با موفقیت ساخته شد.",
      link: null,
      isRead: false,
    });

    await startSession(userId);
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

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { error: "ایمیل یا رمز عبور نادرست است." };
    }

    if (user.status !== "ACTIVE") {
      return { error: "حساب کاربری شما فعال نیست." };
    }

    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

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

    const result = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (user) {
      const token = generateToken();
      const tokenHash = sha256(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
        usedAt: null,
      });

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
    const now = new Date();

    const result = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
      })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, now),
        ),
      )
      .limit(1);

    const record = result[0];

    if (!record) {
      return {
        error: "لینک بازیابی نامعتبر یا منقضی شده است.",
      };
    }

    const userResult = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, record.userId))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      return { error: "حساب کاربری یافت نشد." };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await db
      .update(passwordResetTokens)
      .set({
        usedAt: new Date(),
      })
      .where(eq(passwordResetTokens.id, record.id));

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

    await db
      .update(users)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { message: "اطلاعات حساب ذخیره شد." };
  } catch (err) {
    if (err instanceof AppError) {
      return { error: err.message };
    }

    console.error("[profile]", err);

    return { error: "خطایی رخ داد." };
  }
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}