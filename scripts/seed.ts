import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";

import * as schema from "../src/db/schema";

const scrypt = promisify(scryptCallback);

const databasePath = path.join(process.cwd(), "data", "ghalebino");

const client = new PGlite(databasePath);
const db = drizzle(client, { schema });

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function getOrCreateUser(data: {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  bio: string | null;
}) {
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const passwordHash = await hashPassword(data.password);
  const now = new Date();

  const inserted = await db
    .insert(schema.users)
    .values({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      status: "ACTIVE",
      avatarUrl: null,
      bio: data.bio,
      emailVerifiedAt: now,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const user = inserted[0];

  if (!user) {
    throw new Error(`Failed to create user: ${data.email}`);
  }

  return user;
}

async function seedSeller(userId: number) {
  const existing = await db
    .select()
    .from(schema.sellers)
    .where(eq(schema.sellers.userId, userId))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const now = new Date();

  const inserted = await db
    .insert(schema.sellers)
    .values({
      userId,
      username: "no-digital",
      storeName: "استودیو دیجیتال نو",
      tagline: "طراحی قالب‌های مدرن و حرفه‌ای",
      bio: "تیم طراحی و توسعه قالب‌های حرفه‌ای برای کسب‌وکارهای ایرانی",
      avatarUrl: null,
      coverUrl: null,
      rating: 4.9,
      ratingCount: 128,
      totalSales: 1840,
      totalProducts: 24,
      responseTime: "کمتر از ۲ ساعت",
      status: "ACTIVE",
      approvedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const seller = inserted[0];

  if (!seller) {
    throw new Error("Failed to create seller.");
  }

  return seller;
}

async function main() {
  const admin = await getOrCreateUser({
    email: "admin@ghalebino.test",
    password: "admin",
    name: "مدیر قالبی نو",
    role: "ADMIN",
    bio: "مدیریت قالبی نو",
  });

  const seller = await getOrCreateUser({
    email: "seller@ghalebino.test",
    password: "seller",
    name: "علی احمدی",
    role: "SELLER",
    bio: "طراح و توسعه‌دهنده وب",
  });

  const customer = await getOrCreateUser({
    email: "customer@ghalebino.test",
    password: "customer",
    name: "کاربر آزمایشی",
    role: "CUSTOMER",
    bio: null,
  });

  const sellerAccount = await seedSeller(seller.id);

  console.log("Seed completed.");
  console.log(`Admin: ${admin.email} (${admin.id})`);
  console.log(`Seller: ${seller.email} (${seller.id})`);
  console.log(`Customer: ${customer.email} (${customer.id})`);
  console.log(`Seller account: ${sellerAccount.username} (${sellerAccount.id})`);

  await client.close();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await client.close();
  process.exit(1);
});