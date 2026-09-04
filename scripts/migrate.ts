import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "../src/db/schema";

const databasePath = path.join(process.cwd(), "data", "ghalebino");
const client = new PGlite(databasePath);
const db = drizzle(client, { schema });

async function main() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  await client.close();

  console.log("Database migration completed.");
}

main().catch(async (error) => {
  console.error("Database migration failed:", error);
  await client.close();
  process.exit(1);
});