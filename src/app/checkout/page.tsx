'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CheckoutProgress from '@/components/CheckoutProgress'
import TrustBadges from '@/components/TrustBadges'
import { useCartStore, useCartTotals } from '@/lib/store'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, INDIAN_STATES, isValidEmail, isValidPhone, isValidPincode, calculateGST } from '@/lib/utils'
import { 
  Lock, 
  CreditCard, 
  Truck, 
  FileText, 
  ChevronRight,
  ShoppingBag,
  Check,
  AlertCircle,
  BookOpen,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface FormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  password?: string // Optional password for account creation
}

interface FormErrors {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingState?: string
  shippingPincode?: string
  password?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { subtotal, itemCount, totalMrp, savings } = useCartTotals()
  const { customer, isAuthenticated, register } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [createAccount, setCreateAccount] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Coupon code state
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [appliedCouponName, setAppliedCouponName] = useState('')
  
  // Available coupons from backend
  const [availableCoupons, setAvailableCoupons] = useState<{
    eligible: Array<{ code: string; name: string; description?: string; calculatedDiscount: number; discountType: string; discountValue: number; minPurchase?: number }>
    upcoming: Array<{ code: string; name: string; amountNeeded: number; minPurchase?: number }>
    bestOffer: { code: string; name: string; calculatedDiscount: number } | null
  }>({ eligible: [], upcoming: [], bestOffer: null })
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  
  // Lazy state initialization - defers object creation until needed
  // Per Vercel best practices: rerender-lazy-state-init
  const [formData, setFormData] = useState<FormData>(() => ({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: 'Karnataka',
    shippingPincode: '',
    password: ''
  }))
  
