import "server-only";

export interface StoredObject {
  key: string;
  filename: string;
  contentType: string;
  content: string;
}

export interface StorageProvider {
  get(key: string): Promise<StoredObject | null>;
}

/**
 * In-memory/demo storage. In production this is replaced with S3-compatible
 * object storage (or a CDN) while keeping the same interface.
 */
export class MockStorageProvider implements StorageProvider {
  async get(key: string): Promise<StoredObject | null> {
    const basename = (key.split("/").pop() ?? "product").replace(/[^\w.-]+/g, "-");
    return {
      key,
      filename: `${basename}.html`,
      contentType: "text/html; charset=utf-8",
      content: [
        "<!doctype html>",
        '<html lang="fa" dir="rtl">',
        "<head><meta charset='utf-8'><title>قالبی نو</title></head>",
        "<body style='font-family:sans-serif;padding:40px;line-height:1.8'>",
        "<h1>قالبی نو — بسته فایل محصول</h1>",
        `<p>این یک بستهٔ نمونه است که به جای فایل واقعی قالب در محیط دمو تولید شده است.</p>`,
        `<p>شناسه فایل: ${key}</p>`,
        "<p>در نسخهٔ تولیدی، فایل واقعی قالب از طریق ذخیره‌سازی امن در اختیار خریدار قرار می‌گیرد.</p>",
        "</body></html>",
      ].join("\n"),
    };
  }
}

export const storageProvider: StorageProvider = new MockStorageProvider();
