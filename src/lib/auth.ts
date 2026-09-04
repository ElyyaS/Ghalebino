import "server-only";

import { randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors";
import { mockSellers } from "@/server/mock-data";
import {
  getMockUserById,
  mockStore,
} from "@/server/mock-store";

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

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");

  mockStore.sessions.set(token, userId);

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    mockStore.sessions.delete(token);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export const getSessionUser = cache(
  async (): Promise<SessionUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return null;
    }

    const userId = mockStore.sessions.get(token);

    if (!userId) {
      return null;
    }

    const user = getMockUserById(userId);

    if (!user) {
      mockStore.sessions.delete(token);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
    };

  },
);

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    throw new AppError(
      "برای ادامه لازم است وارد حساب کاربری شوید.",
      401,
      "UNAUTHENTICATED",
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

  const seller = mockSellers.find(
    (item) =>
      item.userId === user.id &&
      item.status === "ACTIVE",
  );

  if (!seller) {
    throw new AppError(
      "حساب فروشنده یافت نشد.",
      404,
      "SELLER_NOT_FOUND",
    );
  }

  return {
    id: seller.id,
    userId: seller.userId,
    username: seller.username,
    storeName: seller.storeName,
    status: seller.status,
  };
}

export async function getSellerByUserId(
  userId: number,
): Promise<SellerAccount | null> {
  const seller = mockSellers.find(
    (item) => item.userId === userId,
  );

  if (!seller) {
    return null;
  }

  return {
    id: seller.id,
    userId: seller.userId,
    username: seller.username,
    storeName: seller.storeName,
    status: seller.status,
  };
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

export async function getCartOwner(create = false): Promise<CartOwner> {
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