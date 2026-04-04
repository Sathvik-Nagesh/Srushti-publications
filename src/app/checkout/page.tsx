'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, User, Mail, Truck, CreditCard, ShieldCheck, Ticket, X, Check, Lock, Loader2, Copy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCartStore, useCartTotals } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { subtotal } = useCartTotals()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    notes: '',
    createAccount: false,
    password: '',
    saveAddress: false
  })
  
  const { customer } = useAuth()
  
  const [couponCode, setCouponCode] = useState('')
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'QR'>('COD')
  const [paymentScreenshotBase64, setPaymentScreenshotBase64] = useState<string | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} ಕಾಪಿ ಮಾಡಲಾಗಿದೆ! (Copied!)`);
  }

  // Avoid hydration mismatch and fetch coupons
  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
       // Optional: Redirect if cart is empty
    }

    // Auto-fill for logged in users
    if (customer) {
        const names = (customer.name || '').split(' ')
        setFormData(prev => ({
            ...prev,
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            email: customer.email || prev.email,
            phone: customer.phone || prev.phone,
            address: customer.address || prev.address,
            city: customer.city || prev.city,
            state: customer.state || prev.state,
            pincode: customer.pincode || prev.pincode,
        }))
    }

    // Fetch available coupons
    const fetchCoupons = async () => {
      try {
        const res = await fetch('/api/coupons')
        const data = await res.json()
        if (data.success) {
          setAvailableCoupons(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch coupons', error)
      }
    }
    fetchCoupons()

  }, [items, router, customer])

  const shippingCost = subtotal > 500 ? 0 : 50 // Example logic: Free shipping over ₹500
  const total = Math.max(0, subtotal + shippingCost - discountAmount)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked
        setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleApplyCoupon = async (codeOverride?: string) => {
    const code = typeof codeOverride === 'string' ? codeOverride : couponCode
    if (!code.trim()) return
    
    if (typeof codeOverride === 'string') {
        setCouponCode(codeOverride)
    }

    setIsApplyingCoupon(true)
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, subtotal })
      })
      const data = await res.json()

      if (data.success && data.valid) {
        setAppliedCoupon(data.data.code)
        setDiscountAmount(data.data.calculatedDiscount)
        toast.success(`ಕೂಪನ್ "${data.data.code}" ಅನ್ವಯಿಸಲಾಗಿದೆ!`)
      } else {
        toast.error(data.error || 'ಅಮಾನ್ಯ ಕೂಪನ್')
        setAppliedCoupon(null)
        setDiscountAmount(0)
      }
    } catch (error) {
      console.error('Coupon error:', error)
      toast.error('ಕೂಪನ್ ಅನ್ವಯಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create order payload
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
        },
        items: items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price
        })),
        totals: {
            subtotal,
            shipping: shippingCost,
            discount: discountAmount,
            total
        },
        couponCode: appliedCoupon,
        notes: formData.notes,
        createAccount: formData.createAccount,
        password: formData.password,
        saveAddress: formData.saveAddress,
        paymentMethod,
        paymentScreenshotBase64
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      const result = await response.json()

      if (result.success) {
        toast.success('ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ!')
        clearCart()
        router.replace(result.orderNumber ? `/order-success?orderNumber=${result.orderNumber}` : '/order-success')
      } else {
        throw new Error(result.error || 'Order failed')
      }
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('ಆರ್ಡರ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Image src="/logo.jpg" alt="Logo" width={80} height={80} style={{ borderRadius: '50%', marginBottom: '1rem', margin: '0 auto' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ</h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>ಚೆಕ್‌ಔಟ್ ಮಾಡಲು ದಯವಿಟ್ಟು ಪುಸ್ತಕಗಳನ್ನು ಸೇರಿಸಿ.</p>
                    <Link href="/books" className="btn btn-primary">
                        ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-alt)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
             <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', textDecoration: 'none', marginBottom: '1rem' }}>
                <ArrowLeft size={16} /> ಕಾರ್ಟ್‌ಗೆ ಹಿಂತಿರುಗಿ
             </Link>
             <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>ಚೆಕ್‌ಔಟ್ (Checkout)</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Shipping Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <MapPin size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>ವಿಳಾಸ ವಿವರಗಳು (Shipping Details)</h2>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="label">ಮೊದಲ ಹೆಸರು (First Name) *</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input 
                                type="text" 
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="input" 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="ನಿಮ್ಮ ಹೆಸರು" 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">ಕಡೆಯ ಹೆಸರು (Last Name)</label>
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="input" 
                            placeholder="ನಿಮ್ಮ ಉಪನಾಮ" 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">ಇಮೇಲ್ (Email) *</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input" 
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="example@mail.com" 
                        />
                    </div>
                     {!customer && (
                       <div style={{ marginTop: '0.5rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                              <input 
                                  type="checkbox"
                                  name="createAccount"
                                  checked={formData.createAccount as boolean}
                                  onChange={handleInputChange}
                                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                              />
                              ನನಗಾಗಿ ಖಾತೆಯನ್ನು ರಚಿಸಿ (Create an account for me)
                          </label>
                      </div>
                     )}
                </div>

                {formData.createAccount && (
                    <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <label className="label">ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ (Create Password) *</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input 
                                type="password" 
                                name="password"
                                required={formData.createAccount}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="input" 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="********" 
                                minLength={6}
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು (Minimum 6 characters)</p>
                    </div>
                )}

                <div className="form-group">
                    <label className="label">ಫೋನ್ ಸಂಖ್ಯೆ (Phone) *</label>
                    <div style={{ position: 'relative' }}>
                         <Phone size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input 
                            type="tel" 
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="input" 
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="9876543210" 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">ವಿಳಾಸ (Address) *</label>
                    <textarea 
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input" 
                        rows={3} 
                        placeholder="ಮನೆ ನಂ, ರಸ್ತೆ, ಪ್ರದೇಶ"
                    ></textarea>
                     {customer && (
                       <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                         <input
                           type="checkbox"
                           name="saveAddress"
                           checked={formData.saveAddress}
                           onChange={handleInputChange}
                           style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                         />
                         ಈ ವಿಳಾಸವನ್ನು ನನ್ನ ಪ್ರೊಫೈಲ್‌ಗೆ ಉಳಿಸಿ (Save to profile)
                       </label>
                     )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">ನಗರ (City) *</label>
                        <input 
                            type="text" 
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="input" 
                            placeholder="ಬೆಂಗಳೂರು" 
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">ಪಿನ್ ಕೋಡ್ (Pincode) *</label>
                        <input 
                            type="text" 
                            name="pincode"
                            required
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="input" 
                            placeholder="560001" 
                        />
                    </div>
                </div>

                 <div className="form-group">
                    <label className="label">ರಾಜ್ಯ (State) *</label>
                    <input 
                        type="text"
                        name="state"
                        required
                        list="indian-states"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..."
                    />
                    <datalist id="indian-states">
                        <option value="Karnataka">ಕರ್ನಾಟಕ (Karnataka)</option>
                        <option value="Andhra Pradesh">ಆಂಧ್ರಪ್ರದೇಶ (Andhra Pradesh)</option>
                        <option value="Arunachal Pradesh">ಅರುಣಾಚಲ ಪ್ರದೇಶ (Arunachal Pradesh)</option>
                        <option value="Assam">ಅಸ್ಸಾಂ (Assam)</option>
                        <option value="Bihar">ಬಿಹಾರ (Bihar)</option>
                        <option value="Chhattisgarh">ಛತ್ತೀಸ್‌ಗಢ (Chhattisgarh)</option>
                        <option value="Goa">ಗೋವಾ (Goa)</option>
                        <option value="Gujarat">ಗುಜರಾತ್ (Gujarat)</option>
                        <option value="Haryana">ಹರಿಯಾಣ (Haryana)</option>
                        <option value="Himachal Pradesh">ಹಿಮಾಚಲ ಪ್ರದೇಶ (Himachal Pradesh)</option>
                        <option value="Jharkhand">ಜಾರ್ಖಂಡ್ (Jharkhand)</option>
                        <option value="Kerala">ಕೇರಳ (Kerala)</option>
                        <option value="Madhya Pradesh">ಮಧ್ಯಪ್ರದೇಶ (Madhya Pradesh)</option>
                        <option value="Maharashtra">ಮಹಾರಾಷ್ಟ್ರ (Maharashtra)</option>
                        <option value="Manipur">ಮಣಿಪುರ (Manipur)</option>
                        <option value="Meghalaya">ಮೇಘಾಲಯ (Meghalaya)</option>
                        <option value="Mizoram">ಮಿಜೋರಾಂ (Mizoram)</option>
                        <option value="Nagaland">ನಾಗಾಲ್ಯಾಂಡ್ (Nagaland)</option>
                        <option value="Odisha">ಒಡಿಶಾ (Odisha)</option>
                        <option value="Punjab">ಪಂಜಾಬ್ (Punjab)</option>
                        <option value="Rajasthan">ರಾಜಸ್ಥಾನ (Rajasthan)</option>
                        <option value="Sikkim">ಸಿಕ್ಕಿಂ (Sikkim)</option>
                        <option value="Tamil Nadu">ತಮಿಳುನಾಡು (Tamil Nadu)</option>
                        <option value="Telangana">ತೆಲಂಗಾಣ (Telangana)</option>
                        <option value="Tripura">ತ್ರಿಪುರಾ (Tripura)</option>
                        <option value="Uttar Pradesh">ಉತ್ತರ ಪ್ರದೇಶ (Uttar Pradesh)</option>
                        <option value="Uttarakhand">ಉತ್ತರಾಖಂಡ (Uttarakhand)</option>
                        <option value="West Bengal">ಪಶ್ಚಿಮ ಬಂಗಾಳ (West Bengal)</option>
                    </datalist>
                </div>
                
                <div className="form-group">
                  <label className="label">ಟಿಪ್ಪಣಿಗಳು (Order Notes) - Optional</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input"
                    rows={2}
                    placeholder="ಏನಾದರೂ ವಿಶೇಷ ಸೂಚನೆಗಳಿದ್ದರೆ ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <Truck size={24} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>ಆರ್ಡರ್ ಸಾರಾಂಶ (Order Summary)</h2>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                        {items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ position: 'relative', width: '60px', height: '80px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: '#f3f4f6' }}>
                                    <Image src={item.book.coverImage || '/placeholder-book.jpg'} alt={item.book.title} fill style={{ objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.book.title}</p>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem' }}>{formatCurrency(item.price)} x {item.quantity}</p>
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                     {/* Coupon Section */}
                     <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <label className="label" style={{ fontSize: '0.9rem' }}>ಕೂಪನ್ ಕೋಡ್ (Coupon Code)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Ticket size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="SAVE10"
                                    className="input"
                                    style={{ paddingLeft: '2.25rem', paddingRight: appliedCoupon ? '2.25rem' : '0.75rem' }}
                                    disabled={appliedCoupon !== null}
                                />
                                
                                {appliedCoupon && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setAppliedCoupon(null)
                                            setDiscountAmount(0)
                                            setCouponCode('')
                                            toast.success('ಕೂಪನ್ ತೆಗೆದುಹಾಕಲಾಗಿದೆ')
                                        }}
                                        style={{ position: 'absolute', top: '50%', right: '0.5rem', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <button 
                                type="button"
                                onClick={() => handleApplyCoupon()}
                                disabled={isApplyingCoupon || !couponCode || appliedCoupon !== null}
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1rem', height: '42px' }}
                            >
                                {isApplyingCoupon ? '...' : (appliedCoupon ? 'ಅನ್ವಯಿಸಲಾಗಿದೆ' : 'ಅನ್ವಯಿಸಿ')}
                            </button>
                        </div>
                        
                        {availableCoupons.length > 0 && !appliedCoupon && (
                            <div style={{ marginTop: '0.75rem', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Ticket size={12} />
                                    ಲಭ್ಯವಿರುವ ಕೂಪನ್‌ಗಳು (Available Coupons):
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {availableCoupons.map(coupon => (
                                        <button
                                            key={coupon.id}
                                            type="button"
                                            onClick={() => handleApplyCoupon(coupon.code)}
                                            style={{
                                                background: 'white',
                                                border: '1px dashed var(--color-primary)',
                                                borderRadius: '4px',
                                                padding: '0.35rem 0.75rem',
                                                fontSize: '0.8rem',
                                                color: 'var(--color-primary)',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-50)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            {coupon.code}
                                            {coupon.discountValue && (
                                                <span style={{ opacity: 0.7, marginLeft: '4px', fontSize: '0.75em' }}>
                                                    ({coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {appliedCoupon && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Check size={14} /> ಕೂಪನ್ "{appliedCoupon}" ಅನ್ವಯಿಸಲಾಗಿದೆ!
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--color-text-light)' }}>ಒಟ್ಟು ಮೊತ್ತ (Subtotal)</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--color-text-light)' }}>ಶಿಪ್ಪಿಂಗ್ (Shipping)</span>
                            <span style={{ fontWeight: 600, color: shippingCost === 0 ? 'var(--color-success)' : 'inherit' }}>
                                {shippingCost === 0 ? 'ಉಚಿತ (Free)' : formatCurrency(shippingCost)}
                            </span>
                        </div>
                        {discountAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                <span>ರಿಯಾಯಿತಿ (Discount)</span>
                                <span style={{ fontWeight: 600 }}>- {formatCurrency(discountAmount)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '2px dashed var(--color-border)', fontSize: '1.25rem', fontWeight: 700 }}>
                            <span>ಒಟ್ಟು (Total)</span>
                            <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(total)}</span>
                        </div>
                        {shippingCost === 0 && (
                            <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-dark)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
                                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }}/>
                                ನೀವು ಉಚಿತ ಶಿಪ್ಪಿಂಗ್‌ಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ!
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <CreditCard size={24} style={{ color: 'var(--color-primary)' }} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>ಪಾವತಿ ವಿಧಾನ (Payment Method)</h2>
                    </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentMethod === 'COD' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: paymentMethod === 'COD' ? 'var(--color-primary-50)' : 'transparent', cursor: 'pointer' }}>
                             <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }} />
                             <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: 600 }}>ನಗದು ಪಾವತಿ (Cash on Delivery)</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>ಉತ್ಪನ್ನ ತಲುಪಿದಾಗ ಹಣ ಪಾವತಿಸಿ</span>
                             </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: paymentMethod === 'QR' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: paymentMethod === 'QR' ? 'var(--color-primary-50)' : 'transparent', cursor: 'pointer' }}>
                             <input type="radio" name="payment" checked={paymentMethod === 'QR'} onChange={() => setPaymentMethod('QR')} style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }} />
                             <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: 600 }}>QR Code (UPI Payment)</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Scan the QR code and upload screenshot</span>
                             </div>
                        </label>
                        
                        {paymentMethod === 'QR' && (
                             <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                 <img src="/upi-qr.jpeg" alt="UPI QR Code" style={{ width: '100%', maxWidth: '250px', height: 'auto', borderRadius: '8px', border: '1px solid var(--color-border)', objectFit: 'contain' }} />
                                 <p style={{ fontSize: '0.85rem', textAlign: 'center', color: 'var(--color-text)' }}>
                                     Please scan this PhonePe QR code using any UPI app and pay <strong>{formatCurrency(total)}</strong>.<br/>
                                     After payment, please upload the screenshot below. Your order will be processed once verified manually.
                                 </p>
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)' }}>
                                         <span style={{ fontSize: '0.85rem' }}><strong>UPI ID:</strong> srushtinagesh4@axl</span>
                                         <button type="button" onClick={() => copyToClipboard('srushtinagesh4@axl', 'UPI ID')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Copy UPI ID"><Copy size={16} /></button>
                                     </div>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-bg-alt)' }}>
                                         <span style={{ fontSize: '0.85rem' }}><strong>Phone:</strong> 9845096668</span>
                                         <button type="button" onClick={() => copyToClipboard('9845096668', 'Phone Number')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Copy Phone Number"><Copy size={16} /></button>
                                     </div>
                                 </div>
                                 <input type="file" accept="image/*" onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) {
                                         if (file.size > 10 * 1024 * 1024) {
                                             toast.error('File too large (max 10MB)');
                                             e.target.value = '';
                                             return;
                                         }
                                         const reader = new FileReader();
                                         reader.onloadend = () => {
                                             setPaymentScreenshotBase64(reader.result as string);
                                         };
                                         reader.readAsDataURL(file);
                                     } else {
                                         setPaymentScreenshotBase64(null);
                                     }
                                 }} style={{ fontSize: '0.85rem', width: '100%', padding: '0.5rem', border: '1px dashed var(--color-border)', borderRadius: '4px' }} />
                                 {paymentScreenshotBase64 && (
                                     <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}><Check size={14} style={{ display: 'inline' }} /> Screenshot attached</span>
                                 )}
                             </div>
                        )}
                     </div>
                </div>

                <button 
                    type="submit" 
                    form="checkout-form"
                    disabled={isSubmitting || (paymentMethod === 'QR' && !paymentScreenshotBase64)}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...
                        </>
                    ) : (
                        `ಆರ್ಡರ್ ಮಾಡಿ (Place Order) • ${formatCurrency(total)}`
                    )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
                    <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    ನಿಮ್ಮ ಮಾಹಿತಿಯು ನಮ್ಮೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.
                </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
