# Ghalebino

## Professional Persian Multi-Vendor Digital Marketplace

**Ghalebino (قالبی نو)** is a production-oriented, extensible **multi-vendor digital marketplace platform** designed for the Persian-speaking web ecosystem.

The platform is being engineered as a complete marketplace rather than a landing page, UI showcase, or collection of disconnected dashboards.

Its long-term product lifecycle is:

```text
Discovery
   ↓
Product
   ↓
Seller
   ↓
Cart
   ↓
Checkout
   ↓
Payment
   ↓
Order
   ↓
Download
   ↓
Review
   ↓
Support
   ↓
Earnings
   ↓
Withdrawal
   ↓
Moderation
```

The architecture is being developed to support the complete ecosystem around this lifecycle, including authentication, authorization, product moderation, seller stores, customer accounts, payments, digital downloads, licensing, reviews, Q&A, support, notifications, coupons, promotions, analytics, financial operations, CMS, blog, SEO, security, accessibility, testing, and documentation.

---

# 🚀 Project Status

> **Active Development — Production-Oriented Architecture**

Ghalebino is under active development and is being built incrementally toward the scope defined by the project's Master Build Prompt.

The current repository contains the foundational application, persistence, authentication, database, and server-side data-access infrastructure. Higher-level marketplace capabilities are being implemented progressively.

**Important:** This README distinguishes between functionality that is currently implemented and functionality that is part of the target product scope.

The presence of a feature in the roadmap does **not** mean that feature is already production-ready.

---

# 👥 Roles & Demo Accounts

If you are reviewing or running this project locally, the following demo accounts are available.

## Demo Accounts

| Role         | Email                     | Password   | Purpose                     |
| ------------ | ------------------------- | ---------- | --------------------------- |
| **Admin**    | `admin@ghalebino.test`    | `admin`    | Platform administration     |
| **Seller**   | `seller@ghalebino.test`   | `seller`   | Seller / vendor experience  |
| **Customer** | `customer@ghalebino.test` | `customer` | Customer / buyer experience |

> ⚠️ These credentials are intended **only for local development and demonstration**. They must never be used as production credentials.

## Role Overview

### ADMIN

The platform administrator is responsible for managing the marketplace ecosystem, including:

* Users
* Sellers
* Customers
* Products
* Product moderation
* Orders
* Withdrawals
* Reports
* Support
* Content
* Marketplace configuration
* Analytics
* Audit operations

### SELLER

The seller represents a digital product creator, designer, developer, or vendor who can eventually:

* Apply to become a seller
* Complete onboarding
* Create a public store
* Create products
* Submit products for moderation
* Manage approved products
* Track sales
* Manage reviews and questions
* Manage support
* Track earnings
* Request withdrawals
* Manage store settings

### CUSTOMER

The customer represents a marketplace buyer who can eventually:

* Discover products
* Search and filter products
* View product details
* Compare products
* Save products
* Add products to the cart
* Complete checkout
* Purchase products
* Access downloads
* Manage licenses
* Leave reviews
* Ask questions
* Open support tickets
* Manage account activity and security

---

# 🧭 Product Vision

Ghalebino is designed to connect three primary actors within one marketplace ecosystem:

```text
                  ┌───────────────┐
                  │     ADMIN     │
                  │   Platform    │
                  │  Management   │
                  └───────┬───────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      ┌─────────────┐           ┌─────────────┐
      │   SELLERS   │           │  CUSTOMERS  │
      │  Products   │           │   Purchases │
      │   Stores    │           │   Downloads │
      │  Earnings   │           │   Reviews   │
      └──────┬──────┘           └──────┬──────┘
             │                         │
             └──────────┬──────────────┘
                        ▼
               ┌─────────────────┐
               │    MARKETPLACE  │
               │ Discovery       │
               │ Commerce        │
               │ Trust           │
               │ Moderation      │
               └─────────────────┘
```

The goal is not simply to create attractive screens.

The goal is to build the underlying product ecosystem that makes those screens meaningful.

---

# 🎯 Core Principles

Development follows several engineering principles:

* **Security before visual polish**
* **Correctness before convenience**
* **Data integrity as a first-class concern**
* **Server-side authorization**
* **Resource ownership validation**
* **Real database-backed functionality**
* **RTL-first UX**
* **Responsive design**
* **Accessibility**
* **Modular architecture**
* **Extensible integrations**
* **Meaningful testing**
* **Production-oriented engineering**

A UI element is not considered a completed feature by itself.

A feature is considered complete only when its required application logic, validation, authorization, persistence, error handling, and user experience are implemented as appropriate.

---

# 🛍️ Marketplace Scope

The marketplace is designed for digital products related to the web ecosystem, including:

