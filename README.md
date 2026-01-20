# ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ - Kannada Books E-Commerce

A production-ready MVP for a Kannada-only physical book publishing company.

## 🚀 Features

- **Homepage**: Hero section, new releases, best sellers, categories, offers
- **Book Catalog**: Search, filters, sorting, grid/list views
- **Book Details**: Full description, pricing, add to cart, related books
- **Cart & Checkout**: Guest checkout, GST calculation, address form
- **Payment**: Razorpay integration (UPI, Cards, NetBanking, Wallets)
- **Order Confirmation**: Success page with invoice download
- **Admin Panel**: Dashboard, books/orders/categories management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Payment**: Razorpay
- **State**: Zustand
- **UI**: Lucide Icons, React Hot Toast

## 📦 Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database URL and Razorpay keys

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Seed database (200 books)
npx ts-node prisma/seed.ts

# 5. Run development server
npm run dev
```

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/srushti"
NEXTAUTH_SECRET="your-secret-32-chars"
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="xxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxx"
```

## 👤 Admin Access

- URL: `/admin`
- Email: `admin@srushtipublication.com`
- Password: `SrushtiAdmin@2024`

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── admin/            # Admin panel
│   ├── books/            # Book pages
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout page
│   └── page.tsx          # Homepage
├── components/           # Reusable components
└── lib/                  # Utilities & types
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Seed data
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy to Vercel, Render, or any Node.js hosting.

## 📄 License

Private - Srushti Publications
