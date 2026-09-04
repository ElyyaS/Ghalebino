CREATE TYPE "public"."coupon_scope" AS ENUM('PLATFORM', 'SELLER');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('PERCENT', 'FIXED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'PAYMENT_PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'REJECTED', 'SUSPENDED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('PUBLISHED', 'PENDING', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'SELLER', 'CUSTOMER');--> statement-breakpoint
CREATE TYPE "public"."seller_application_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."seller_status" AS ENUM('ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'WAITING_FOR_SELLER', 'RESOLVED', 'CLOSED', 'ESCALATED');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('SALE', 'WITHDRAWAL', 'REFUND', 'FEE', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'SUSPENDED', 'BANNED');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'PAID', 'FAILED');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" integer,
	"action" varchar(80) NOT NULL,
	"resource_type" varchar(40) NOT NULL,
	"resource_id" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "blog_post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image" text,
	"status" varchar(20) DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" varchar(200),
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_key" varchar(80),
	"product_id" integer NOT NULL,
	"license_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"description" text,
	"icon" varchar(60),
	"image_url" text,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"seo_title" varchar(200),
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_products" (
	"collection_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "collection_products_collection_id_product_id_pk" PRIMARY KEY("collection_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"kind" varchar(20) DEFAULT 'MANUAL' NOT NULL,
	"image_url" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comparisons" (
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comparisons_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "coupon_categories" (
	"coupon_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "coupon_categories_coupon_id_category_id_pk" PRIMARY KEY("coupon_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "coupon_products" (
	"coupon_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "coupon_products_coupon_id_product_id_pk" PRIMARY KEY("coupon_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(60) NOT NULL,
	"type" "coupon_type" NOT NULL,
	"value" integer NOT NULL,
	"min_order" integer DEFAULT 0 NOT NULL,
	"max_uses" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"scope" "coupon_scope" DEFAULT 'PLATFORM' NOT NULL,
	"seller_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_item_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"version_id" integer NOT NULL,
	"ip_hash" varchar(80),
	"downloaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"key" varchar(60) NOT NULL,
	"description" text,
	"terms" text,
	"multiplier" real DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(40) DEFAULT 'GENERAL' NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text,
	"link" varchar(300),
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"license_id" integer NOT NULL,
	"product_title" varchar(220) NOT NULL,
	"license_name" varchar(120) NOT NULL,
	"unit_price" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"final_price" integer DEFAULT 0 NOT NULL,
	"seller_share" integer DEFAULT 0 NOT NULL,
	"platform_fee" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(40) NOT NULL,
	"user_id" integer NOT NULL,
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"coupon_id" integer,
	"total" integer DEFAULT 0 NOT NULL,
	"platform_fee" integer DEFAULT 0 NOT NULL,
	"payment_method" varchar(60) DEFAULT 'mock' NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"cancellation_reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(60) DEFAULT 'mock' NOT NULL,
	"provider_ref" varchar(120),
	"amount" integer DEFAULT 0 NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"text" varchar(300) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"license_id" integer NOT NULL,
	"price" integer,
	"is_available" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_requirements" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"text" varchar(300) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_tags" (
	"product_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "product_tags_product_id_tag_id_pk" PRIMARY KEY("product_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "product_technologies" (
	"product_id" integer NOT NULL,
	"technology_id" integer NOT NULL,
	CONSTRAINT "product_technologies_product_id_technology_id_pk" PRIMARY KEY("product_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "product_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"version" varchar(40) NOT NULL,
	"release_date" timestamp with time zone DEFAULT now() NOT NULL,
	"changelog" text,
	"file_key" varchar(255) NOT NULL,
	"file_size" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"category_id" integer NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"sale_price" integer,
	"status" "product_status" DEFAULT 'DRAFT' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_trending" boolean DEFAULT false NOT NULL,
	"is_staff_pick" boolean DEFAULT false NOT NULL,
	"current_version" varchar(40) DEFAULT '1.0.0' NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"views" integer DEFAULT 0 NOT NULL,
	"sales_count" integer DEFAULT 0 NOT NULL,
	"rating_avg" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"demo_url" varchar(300),
	"documentation_url" varchar(300),
	"support_note" text,
	"seo_title" varchar(200),
	"seo_description" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"question" text NOT NULL,
	"seller_answer" text,
	"answered_at" timestamp with time zone,
	"status" varchar(20) DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" integer NOT NULL,
	"target_type" varchar(20) NOT NULL,
	"target_id" integer NOT NULL,
	"reason" varchar(60) NOT NULL,
	"details" text,
	"status" varchar(20) DEFAULT 'OPEN' NOT NULL,
	"reviewer_note" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_criteria" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(60) NOT NULL,
	"name" varchar(120) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL,
	"criterion_id" integer NOT NULL,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"order_item_id" integer,
	"rating" integer NOT NULL,
	"title" varchar(160),
	"content" text,
	"status" "review_status" DEFAULT 'PUBLISHED' NOT NULL,
	"helpful_votes" integer DEFAULT 0 NOT NULL,
	"seller_reply" text,
	"seller_replied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"store_name" varchar(120) NOT NULL,
	"description" text,
	"portfolio_url" varchar(255),
	"status" "seller_application_status" DEFAULT 'PENDING' NOT NULL,
	"reviewer_note" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"username" varchar(60) NOT NULL,
	"store_name" varchar(120) NOT NULL,
	"tagline" varchar(200),
	"bio" text,
	"avatar_url" text,
	"cover_url" text,
	"rating" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"total_sales" integer DEFAULT 0 NOT NULL,
	"total_products" integer DEFAULT 0 NOT NULL,
	"response_time" varchar(60),
	"status" "seller_status" DEFAULT 'ACTIVE' NOT NULL,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"value" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"author_role" varchar(20) DEFAULT 'CUSTOMER' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket_number" varchar(40) NOT NULL,
	"user_id" integer NOT NULL,
	"seller_id" integer,
	"subject" varchar(200) NOT NULL,
	"type" varchar(40) DEFAULT 'GENERAL' NOT NULL,
	"status" "ticket_status" DEFAULT 'OPEN' NOT NULL,
	"priority" varchar(20) DEFAULT 'NORMAL' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"kind" varchar(40) DEFAULT 'framework' NOT NULL,
	"icon" varchar(60),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"balance_after" integer DEFAULT 0 NOT NULL,
	"reference_type" varchar(40),
	"reference_id" integer,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "role" DEFAULT 'CUSTOMER' NOT NULL,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"avatar_url" text,
	"bio" text,
	"email_verified_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"status" "withdrawal_status" DEFAULT 'REQUESTED' NOT NULL,
	"method" varchar(60) DEFAULT 'bank' NOT NULL,
	"account_details" text,
	"admin_note" text,
	"payout_reference" varchar(120),
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"processed_by" integer
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_blog_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_licenses" ADD CONSTRAINT "product_licenses_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_licenses" ADD CONSTRAINT "product_licenses_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_requirements" ADD CONSTRAINT "product_requirements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_technologies" ADD CONSTRAINT "product_technologies_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_technologies" ADD CONSTRAINT "product_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_ratings" ADD CONSTRAINT "review_ratings_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_ratings" ADD CONSTRAINT "review_ratings_criterion_id_review_criteria_id_fk" FOREIGN KEY ("criterion_id") REFERENCES "public"."review_criteria"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_applications" ADD CONSTRAINT "seller_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_applications" ADD CONSTRAINT "seller_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_tags_slug_idx" ON "blog_tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cart_user_idx" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_session_idx" ON "cart_items" USING btree ("session_key");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "collections_slug_idx" ON "collections" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");--> statement-breakpoint
CREATE INDEX "downloads_user_idx" ON "downloads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_seller_idx" ON "order_items" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_number_idx" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "payments_order_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "product_features_product_idx" ON "product_features" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_product_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_licenses_unique_idx" ON "product_licenses" USING btree ("product_id","license_id");--> statement-breakpoint
CREATE INDEX "product_requirements_product_idx" ON "product_requirements" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_versions_product_idx" ON "product_versions" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_seller_idx" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_price_idx" ON "products" USING btree ("price");--> statement-breakpoint
CREATE INDEX "products_rating_idx" ON "products" USING btree ("rating_avg");--> statement-breakpoint
CREATE INDEX "products_sales_idx" ON "products" USING btree ("sales_count");--> statement-breakpoint
CREATE INDEX "questions_product_idx" ON "questions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_ratings_unique_idx" ON "review_ratings" USING btree ("review_id","criterion_id");--> statement-breakpoint
CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "seller_applications_user_idx" ON "seller_applications" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sellers_user_idx" ON "sellers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sellers_username_idx" ON "sellers" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_messages_ticket_idx" ON "support_messages" USING btree ("ticket_id");--> statement-breakpoint
CREATE UNIQUE INDEX "support_tickets_number_idx" ON "support_tickets" USING btree ("ticket_number");--> statement-breakpoint
CREATE INDEX "support_tickets_user_idx" ON "support_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_tickets_seller_idx" ON "support_tickets" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_slug_idx" ON "technologies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "transactions_seller_idx" ON "transactions" USING btree ("seller_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "withdrawals_seller_idx" ON "withdrawals" USING btree ("seller_id");