* Website Templates
* HTML Templates
* React Templates
* Next.js Templates
* WordPress Themes
* UI Kits
* Landing Pages
* Admin Dashboards
* E-commerce Templates
* Portfolio Templates
* Business Templates
* Other web-related digital products

The product architecture is intentionally extensible so that additional digital-product categories can be introduced without rewriting the marketplace core.

---

# 🔎 Marketplace & Discovery

The target marketplace experience includes:

* Product discovery
* Search
* Search suggestions
* Autocomplete
* Advanced filtering
* Sorting
* Categories
* Subcategories
* Technologies
* Frameworks
* CMS taxonomy
* Tags
* Collections
* Featured products
* Trending products
* Best sellers
* New releases
* Top-rated products
* Recently updated products
* Seller discovery
* Seller stores
* Recommendations
* Recently viewed products

Search is designed as an abstraction rather than being tightly coupled to one implementation.

The initial implementation may rely on database-backed search while remaining extensible toward dedicated search infrastructure such as:

* Meilisearch
* Elasticsearch
* Algolia

---

# 📦 Product System

A marketplace product is modeled as a complete domain entity rather than simply a downloadable file.

A product may contain:

* Title
* Slug
* Short description
* Full description
* Category
* Subcategory
* Technologies
* Framework
* CMS
* Tags
* Features
* Requirements
* Pricing
* Discounts
* Licenses
* Media
* Live demo
* Documentation
* Versions
* Changelog
* Seller
* Rating
* Sales
* Views
* Favorites
* Reviews
* Questions
* Support information
* SEO metadata

---

# 🔄 Product Lifecycle

Products follow an explicit moderation workflow.

```text
DRAFT
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
APPROVED
   ↓
PUBLISHED
```

Additional states may include:

```text
CHANGES_REQUESTED
REJECTED
SUSPENDED
ARCHIVED
```

The seller should be able to understand the current product state and, where applicable, why changes were requested or why a submission was rejected.

---

# 🧩 Product Versioning

Products are designed to support independent version management.

A product version can contain:

* Version number
* Release date
* Changelog
* Release notes
* Downloadable version
* Compatibility information
* Current/latest version state

The goal is to make post-publication product updates traceable, structured, and maintainable.

---

# 🏪 Seller Platform

Sellers are first-class participants in the marketplace.

The intended seller lifecycle is:

```text
Seller Application
        ↓
Admin Review
        ↓
Approval
        ↓
Onboarding
        ↓
Store Creation
        ↓
Product Creation
        ↓
Product Submission
        ↓
Moderation
        ↓
Publication
        ↓
Sales
        ↓
Earnings
        ↓
Withdrawal
        ↓
Payout
```

The target Seller Platform includes:

* Overview
* Analytics
* Sales
* Orders
* Products
* Drafts
* Submitted products
* Approved products
* Rejected products
* Products requiring changes
* Reviews
* Questions
* Support
* Earnings
* Transactions
* Financial ledger
* Withdrawals
* Payout history
* Coupons
* Promotions
* Store management
* Store customization
* Public profile
* Notifications
* Settings

---

# 🏬 Seller Stores

Every approved seller is intended to have a public storefront.

Conceptually:

```text
/sellers/[username]
```

A seller store may include:

* Seller identity
* Avatar
* Bio
* Rating
* Sales
* Product count
* Join date
* Support information
* Products
* Categories
* Featured products
* Reviews

The store is intended to function as a marketplace storefront rather than merely a profile page.

---

# 👤 Customer Platform

The Customer Platform is designed around the complete buyer lifecycle.

Target areas include:

* Overview
* Profile
* Orders
* Order details
* Purchased products
* Downloads
* Wishlist
* Compare
* Reviews
* Questions
* Support tickets
* Notifications
* Coupons
* Payment history
* Security
* Settings
* Account activity

---

# 🛡️ Admin Platform

The Admin Platform is the operational center of the marketplace.

Target areas include:

* Dashboard
* Revenue
* Orders
* Sales
* Users
* Sellers
* Customers
* Products
* Product moderation
* Reports
* Refunds
* Withdrawals
* Support
* Analytics
* System health

Administrative workflows are intended to provide centralized control over the marketplace while maintaining strict authorization and auditability.

---

# 🔐 Authentication & Authorization

Security is a fundamental architectural requirement.

Primary roles:

```text
ADMIN
SELLER
CUSTOMER
```

However, authorization is **not** based on role alone.

The authorization model is intended to combine:

* Role-Based Access Control
* Permission checks
* Resource ownership
* Server-side authorization

For example:

> Seller A must not be able to modify Seller B's product simply by changing a `productId`.

Likewise:

