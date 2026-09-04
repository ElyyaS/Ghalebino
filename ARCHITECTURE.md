# معماری

## لایه‌بندی

```
UI (components + app)
  → Server Actions / Route Handlers (mutations)
  → Domain Logic (lib: pricing, payments, storage, search)
  → Data Access (server/queries.ts)
  → Database (PostgreSQL + Drizzle)
```

- **نمایش:** Server Components به‌صورت پیش‌فرض؛ Client Components فقط برای تعامل (فرم‌ها، گالری، سبد).
- **منطق کسب‌وکار:** در `lib/` (قیمت‌گذاری، کارمزد، کوپن) متمرکز است، نه در کامپوننت‌ها.
- **دسترسی داده:** همهٔ خواندن‌ها در `server/queries.ts`؛ همهٔ تغییرها در `server/actions/*`.
- **مرز سرور/کلاینت:** ماژول‌های حساس با `server-only` علامت‌گذاری شده‌اند.

## احراز هویت و مجوزدهی

- احراز هویت مبتنی بر session: کوکی httpOnly حاوی توکن تصادفی؛ هش توکن در جدول `sessions`.
- رمز عبور با scrypt هش می‌شود.
- سه نقش: `ADMIN`، `SELLER`، `CUSTOMER`.
- هر عملیات حساس، مالکیت منبع را در سرور بررسی می‌کند (مثلاً فروشنده فقط محصول خودش را ویرایش می‌کند).

## انتزاع‌های سرویس

| سرویس | رابط | پیاده‌سازی فعلی | جایگزینی آینده |
|---|---|---|---|
| پرداخت | `PaymentProvider` | `MockPaymentProvider` | درگاه ایرانی/بین‌المللی |
| ذخیره‌سازی | `StorageProvider` | `MockStorageProvider` | S3/CDN |
| جستجو | `SearchProvider` | `DbSearchProvider` | Meilisearch/Elasticsearch |
| ایمیل | `EmailProvider` | `MockEmailProvider` | SMTP/سرویس ایمیل |
| اعلان | `notify()` | دیتابیس | ایمیل/SMS/Push |

## مسیرهای کلیدی

- عمومی: `/`، `/marketplace`، `/search`، `/categories/[slug]`، `/technologies/[slug]`، `/products/[slug]`، `/sellers/[username]`، `/collections/[slug]`، `/cart`، `/checkout`، `/blog`
- احراز هویت: `/auth/*`
- مشتری: `/dashboard/customer/*`
- فروشنده: `/dashboard/seller/*`
- مدیر: `/admin/*`
- API: `/api/health`، `/api/downloads/[orderItemId]`، `/api/suggest`، `/api/sitemap`
