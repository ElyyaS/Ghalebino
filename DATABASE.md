# مدل داده

تمام مبالغ به صورت عدد صحیح **تومان** ذخیره می‌شوند (بدون اعشار).

## جدول‌های اصلی

- **کاربران و احراز هویت:** `users`، `sessions`، `password_reset_tokens`، `email_verification_tokens`
- **فروشندگان:** `sellers`، `seller_applications`
- **تاکسونومی:** `categories`، `technologies`، `tags`
- **محصول:** `products`، `product_images`، `product_features`، `product_requirements`، `product_versions`، `product_technologies`، `product_tags`، `licenses`، `product_licenses`
- **دیدگاه و پرسش:** `reviews`، `review_criteria`، `review_ratings`، `questions`
- **مشتری:** `wishlist`، `comparisons`، `cart_items`
- **سفارش و مالی:** `orders`، `order_items`، `payments`، `transactions` (دفتر کل)، `withdrawals`، `downloads`
- **کوپن:** `coupons`، `coupon_products`، `coupon_categories`
- **پشتیبانی:** `support_tickets`، `support_messages`، `reports`، `notifications`
- **CMS:** `collections`، `collection_products`، `blog_posts`، `blog_tags`، `blog_post_tags`، `pages`، `settings`، `audit_logs`

## چرخه‌های وضعیت

- **محصول:** `DRAFT → SUBMITTED → UNDER_REVIEW → (CHANGES_REQUESTED | APPROVED → PUBLISHED | REJECTED) → SUSPENDED/ARCHIVED`
- **سفارش:** `PENDING → PAYMENT_PROCESSING → PAID | FAILED | CANCELLED → REFUND_REQUESTED → REFUNDED`
- **برداشت:** `REQUESTED → UNDER_REVIEW → APPROVED/REJECTED → PROCESSING → PAID/FAILED`
- **تیکت:** `OPEN → IN_PROGRESS → WAITING_FOR_* → RESOLVED/CLOSED`

## یکپارچگی مالی

موجودی فروشنده از **دفتر کل** (`transactions`) محاسبه می‌شود و هرگز به صورت عدد تغییرپذیر جداگانه ذخیره نمی‌شود. هر فروش یک تراکنش `SALE` (مثبت) و هر برداشت یک تراکنش `WITHDRAWAL` (منفی) ثبت می‌کند.

کارمزد پلتفرم: ۲۰٪ (`src/lib/pricing.ts`).
