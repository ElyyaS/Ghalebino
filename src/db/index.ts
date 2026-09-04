import "server-only";

import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __ghalebiNoPglite?: PGlite;
};

const databasePath = path.join(process.cwd(), "data", "ghalebino");

const client =
  globalForDb.__ghalebiNoPglite ??
  new PGlite(databasePath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__ghalebiNoPglite = client;
}

export const db = drizzle(client, { schema });

export * from "./schema";