* A customer must not download an unpurchased product.
* A seller must not access another seller's private data.
* A customer must not manipulate payment state or prices.
* A seller must not manage another seller's resources.
* Sensitive operations must not be protected merely by hiding UI buttons.

**The server is the source of truth.**

---

# 🛒 Cart & Checkout

The marketplace is designed to support a real digital-commerce workflow.

## Cart

Target capabilities include:

* Add product
* Remove product
* License selection
* Seller information
* Price calculation
* Discounts
* Coupons
* Subtotal
* Platform fees
* Final total

For digital products, quantity is only used where it has actual business meaning.

## Checkout

```text
Cart
  ↓
Checkout
  ↓
Customer Information
  ↓
Order Summary
  ↓
Coupon
  ↓
License
  ↓
Payment Method
  ↓
Payment Processing
  ↓
Result
  ↓
Order
```

Success, failure, cancellation, retry, validation, and processing states are intended to be handled explicitly.

---

# 💳 Payment Architecture

Payment processing is designed around an abstraction rather than a single gateway.

Conceptually:

```ts
PaymentProvider
```

A development/demo environment can use:

```text
MockPaymentProvider
```

The mock provider should behave like an application-level payment provider rather than acting as fake UI.

This allows future integration with real payment gateways without rewriting the commerce domain.

---

# 📋 Orders

Orders are modeled with explicit lifecycle states.

Target states include:

```text
PENDING
PAYMENT_PROCESSING
PAID
FAILED
CANCELLED
REFUND_REQUESTED
REFUNDED
COMPLETED
```

An order is expected to maintain explicit relationships with:

* Customer
* Order items
* Products
* Sellers
* Licenses
* Prices
* Discounts
* Payments
* Transactions
* Timestamps

---

# 📥 Digital Downloads

Successful purchases should result in authorized download access.

Target download capabilities include:

* Purchased products
* Download access
* Download tracking
* Current version
* Previous versions
* Changelog
* License information
* Support status

Downloads must be protected by purchase authorization.

Changing a URL or identifier must not be sufficient to obtain another customer's purchased files.

Storage is designed as an abstraction so that future infrastructure can use:

* S3-compatible storage
* Cloud storage
* CDN infrastructure

---

# 📜 Licensing

Licensing is intended to be an independent business domain.

Potential entities include:

* License
* Product license
* Purchased license
* License price
* License terms
* Purchase association

License rules should live in business logic rather than being hardcoded into UI components.

---

# ⭐ Reviews

Reviews are intended to be restricted to eligible customers.

Target functionality includes:

* Ratings
* Review text
* Verified purchase
* Helpful votes
* Seller replies
* Reports
* Moderation
* Rating distribution

Where useful, configurable evaluation criteria may include:

* Design quality
* Code quality
* Documentation
* Ease of use
* Performance
* Support

---

# ❓ Questions & Answers

Q&A is intentionally separated from support tickets.

Conceptually:

```text
Customer Question
       ↓
Seller Answer
```

The system is intended to support:

* Moderation
* Reporting
* Notifications

---

# 🎫 Support System

Support is modeled as a dedicated workflow.

Target ticket categories include:

* Pre-sale question
* Technical issue
* Bug report
* Post-purchase support
* Refund request
* General support

Lifecycle:

```text
OPEN
 ↓
IN_PROGRESS
 ↓
WAITING_FOR_CUSTOMER / WAITING_FOR_SELLER
 ↓
RESOLVED
 ↓
CLOSED
```

Additional escalation may be represented by:

```text
ESCALATED
```

Support may include:

* Messages
* Participants
* Attachments
* Status
* Notifications
* Timestamps
* Administrative escalation

---

# 💰 Financial System

Seller finances are designed around a **ledger-oriented model**.

A mutable `balance` field should not be treated as the only source of financial truth.

Conceptually:

```text
Order
  ↓
Order Item
  ↓
Gross Amount
  ↓
Platform Fee
  ↓
Seller Share
  ↓
Financial Ledger
  ↓
Available Balance
  ↓
Withdrawal
  ↓
Admin Review
  ↓
Payout
```

The financial system is intended to support:

* Transactions
* Earnings
* Fees
* Pending balance
* Available balance
* Withdrawals
* Payout history

---

# 💸 Withdrawals

Sellers should eventually be able to:

* View available balance
* Create withdrawal requests
* View withdrawal history
* Track request status

Administrators should be able to:

* Review requests
* Approve requests
* Reject requests
* Process payouts
* Mark payouts as paid
* Record payout references

Target states:

```text
REQUESTED
UNDER_REVIEW
APPROVED
REJECTED
PROCESSING
PAID
FAILED
```

---

# 🎟️ Coupons & Promotions

Discount functionality is designed around actual business rules.

