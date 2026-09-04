export const DEV_MODE = process.env.NODE_ENV !== "production";

export function isDatabaseAvailable() {
  return Boolean(process.env.DATABASE_URL);
}