import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __ghalebiNoPglite?: PGlite;
};

const client =
  globalForDb.__ghalebiNoPglite ??
  new PGlite("memory://");

if (process.env.NODE_ENV !== "production") {
  globalForDb.__ghalebiNoPglite = client;
}

export const db = drizzle(client, { schema });

export * from "./schema";