Target capabilities include:

* Percentage discounts
* Fixed discounts
* Expiration
* Usage limits
* Per-user limits
* Product restrictions
* Category restrictions
* Seller restrictions
* Minimum order amount

Platform-level and seller-level coupons should remain distinguishable at the domain level.

---

# 🔔 Notifications

The notification system is designed around marketplace events.

Examples include:

* Orders
* Payments
* Downloads
* Product updates
* Reviews
* Questions
* Support
* Seller applications
* Product moderation
* Withdrawals
* Promotions
* Account security

Notifications may have:

```text
READ
UNREAD
```

states.

Notification preferences are also intended to be configurable.

The architecture is designed to support future channels such as:

* Email
* SMS
* Push notifications

---

# 📝 CMS

The marketplace is intended to contain a manageable content layer.

Administrators should eventually be able to manage:

* Homepage sections
* Banners
* Featured products
* Featured sellers
* Collections
* Static pages
* FAQ
* Footer content
* Navigation content

without requiring direct source-code modification for every content change.

---

# 📰 Blog

The target Blog system includes:

* Blog listing
* Blog details
* Categories
* Tags
* Search
* Related posts
* Author
* Publication date
* SEO metadata

---

# 🔎 SEO

SEO is treated as part of the platform architecture rather than a final cosmetic task.

Target capabilities include:

* Dynamic metadata
* Titles
* Descriptions
* Canonical URLs
* Open Graph
* Social metadata
* Breadcrumbs
* Structured data
* Sitemap
* Robots configuration
* Semantic HTML
* SEO-friendly URLs
* Internal linking

SEO is intended to cover public entities such as:

* Products
* Categories
* Technologies
* Sellers
* Collections
* Blog posts

Private dashboards and sensitive application routes must not be unintentionally indexed.

---

# 🇮🇷 Persian & RTL-First UX

Ghalebino is designed primarily for the Persian-speaking market.

RTL is not treated as a final CSS patch.

RTL considerations apply to:

* Layout
* Navigation
* Flexbox
* Grid
* Forms
* Tables
* Modals
* Drawers
* Pagination
* Breadcrumbs
* Search
* Charts
* Carousels
* Icons
* Directional controls

Production UI language:

**Persian**

Interface direction:

**RTL**

Primary typography:

**Vazirmatn**

---

# 🎨 Design System

The application is intended to use a unified design system.

The design system includes:

* Typography
* Color tokens
* Spacing
* Radius
* Shadows
* Borders
* Breakpoints
* Motion
* Icons
* Buttons
* Inputs
* Forms
* Cards
* Tables
* Badges
* Alerts
* Toasts
* Modals
* Drawers
* Tabs
* Accordions
* Pagination
* Breadcrumbs
* Skeletons
* Empty states
* Error states

The visual identity is based on a modern professional language with blue/purple accents and controlled neon-inspired details.

Excessive glow, gradients, and decorative effects are intentionally avoided.

Target aesthetic:

**Premium + Modern + Professional + Persian + Trustworthy**

The goal is to avoid the generic "AI-generated dashboard" appearance.

---

# 📱 Responsive Design

Responsive behavior is treated as a first-class requirement.

