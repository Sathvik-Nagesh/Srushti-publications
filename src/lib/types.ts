// Type definitions for Srushti Publication

// Book Types
export interface Book {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  author: string
  authorEn?: string | null
  description?: string | null
  descriptionEn?: string | null
  coverImage?: string | null
  coverImagePublicId?: string | null
  additionalImages: string[]
  mrp: number
  sellingPrice: number
  discount?: number | null
  discountStart?: Date | null
  discountEnd?: Date | null
  stockQuantity: number
  lowStockAlert: number
  isbn?: string | null
  pages?: number | null
  publicationYear?: number | null
  edition?: string | null
  language: string
  weight?: number | null
  dimensions?: string | null
  isNewRelease: boolean
  isBestSeller: boolean
  isOnSale: boolean
  isFeatured: boolean
  isActive: boolean
  salesCount: number
  viewCount: number
  newReleaseUntil?: Date | null
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  nameEn?: string | null
  slug: string
  description?: string | null
  image?: string | null
  discount?: number | null
  discountStart?: Date | null
  discountEnd?: Date | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  books?: Book[]
}

// Cart Types
export interface CartItem {
  id: string
  quantity: number
  price: number
  bookId: string
  book: Book
}

export interface Cart {
  id: string
  sessionId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

// Order Types
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  discount: number
  bookTitle: string
  bookAuthor: string
  bookCover?: string | null
  bookIsbn?: string | null
  orderId: string
  bookId: string
  book?: Book
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  subtotal: number
  discount: number
  shippingCharge: number
  taxAmount: number
  totalAmount: number
  gstBreakup?: GSTBreakup | null
  paymentStatus: PaymentStatus
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  razorpaySignature?: string | null
  paymentMethod?: string | null
  paidAt?: Date | null
  status: OrderStatus
  notes?: string | null
  courierName?: string | null
  trackingNumber?: string | null
  dispatchedAt?: Date | null
  deliveredAt?: Date | null
  invoiceNumber?: string | null
  invoiceUrl?: string | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface GSTBreakup {
  cgst: number
  sgst: number
  igst: number
  cessAmount?: number
  taxableAmount: number
  totalTax: number
}

// Admin Types
export interface Admin {
  id: string
  email: string
  name: string
  isActive: boolean
  lastLoginAt?: Date | null
}

// Settings Types
export interface SiteSettings {
  id: string
  businessName: string
  businessNameEn: string
  tagline: string
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  gstNumber?: string | null
  panNumber?: string | null
  freeShippingMin?: number | null
  defaultShipping: number
  estimatedDays: string
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  facebook?: string | null
  instagram?: string | null
  twitter?: string | null
  youtube?: string | null
}

// Banner & Offer Types
export interface Banner {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string | null
  isActive: boolean
  sortOrder: number
  startDate?: Date | null
  endDate?: Date | null
}

export interface Offer {
  id: string
  name: string
  description?: string | null
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase?: number | null
  maxDiscount?: number | null
  code?: string | null
  isActive: boolean
  startDate: Date
  endDate: Date
  usageLimit?: number | null
  usedCount: number
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form Types
export interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
}

export interface BookFormData {
  title: string
  titleEn?: string
  author: string
  authorEn?: string
  description: string
  descriptionEn?: string
  categoryId: string
  mrp: number
  sellingPrice: number
  discount?: number
  stockQuantity: number
  isbn?: string
  pages?: number
  publicationYear?: number
  edition?: string
  weight?: number
  dimensions?: string
  isNewRelease: boolean
  isBestSeller: boolean
  isOnSale: boolean
  isFeatured: boolean
  isActive: boolean
}

// Filter Types
export interface BookFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isNewRelease?: boolean
  isBestSeller?: boolean
  isOnSale?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'title'
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalBooks: number
  activeOffers: number
  recentOrders: Order[]
  bestSellingBooks: Book[]
  ordersByStatus: Record<OrderStatus, number>
  revenueByMonth: { month: string; revenue: number }[]
}