  const [errors, setErrors] = useState<FormErrors>(() => ({}))
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Pre-fill customer data when authenticated
  useEffect(() => {
    if (isAuthenticated && customer && mounted) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || customer.name || '',
        customerEmail: prev.customerEmail || customer.email || '',
        customerPhone: prev.customerPhone || customer.phone || '',
        shippingAddress: prev.shippingAddress || customer.address || '',
        shippingCity: prev.shippingCity || customer.city || '',
        shippingState: prev.shippingState || customer.state || 'Karnataka',
        shippingPincode: prev.shippingPincode || customer.pincode || ''
      }))
    }
  }, [isAuthenticated, customer, mounted])
  
  // Fetch available coupons when subtotal changes
  useEffect(() => {
    if (!mounted || subtotal <= 0) return
    
    const fetchCoupons = async () => {
      setIsLoadingCoupons(true)
      try {
        const response = await fetch(`/api/coupons?subtotal=${subtotal}`)
        const data = await response.json()
        if (data.success && data.data) {
          setAvailableCoupons(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch coupons:', error)
      } finally {
        setIsLoadingCoupons(false)
      }
    }
    
    fetchCoupons()
  }, [mounted, subtotal])
  
  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items, router])
  
  // Apply coupon function - now uses backend API
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCode
    if (!code) return
    
    setCouponError('')
    setIsApplyingCoupon(true)
    
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          subtotal
        })
      })
      
      const data = await response.json()
      
      if (!data.success || !data.valid) {
        setCouponError(data.error || 'ಅಮಾನ್ಯ ಕೂಪನ್ ಕೋಡ್')
        setCouponDiscount(0)
        setCouponApplied(false)
      } else {
        setCouponCode(data.data.code)
        setCouponDiscount(data.data.calculatedDiscount)
        setAppliedCouponName(data.data.name)
        setCouponApplied(true)
        toast.success(`🎉 ₹${data.data.calculatedDiscount} ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಲಾಗಿದೆ!`)
      }
    } catch (error) {
      console.error('Coupon apply error:', error)
      setCouponError('ಕೂಪನ್ ಪರಿಶೀಲನೆ ವಿಫಲ')
      setCouponApplied(false)
    } finally {
      setIsApplyingCoupon(false)
    }
  }
  
  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponApplied(false)
    setCouponError('')
    setAppliedCouponName('')
    toast.success('ಕೂಪನ್ ತೆಗೆದುಹಾಕಲಾಗಿದೆ')
  }
  
  // Calculate totals
  const shippingCharge = subtotal >= 500 ? 0 : 50
  const isSameState = formData.shippingState === 'Karnataka' || formData.shippingState === 'KA'
  const gst = calculateGST(subtotal - couponDiscount, isSameState)
  const orderTotal = subtotal - couponDiscount + gst.totalTax + shippingCharge
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'ಹೆಸರು ಅಗತ್ಯವಿದೆ'
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'ಇ-ಮೇಲ್ ಅಗತ್ಯವಿದೆ'
    } else if (!isValidEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'ಅಮಾನ್ಯ ಇ-ಮೇಲ್ ವಿಳಾಸ'
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'ಫೋನ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ'
    } else if (!isValidPhone(formData.customerPhone)) {
      newErrors.customerPhone = 'ಅಮಾನ್ಯ ಫೋನ್ ಸಂಖ್ಯೆ'
    }
    
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'ವಿಳಾಸ ಅಗತ್ಯವಿದೆ'
    }
    
    if (!formData.shippingCity.trim()) {
      newErrors.shippingCity = 'ನಗರ ಅಗತ್ಯವಿದೆ'
    }
    
    if (!formData.shippingState) {
      newErrors.shippingState = 'ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ'
    }
    
    if (!formData.shippingPincode.trim()) {
      newErrors.shippingPincode = 'ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ'
    } else if (!isValidPincode(formData.shippingPincode)) {
      newErrors.shippingPincode = 'ಅಮಾನ್ಯ ಪಿನ್‌ಕೋಡ್'
    }
    
    if (createAccount && !isAuthenticated) {
      if (!formData.password?.trim()) {
        newErrors.password = 'ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿದೆ'
      } else if (formData.password.length < 6) {
        newErrors.password = 'ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleContinueToPayment = async () => {
    if (validateForm()) {
      if (createAccount && !isAuthenticated) {
        setIsProcessing(true)
        const result = await register({
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          password: formData.password || ''
        })
        setIsProcessing(false)
        
        if (!result.success) {
          toast.error(result.error || 'ಖಾತೆ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ')
          // Optional: Ask if they want to continue as guest despite error?
          // For now, let them fix error or uncheck box
          return
        }
        
        toast.success('ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!')
      }
      
      setCurrentStep(2)
    } else {
      toast.error('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ')
    }
  }
  
  const handlePayment = async () => {
    if (!validateForm()) {
      setCurrentStep(1)
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Create order in backend
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity
          }))
        })
      })
      
      const orderData = await orderResponse.json()
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }
      
      const { order, razorpayOrder } = orderData.data
      
      // If Razorpay order was created, open payment modal
      if (razorpayOrder && window.Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: 'INR',
          name: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrder.id,
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone
          },
          notes: {
            orderNumber: order.orderNumber
          },
          theme: {
            color: '#d97706'
          },
          handler: async function(response: any) {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/orders/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderNumber: order.orderNumber
                })
              })
              
              const verifyData = await verifyResponse.json()
              
              if (verifyData.success) {
                clearCart()
                toast.success('ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!')
                router.push(`/order-confirmation?orderNumber=${order.orderNumber}`)
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (error) {
              toast.error('ಪಾವತಿ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ')
            }
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false)
              toast.error('ಪಾವತಿ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ')
            }
          }
        }
        
        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        // Demo mode - skip payment
        clearCart()
        toast.success('ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಮಾಡಲಾಗಿದೆ! (ಡೆಮೋ ಮೋಡ್)')
        router.push(`/order-confirmation?orderNumber=${order.orderNumber}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('ಆರ್ಡರ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  if (!mounted || items.length === 0) {
    return null
  }
  
  return (
    <>
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
          padding: '2rem 0'
        }}>
          <div className="container">
            <nav style={{ marginBottom: '0.5rem' }}>
              <Link href="/" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಮುಖಪುಟ</Link>
              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>/</span>
              <Link href="/cart" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>ಕಾರ್ಟ್</Link>
              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>/</span>
              <span style={{ color: 'var(--color-text)' }}>ಚೆಕ್‌ಔಟ್</span>
            </nav>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
              💳 ಚೆಕ್‌ಔಟ್
            </h1>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="container" style={{ padding: '1.5rem 1rem 0' }}>
          <CheckoutProgress currentStep={currentStep === 1 ? 2 : 3} />
        </div>
        
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <div className="checkout-grid">
            {/* Main Content */}
            <div>
              {currentStep === 1 && (
                <div style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    <Truck size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    ಶಿಪ್ಪಿಂಗ್ ವಿವರಗಳು
                  </h2>
                  
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {/* Name */}
                    <div className="form-group">
                      <label className="label">
                        ಪೂರ್ಣ ಹೆಸರು <span style={{ color: 'var(--color-error)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={`input ${errors.customerName ? 'input-error' : ''}`}
                        placeholder="ನಿಮ್ಮ ಹೆಸರು"
                      />
                      {errors.customerName && (
                        <p className="form-error">{errors.customerName}</p>
                      )}
                    </div>
                    
                    {/* Email & Phone Row */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="label">
                          ಇ-ಮೇಲ್ <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          className={`input ${errors.customerEmail ? 'input-error' : ''}`}
                          placeholder="email@example.com"
                        />
                        {errors.customerEmail && (
                          <p className="form-error">{errors.customerEmail}</p>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label className="label">
                          ಫೋನ್ ಸಂಖ್ಯೆ <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          className={`input ${errors.customerPhone ? 'input-error' : ''}`}
                          placeholder="9876543210"
                        />
                        {errors.customerPhone && (
                          <p className="form-error">{errors.customerPhone}</p>
                        )}
                      </div>
                    </div>

                    {/* Optional Account Creation */}
                    {!isAuthenticated && (
                      <div className="form-group" style={{ 
                        background: 'var(--color-bg-alt)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-md)',
                        marginTop: '-0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: createAccount ? '1rem' : 0 }}>
                          <input
                            type="checkbox"
                            id="createAccount"
                            checked={createAccount}
                            onChange={(e) => setCreateAccount(e.target.checked)}
                            style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                          />
                          <label htmlFor="createAccount" style={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.9375rem' }}>
                            ನನಗಾಗಿ ಖಾತೆಯನ್ನು ರಚಿಸಿ (ಐಚ್ಛಿಕ)
                          </label>
                        </div>
                        
                        {createAccount && (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label">
                              ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`input ${errors.password ? 'input-error' : ''}`}
                                placeholder="ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                  position: 'absolute',
                                  right: '0.75rem',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'var(--color-text-muted)'
                                }}
                              >
                                {showPassword ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="form-error">{errors.password}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Address */}
                    <div className="form-group">
                      <label className="label">
                        ವಿಳಾಸ <span style={{ color: 'var(--color-error)' }}>*</span>
                      </label>
                      <textarea
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        className={`input ${errors.shippingAddress ? 'input-error' : ''}`}
                        placeholder="ಮನೆ ಸಂಖ್ಯೆ, ಬೀದಿ, ಪ್ರದೇಶ"
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                      {errors.shippingAddress && (
                        <p className="form-error">{errors.shippingAddress}</p>
                      )}
                    </div>
                    
                    {/* City, State, Pincode Row */}
                    <div className="form-row-3">
                      <div className="form-group">
                        <label className="label">
                          ನಗರ <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          className={`input ${errors.shippingCity ? 'input-error' : ''}`}
                          placeholder="ಬೆಂಗಳೂರು"
                        />
                        {errors.shippingCity && (
                          <p className="form-error">{errors.shippingCity}</p>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label className="label">
                          ರಾಜ್ಯ <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <select
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          className={`input select ${errors.shippingState ? 'input-error' : ''}`}
                        >
                          <option value="">ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ</option>
                          {INDIAN_STATES.map(state => (
                            <option key={state.code} value={state.name}>
                              {state.nameKn}
                            </option>
                          ))}
                        </select>
                        {errors.shippingState && (
                          <p className="form-error">{errors.shippingState}</p>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label className="label">
                          ಪಿನ್‌ಕೋಡ್ <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="shippingPincode"
                          value={formData.shippingPincode}
                          onChange={handleInputChange}
                          className={`input ${errors.shippingPincode ? 'input-error' : ''}`}
                          placeholder="560001"
                          maxLength={6}
                        />
                        {errors.shippingPincode && (
                          <p className="form-error">{errors.shippingPincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleContinueToPayment}
                    disabled={isProcessing}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner" style={{ width: 20, height: 20 }} />
                        ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...
                      </>
                    ) : (
                      <>
                        ಪಾವತಿಗೆ ಮುಂದುವರಿಸಿ
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {currentStep === 2 && (
                <div style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    <CreditCard size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    ಪಾವತಿ ವಿಧಾನ
                  </h2>
                  
                  {/* Shipping Summary */}
                  <div style={{
                    background: 'var(--color-cream-light)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                          {formData.customerName}<br />
                          {formData.shippingAddress}<br />
                          {formData.shippingCity}, {formData.shippingState} - {formData.shippingPincode}<br />
                          📞 {formData.customerPhone}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        ಬದಲಾಯಿಸಿ
                      </button>
                    </div>
                  </div>
                  
                  {/* Payment Options */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--color-text-light)',
                      marginBottom: '1rem'
                    }}>
                      Razorpay ಮೂಲಕ ಸುರಕ್ಷಿತ ಪಾವತಿ. UPI, ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್, ಮತ್ತು ವಾಲೆಟ್‌ಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: 'var(--color-bg-alt)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      {['UPI', 'Cards', 'NetBanking', 'Wallet'].map(method => (
                        <div
                          key={method}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            border: '1px solid var(--color-border)'
                          }}
                        >
                          {method}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner" style={{ width: 20, height: 20 }} />
                        ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        {formatCurrency(orderTotal)} ಪಾವತಿಸಿ
                      </>
                    )}
                  </button>
                  
                  <p style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '1rem'
                  }}>
                    🔒 ನಿಮ್ಮ ಪಾವತಿ ಮಾಹಿತಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆಗಿದೆ
                  </p>
                </div>
              )}
            </div>
            
            {/* Order Summary Sidebar */}
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '90px'
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                <ShoppingBag size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                ಆರ್ಡರ್ ಸಾರಾಂಶ
              </h2>
              
              {/* Cart Items Preview */}
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                marginBottom: '1rem'
              }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '65px',
                      background: 'var(--color-cream-light)',
                      borderRadius: 'var(--radius-md)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <BookOpen size={20} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 500,
                        marginBottom: '0.125rem'
                      }}>
                        {item.book.title}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-text-light)',
                        margin: 0
                      }}>
                        ×{item.quantity} · {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Code Section */}
              <div style={{
                background: 'var(--color-cream-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  🎟️ ಕೂಪನ್ ಕೋಡ್
                </label>
                
                {couponApplied ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#10b98120',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed #10b981'
                  }}>
                    <div>
                      <span style={{
                        fontWeight: 600,
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Check size={16} />
                        {couponCode.toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)'
                      }}>
                        ₹{couponDiscount} ಉಳಿತಾಯ
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      ತೆಗೆದುಹಾಕಿ
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase())
                          setCouponError('')
                        }}
                        placeholder="ಕೂಪನ್ ಕೋಡ್ ನಮೂದಿಸಿ"
                        className="input"
                        style={{
                          flex: 1,
                          textTransform: 'uppercase',
                          fontSize: '0.875rem'
                        }}
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={!couponCode || isApplyingCoupon}
                        className="btn btn-outline"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        {isApplyingCoupon ? '...' : 'ಅನ್ವಯಿಸಿ'}
                      </button>
                    </div>
                    {couponError && (
                      <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        margin: '0.5rem 0 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <AlertCircle size={12} />
                        {couponError}
                      </p>
                    )}
                    
                    {/* Smart Coupon Suggestions */}
                    {!couponApplied && availableCoupons.eligible.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <p style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          marginBottom: '0.5rem'
                        }}>
                          🎁 ಲಭ್ಯವಿರುವ ಕೂಪನ್‌ಗಳು:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {availableCoupons.eligible.slice(0, 3).map((coupon) => (
                            <button
                              key={coupon.code}
                              onClick={() => handleApplyCoupon(coupon.code)}
                              disabled={isApplyingCoupon}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0.75rem',
                                background: availableCoupons.bestOffer?.code === coupon.code 
                                  ? 'linear-gradient(135deg, #10b98120 0%, #10b98110 100%)' 
                                  : 'white',
                                border: availableCoupons.bestOffer?.code === coupon.code 
                                  ? '1px solid #10b981' 
                                  : '1px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ textAlign: 'left' }}>
                                <span style={{ 
                                  fontWeight: 600, 
                                  color: 'var(--color-primary)',
                                  display: 'block'
                                }}>
                                  {coupon.code}
                                  {availableCoupons.bestOffer?.code === coupon.code && (
                                    <span style={{
                                      marginLeft: '0.5rem',
                                      background: '#10b981',
                                      color: 'white',
                                      padding: '0.125rem 0.375rem',
                                      borderRadius: '9999px',
                                      fontSize: '0.625rem'
                                    }}>
                                      ಅತ್ಯುತ್ತಮ
                                    </span>
                                  )}
                                </span>
                                <span style={{ color: 'var(--color-text-light)', fontSize: '0.6875rem' }}>
                                  {coupon.discountType === 'percentage' 
                                    ? `${coupon.discountValue}% ರಿಯಾಯಿತಿ` 
                                    : `₹${coupon.discountValue} ರಿಯಾಯಿತಿ`}
                                </span>
                              </div>
                              <span style={{
                                fontWeight: 700,
                                color: '#10b981',
                                fontSize: '0.8125rem'
                              }}>
                                -₹{coupon.calculatedDiscount}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show upcoming offers if no eligible ones */}
                    {!couponApplied && availableCoupons.eligible.length === 0 && availableCoupons.upcoming.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <p style={{
                          fontSize: '0.6875rem',
                          color: 'var(--color-text-muted)',
                          margin: 0
                        }}>
                          💡 ₹{Math.ceil(availableCoupons.upcoming[0].amountNeeded)} ಹೆಚ್ಚು ಸೇರಿಸಿ {availableCoupons.upcoming[0].code} ಕೂಪನ್ ಅನ್ಲಾಕ್ ಮಾಡಿ!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>ಉಪಮೊತ್ತ</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {savings > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-success)'
                  }}>
                    <span>ಉಳಿತಾಯ</span>
                    <span>- {formatCurrency(savings)}</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--color-success)'
                  }}>
                    <span>🎟️ ಕೂಪನ್ ರಿಯಾಯಿತಿ</span>
                    <span>- {formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>
                    GST ({isSameState ? 'CGST + SGST' : 'IGST'})
                  </span>
                  <span>{formatCurrency(gst.totalTax)}</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ color: 'var(--color-text-light)' }}>ಶಿಪ್ಪಿಂಗ್</span>
                  {shippingCharge === 0 ? (
                    <span style={{ color: 'var(--color-success)' }}>ಉಚಿತ</span>
                  ) : (
                    <span>{formatCurrency(shippingCharge)}</span>
                  )}
                </div>
              </div>
              
              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '2px solid var(--color-border)'
              }}>
                <span style={{ fontWeight: 600 }}>ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದದ್ದು</span>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: 'var(--color-primary)' 
                }}>
                  {formatCurrency(orderTotal)}
                </span>
              </div>
              
              {/* GST Note */}
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: 'var(--color-text-light)'
              }}>
                <FileText size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                GST ಇನ್‌ವಾಯ್ಸ್ ಆರ್ಡರ್‌ನೊಂದಿಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ
              </div>
            </div>
            
            {/* Trust Badges */}
            <div style={{ marginTop: '1rem' }}>
              <TrustBadges variant="vertical" showPaymentIcons={true} />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: start;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