The application is intended to be evaluated across:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px
Large Desktop
```

Mobile is not considered a scaled-down desktop.

Dedicated responsive patterns are required for:

* Navigation
* Search
* Filters
* Product pages
* Galleries
* Checkout
* Dashboards
* Tables
* Charts
* Modals
* Drawers

---

# ♿ Accessibility

Accessibility is part of the project's Definition of Done.

The target accessibility requirements include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible forms
* Proper labels
* Error associations
* Appropriate ARIA
* Color contrast
* Screen-reader support
* Reduced-motion support
* Accessible dialogs
* Accessible dropdowns
* Accessible tables
* Accessible navigation

---

# ⏳ UI States

Important features must support more than the happy path.

Expected states include:

* Default
* Loading
* Skeleton
* Empty
* Error
* Success
* Disabled
* Pending
* Processing
* Unauthorized
* Forbidden
* Not Found
* Network Failure

Examples:

* No search results
* Empty wishlist
* No orders
* No downloads
* Pending seller application
* Product under review
* Payment failed
* Download unavailable
* Suspended product
* Empty seller store

---

# 🔒 Security

Security is one of the project's highest priorities.

Security considerations include:

* Broken access control
* IDOR
* Privilege escalation
* XSS
* SQL injection
* CSRF where relevant
* Session vulnerabilities
* Unsafe downloads
* Unsafe file uploads
* Rate abuse
* Enumeration
* Secret exposure
* Payment manipulation
* Price manipulation
* Ownership bypass

Core principles:

* Server-side validation
* Server-side authorization
* Ownership checks
* Secure sessions
* Secure cookies
* Safe error responses
* Rate limiting where required
* Security headers
* Audit logging
* Server-only secrets

No real secrets should ever be committed to the repository.

---

# 📁 File Upload Security

Digital marketplace files can represent a significant security boundary.

The upload architecture is intended to support:

* Extension validation
* MIME validation
* File-size validation
* Safe storage names
* Path traversal protection
* Client filename sanitization
* Non-executable storage
* Malware-scanning integration
* Protected downloads

Uploaded files must never be treated as executable application code.

---

# 🧾 Audit Logging

Security-sensitive and administrative operations should be auditable.

Potential audit information includes:

* Actor
* Action
* Resource
* Resource ID
* Timestamp
* Metadata
* Outcome

Examples:

* Product approved
* Product rejected
* Seller approved
* Seller suspended
* Refund approved
* Withdrawal approved
* User role changed
* Account suspended

---

# 🧱 Technology Stack

## Core Stack

| Technology       | Role                                            |
| ---------------- | ----------------------------------------------- |
| **Next.js**      | Application framework                           |
| **React**        | UI                                              |
| **TypeScript**   | Type safety                                     |
| **Tailwind CSS** | Styling                                         |
| **Drizzle ORM**  | Database access                                 |
| **PGlite**       | Local persistent PostgreSQL-compatible database |
| **Zod**          | Runtime validation                              |
| **lucide-react** | Icon system                                     |
| **Vazirmatn**    | Persian typography                              |

## Current Versions

```text
Next.js        16.2.6
React          19.2.6
TypeScript     5.9.3
Tailwind CSS   4.1.17
Drizzle ORM    0.45.2
PGlite         0.5.8
drizzle-kit    0.31.10
```

Versions may evolve as development continues.

---

# 🗄️ Database Architecture

The current development/demo environment uses **disk-backed PGlite**.

Database path:

```text
data/ghalebino
```

Because the database is stored on disk, application data persists across development-server restarts.

Database access is handled through:

```text
Drizzle ORM
```

Migration files are stored under:

```text
drizzle/
```

Runtime migration execution is handled by:

```text
scripts/migrate.ts
```

This keeps database access separated from application logic while preserving a path toward PostgreSQL-oriented production infrastructure.

---

# 🔄 Current Persistence Layer

The current persistence foundation includes:

* Persistent PGlite database
* Drizzle ORM
* Database schema
* Migration system
* Seed system
* Persistent users
* Persistent sessions
* Database-backed server queries
* Database-backed authentication data

Migration and seed operations are exposed as independent commands.

---

# 🔐 Current Authentication

The current authentication implementation uses database-backed sessions.

Sessions are:

* Server-side
* Persistent
* Cookie-based
* HTTP-only

Passwords are securely hashed, and password-reset functionality is backed by the database.

Authentication-related state is persisted rather than relying solely on in-memory mock data.

---

# 🏗️ Architecture

The project follows a separation-of-concerns approach:

```text
Presentation
      ↓
Application / Use Cases
      ↓
Domain Logic
      ↓
Data Access Layer
      ↓
Database / External Services
```

Key principles:

* UI should not contain core business logic.
* Database queries should not be scattered throughout UI components.
* Sensitive server logic must remain server-only.
* Secrets must never be exposed to the client.
* Data access should be centralized and maintainable.
* Serialized DTO/data shapes should be used where appropriate.
* External integrations should be abstracted.

---

# 🗂️ Project Structure

The repository is organized by responsibility.

Current structure follows the general pattern:

```text
.
├── drizzle/
│   ├── migrations
│   └── meta
│
├── scripts/
│   ├── migrate.ts
│   └── seed.ts
│
├── src/
│   ├── app/
│   ├── db/
│   ├── lib/
│   ├── server/
│   └── ...
│
├── data/
│   └── ghalebino/
│
├── drizzle.config.json
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

The local `data/` directory and environment files are excluded from Git tracking.

---

# 🛣️ Route Architecture

The target route hierarchy is organized around public marketplace experiences and isolated application areas.

## Public Routes

```text
/
 /marketplace
 /search
 /categories/[slug]
 /technologies/[slug]
 /products/[slug]
 /sellers/[username]
 /collections/[slug]
 /cart
 /checkout
 /blog
 /blog/[slug]
 /about
 /contact
 /faq
 /help
 /terms
 /privacy
 /refund-policy
 /license
```

## Authentication

```text
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
/auth/verify-email
```

## Customer

```text
/dashboard/customer/...
```

## Seller

```text
/dashboard/seller/...
```

## Admin

```text
/admin/...
```

The application uses the Next.js App Router to organize these areas.

---

# 🌱 Seed Data

