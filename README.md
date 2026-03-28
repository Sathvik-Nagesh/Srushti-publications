# ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ - Srushti Publications 📚

A production-ready e-commerce platform for a Kannada-only physical book publishing company, featuring modern UI/UX and comprehensive admin capabilities.

## 🚀 Key Features

### User Experience
- **Homepage:** Engaging hero section, new releases, best sellers, categories, and offers display.
- **Book Catalog:** Robust search, filters, sorting options, and grid/list views for effortless browsing.
- **Book Details:** Comprehensive descriptions in Kannada, dynamic pricing, add-to-cart, and related book suggestions.
- **Language Support:** Full support for Kannada characters in categories, search, slug generation, and UI elements.

### Checkout & Payments
- **Cart & Checkout:** Seamless guest checkout process, automatic GST calculation, and robust address form.
- **Secure Payment Integration:** Integrated with Razorpay to support UPI, Cards, NetBanking, and Wallets.
- **Order Tracking:** Automated order confirmation pages with invoice downloads available for users.

### Admin & Management
- **Admin Dashboard:** Centralized control over the entire platform.
- **Record Management:** Powerful interfaces to manage books, orders, and categories efficiently.
- **Support for Multi-Language Admins:** English names alongside Kannada titles for easier manageability.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Payment Gateway:** Razorpay
- **State Management:** Zustand
- **UI Components:** Lucide Icons, React Hot Toast

## 📦 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database URL and Razorpay keys

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Seed database
npx ts-node prisma/seed.ts

# 5. Run development server
npm run dev
```

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/srushti"
NEXTAUTH_SECRET="your-secret-32-chars"
# Razorpay configuration
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="xxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxx"
```

## 👤 Admin Access

- **URL:** `/admin`
- **Email:** `admin@srushtipublication.com`
- **Password:** `SrushtiAdmin@2024`

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts)
│   ├── api/              # Secure API routes for books, orders, etc.
│   ├── admin/            # Admin dashboard and content management
│   ├── books/            # Book catalog and detailed views
│   ├── cart/             # Shopping cart interface
│   ├── checkout/         # Multi-step checkout process
│   └── page.tsx          # Main storefront homepage
├── components/           # Reusable UI components
└── lib/                  # Utilities, auth, and prisma configuration
prisma/
├── schema.prisma         # Relational database schema
└── seed.ts               # Sample data population script
```

## 💡 Future Roadmap & Enhancements

Here are suggestions to make the platform even better:

*   **User Accounts & Wishlists:** Allow users to create profiles to view order history, save multiple addresses, and curate wishlists for future purchases.
*   **Customer Reviews & Ratings:** Build trust by allowing users to leave reviews on books they have purchased.
*   **Advanced Analytics Integration:** Integrate Google Analytics, Meta Pixel, or specialized tracking setups to analyze user drops and sales conversions.
*   **Advanced SEO Implementation:** Add schema.org structured data for all books so Google indexes them as products with price and availability directly in search results.
*   **Email Automation Integrations:** Automatically email customers about abandoned carts to recover lost sales. Connect with services like Resend or SendGrid.
*   **Enhanced Loading States:** Add beautiful skeleton loaders instead of simple spinners or empty states.

## 🚀 Deployment

Built to deploy seamlessly to platforms like Vercel, Render, or any other modern Node.js hosting.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

Private - Srushti Publications
