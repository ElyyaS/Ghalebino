# متغیرهای محیطی

| متغیر | الزامی | توضیح |
|---|---|---|
| `DATABASE_URL` | بله | رشته اتصال PostgreSQL |
| `NEXT_PUBLIC_APP_URL` | خیر | آدرس پایه عمومی برنامه (برای sitemap و لینک‌های بازیابی) |

## نمونه `.env`

```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> هرگز مقدار `NEXT_PUBLIC_` را برای داده‌های محرمانه استفاده نکنید؛ این مقادیر در باندل مرورگر قرار می‌گیرند.