The demo environment is intended to provide a realistic, immediately inspectable marketplace.

Seed data is designed to eventually include:

* Users
* Customers
* Sellers
* Admin
* Seller applications
* Products
* Categories
* Technologies
* Tags
* Product versions
* Reviews
* Questions
* Orders
* Payments
* Transactions
* Downloads
* Support tickets
* Notifications
* Coupons
* Collections
* Blog posts

The project avoids relying on meaningless placeholder content such as:

```text
Product 1
Product 2
Seller 1
Lorem ipsum
```

as the primary demo experience.

---

# ⚙️ Environment

The real environment file must never be committed.

The current development configuration uses values such as:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_DEV_MODE=true
```

The current application runtime uses PGlite for local persistence.

`DATABASE_URL` is retained for database-tooling and PostgreSQL-oriented development compatibility.

Production environments must use separate configuration and real secrets.

---

# 🚀 Getting Started

## Requirements

Use a supported modern Node.js release.

Clone the repository:

```bash
git clone https://github.com/ElyyaS/Ghalebino.git
cd Ghalebino
```

Install dependencies:

```bash
npm install
```

---

# 🧪 Initialize the Database

Run the local PGlite migrations:

```bash
npm run db:migrate
```

Then seed the development database:

```bash
npm run db:seed
```

The seed process creates the development/demo accounts and initial application data.

---

# 💻 Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔍 Type Checking

Run TypeScript validation:

```bash
npm run typecheck
```

---

# 📦 Production Build

To validate a production build:

```bash
npm run build
```

Then run:

```bash
npm run start
```

---

# 🧪 Testing Strategy

Testing is being developed across three levels.

## Unit Tests

Business-critical logic should be tested independently, including:

* Business rules
* Price calculations
* Discounts
* Permissions
* Financial calculations
* Status transitions
* Validation

## Integration Tests

Target integration coverage includes:

* Authentication
* Authorization
* Product creation
* Product moderation
* Orders
* Payments
* Downloads
* Reviews
* Seller workflows

## End-to-End Tests

### Customer Flow

```text
Register
 ↓
Login
 ↓
Search
 ↓
Filter
 ↓
Product
 ↓
Add to Cart
 ↓
Checkout
 ↓
Mock Payment
 ↓
Order
 ↓
Download
 ↓
Review
```

### Seller Flow

```text
Register
 ↓
Apply
 ↓
Admin Approval
 ↓
Onboarding
 ↓
Create Product
 ↓
Submit
 ↓
Admin Moderation
 ↓
Publish
 ↓
Sale
 ↓
Earnings
 ↓
Withdrawal
```

### Admin Flow

```text
Login
 ↓
Review Seller
 ↓
Approve Seller
 ↓
Review Product
 ↓
Approve Product
 ↓
Manage Marketplace
 ↓
Review Withdrawal
```

---

# 🧩 Mock Services

When real infrastructure is unavailable during development, the application can use independently abstracted mock services.

Examples:

```text
MockPaymentProvider
MockEmailProvider
MockStorageProvider
MockNotificationProvider
```

A mock service is not intended to mean fake UI.

The application should interact with the mock through the same conceptual interface that a real provider would implement.

---

# 🧮 Data Integrity

Business-critical data must have a clearly defined source of truth.

Examples:

```text
Price
→ Product / Product License

Order Status
→ Order

Payment Status
→ Payment / Transaction

Seller Financial State
→ Financial Ledger

Product Publication
→ Product Workflow

Permissions
→ Authorization System
```

The architecture avoids unnecessary duplication of authoritative business data.

---

# ⚡ Performance

Performance optimization should follow actual application requirements.

Target principles include:

* Server Components where appropriate
* Client Components only where interaction requires them
* Efficient database queries
* Avoiding N+1 queries
* Pagination
* Image optimization
* Lazy loading
* Dynamic imports
* Controlled caching
* Revalidation where appropriate
* Debounced search
* Optimistic UI where appropriate
* Minimal client-side JavaScript

Small interactive elements should not automatically turn entire pages into Client Components.

---

# 🚫 No Fake Functionality

One of the project's core rules is:

> **If a feature is presented as functional in the UI, it must have meaningful behavior behind it.**

This applies particularly to:

* Search
* Filters
* Authentication
* Cart
* Checkout
* Payments
* Orders
* Downloads
* Reviews
* Withdrawals
* Moderation
* Dashboard actions

When an external integration is not yet available, the system should use a proper mock abstraction instead of pretending that a real integration exists.

---

# 🌿 Development Workflow

The recommended Git workflow is:

```text
main
  ↓
develop
  ↓
