import path from "node:path";
import { mkdir } from "node:fs/promises";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "../src/db/schema";

const databasePath = path.join(process.cwd(), "data", "ghalebino");
const databaseParentPath = path.dirname(databasePath);

async function main() {
  console.log("Initializing local database...");

  // Make sure the data directory exists on a fresh clone.
  await mkdir(databaseParentPath, { recursive: true });

  const client = new PGlite(databasePath);
  const db = drizzle(client, { schema });

  try {
    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Database migration completed.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});