feature/*
```

Feature branches should remain focused and short-lived.

Examples:

```text
feature/persistent-database
feature/authentication
feature/product-system
feature/search
feature/checkout
feature/seller-platform
```

Commit messages should be explicit and traceable.

Examples:

```text
feat(db): add persistent database infrastructure
feat(auth): implement database-backed sessions
feat(products): add product moderation workflow
fix(auth): prevent unauthorized resource access
docs(readme): update project documentation
```

---

# ✅ Quality Gates

Before integration, a feature should be evaluated through the relevant parts of the following pipeline:

```text
TypeScript
    ↓
Validation
    ↓
Authorization
    ↓
Business Logic
    ↓
Database Integrity
    ↓
Error Handling
    ↓
Responsive UX
    ↓
Accessibility
    ↓
Tests
```

---

# 🗺️ Roadmap

The roadmap follows the project's Master Build Prompt.

## Phase 1 — Foundation

* Next.js App Router
* TypeScript
* Tailwind CSS
* RTL foundation
* Persian typography
* Database foundation
* Drizzle ORM
* Persistent PGlite
* Migration system
* Seed system
* Database-backed users
* Database-backed sessions
* Authentication persistence
* Server-side data-access foundation

## Phase 2 — Authentication & Authorization

* Registration
* Login
* Logout
* Session handling
* Password hashing
* Password reset
* Role-aware access
* Complete permission matrix
* Ownership enforcement
* Email verification
* Security audit

## Phase 3 — Marketplace

* Product discovery
* Advanced search
* Search abstraction
* Advanced filtering
* Sorting
* Categories
* Technology taxonomy
* Collections
* Recommendations
* Recently viewed

## Phase 4 — Product System

* Product lifecycle
* Product versioning
* Changelog
* Documentation
* Live demos
* Product media
* Licensing
* Product moderation
* Product reporting

## Phase 5 — Customer Platform

* Customer dashboard
* Wishlist
* Compare
* Orders
* Downloads
* Reviews
* Q&A
* Support
* Notifications
* Account security

## Phase 6 — Seller Platform

* Seller application
* Seller onboarding
* Seller store
* Product management
* Product submission
* Moderation workflow
* Seller analytics
* Earnings
* Financial ledger
* Withdrawals
* Payout management

## Phase 7 — Commerce

* Production-grade cart
* License-aware pricing
* Checkout
* Payment abstraction
* Mock payment provider
* Order lifecycle
* Refund workflow
* Protected downloads

## Phase 8 — Trust & Community

* Reviews
* Verified purchases
* Helpful votes
* Seller replies
* Q&A
* Reporting
* Moderation center
* Support system

## Phase 9 — Platform Management

* Admin dashboard
* User management
* Seller management
* Product moderation
* Category management
* Technology management
* Financial management
* Withdrawal management
* Reports
* Audit logs
* System health

## Phase 10 — Growth

* Coupons
* Promotions
* Collections
* CMS
* Blog
* SEO
* Analytics
* Recommendation engine

## Phase 11 — Engineering Quality

* Automated testing
* Customer E2E flow
* Seller E2E flow
* Admin E2E flow
* Security audit
* Accessibility audit
* Responsive audit
* Performance audit
* UX audit
* Code audit
* Production deployment validation
* Complete technical documentation

---

# 🔮 Future Extensibility

The architecture is intentionally designed to leave room for future capabilities without unnecessarily over-engineering the current product.

Potential future extensions include:

* Subscriptions
* Memberships
* Affiliate system
* Referral system
* Seller advertising
* Sponsored products
* AI recommendations
* AI-powered search
* Multi-language support
* Multi-currency support
* Mobile applications
* External API
* Advanced search infrastructure
* Fraud detection
* Automated copyright detection

These capabilities are treated as future extension points unless they become part of the active product scope.

---

# 📚 Documentation

Technical documentation is intended to evolve alongside the implementation.

Target documentation structure:

```text
docs/
├── MASTER-BUILD-PROMPT.md
├── ARCHITECTURE.md
├── DATABASE.md
├── AUTHORIZATION.md
├── API.md
├── DESIGN-SYSTEM.md
├── SECURITY.md
├── TESTING.md
├── DEPLOYMENT.md
└── ENVIRONMENT.md
```

### Documentation Responsibilities

**Master Build Prompt**

Defines the product direction, requirements, engineering standards, and long-term scope.

**README**

Explains what the repository currently is, how to run it, its current state, and how developers should interact with it.

**Technical Documentation**

Explains implementation details and architectural decisions.

Documentation must remain synchronized with the actual repository implementation.

---

# 🧠 Engineering Philosophy

Ghalebino follows five fundamental engineering principles.

### Simple

Avoid unnecessary complexity.

### Scalable

Current decisions should not unnecessarily block future growth.

### Explicit

Business logic should be understandable and traceable.

### Secure

The client must never be treated as a trusted authority.

### Maintainable

Code should remain understandable and maintainable by engineers who did not originally write it.

### User-Focused

No feature or interface should exist merely to fill space or make a demo look complete.

---

# 🥇 Priority Order

When engineering trade-offs occur, priorities are:

```text
1. Security
2. Correctness
3. Data Integrity
4. Authorization
5. Core Functionality
6. UX
7. Accessibility
8. Performance
9. Maintainability
10. Visual Polish
```

Visual polish must never compensate for missing business logic or broken security.

---

# ✅ Definition of Done

A feature is not considered complete merely because its UI exists.

Depending on the feature, completion may require:

```text
UI
+
Server Logic
+
Validation
+
Authorization
+
Business Rules
+
Database
+
Error Handling
+
Loading States
+
Empty States
+
Responsive UX
+
Accessibility
+
Tests
```

The exact requirements depend on the domain and risk level of the feature.

---

# 🚀 Production Readiness

Starting the development server successfully is **not** considered proof of production readiness.

Before the project is considered production-ready, it should pass appropriate validation for:

* Production build
* Type checking
* Linting
* Unit tests
* Integration tests
* E2E tests
* Database migrations
* Seed process
* Authentication
* Authorization
* Ownership checks
* Error handling
* Responsive UX
* Accessibility
* SEO
* Security
* Performance
* Data integrity

---

# 📌 Current Implementation Notes

The current repository represents the foundation of the larger marketplace vision.

Implemented foundation includes:

* Next.js App Router
* TypeScript
* Tailwind CSS
* RTL/Persian UI foundation
* Drizzle ORM
* Persistent PGlite database
* Database schema
* Migration system
* Seed system
* Database-backed users
* Database-backed sessions
* Custom authentication persistence
* Server-side database queries
* Password hashing
* Password reset persistence
* Role-aware authentication foundation

The marketplace capabilities described in the roadmap are being implemented incrementally.

This distinction is intentional: **the README documents the actual state of the repository rather than claiming that the entire future roadmap already exists.**

---

# 📄 Master Build Prompt

The project's Master Build Prompt is the source specification for the intended product direction.

It defines the long-term requirements for:

* Product scope
* Marketplace architecture
* UX
* Roles
* Seller lifecycle
* Product lifecycle
* Commerce
* Payments
* Downloads
* Licensing
* Moderation
* Financial systems
* Security
* Accessibility
* Testing
* Documentation
* Production readiness
* Future extensibility

The Master Build Prompt and README serve different purposes.

```text
MASTER BUILD PROMPT
        ↓
What Ghalebino should ultimately become

README
        ↓
What this repository currently is
and how developers work with it
```

The Master Build Prompt should therefore remain a separate specification document rather than replacing this README.

---

# 📜 License

The final project license will be determined according to the project's commercial and legal requirements.

Until an official license is defined, no assumption should be made that the project's source code, assets, or other materials may be redistributed or commercially reused.

---

# 🎯 Project Goal

Ghalebino has one central objective:

> **Build a professional, secure, trustworthy, scalable, and extensible digital marketplace for the Persian-speaking web ecosystem.**

It is not intended to be:

* A landing page
* A UI template
* A dashboard showcase
* A clone of another marketplace
* A collection of disconnected screens

It is intended to become a:

# **Complete Multi-Vendor Digital Marketplace Platform**

where:

```text
Customer
    ↓
discovers products
    ↓
evaluates products
    ↓
purchases products
    ↓
pays securely
    ↓
receives authorized downloads
    ↓
manages licenses
    ↓
leaves reviews
    ↓
receives support
```

while:

```text
Seller
    ↓
applies to the marketplace
    ↓
gets approved
    ↓
creates a store
    ↓
creates products
    ↓
submits products
    ↓
passes moderation
    ↓
publishes products
    ↓
makes sales
    ↓
earns revenue
    ↓
requests withdrawal
    ↓
receives payout
```

and:

```text
Administrator
    ↓
manages users
    ↓
manages sellers
    ↓
moderates products
    ↓
manages commerce
    ↓
controls financial operations
    ↓
handles reports and support
    ↓
audits sensitive activity
    ↓
operates the marketplace
```

The ultimate success criterion is not the visual quality of the homepage.

It is whether the platform can support the **complete marketplace lifecycle** with real data, real business rules, secure authorization, reliable persistence, meaningful UX, and production-oriented engineering.

---

## Built with

**Next.js · React · TypeScript · Tailwind CSS · Drizzle ORM · PGlite · Zod · Vazirmatn**

**Ghalebino — قالبی نو**

*A professional digital marketplace for the Persian web.*