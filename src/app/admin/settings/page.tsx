'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Save, Building, Mail, Phone, MapPin, FileText, Truck, CreditCard, Settings, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    businessName: '', businessNameEn: '',
    tagline: '', email: '',
    phone: '', whatsapp: '',
    address: '', city: 'ಬೆಂಗಳೂರು', state: 'ಕರ್ನಾಟಕ', pincode: '560041',
    gstNumber: '', panNumber: '',
    defaultShipping: '50', freeShippingMin: '500', estimatedDays: '5-7 ದಿನಗಳು',
    razorpayKeyId: '', razorpayKeySecret: '',
    socialFacebook: '', socialInstagram: '', socialTwitter: '', socialYoutube: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success && data.data) {
        const s = data.data
        setSettings(prev => ({
          ...prev,
          businessName: s.businessName || '',
          businessNameEn: s.businessNameEn || '',
          tagline: s.tagline || '',
          email: s.email || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          address: s.address || '', 
          // Note: DB only stores full address string currently, so city/state might need manual setting if not parsed
          
          gstNumber: s.gstNumber || '',
          panNumber: s.panNumber || '',
          defaultShipping: s.defaultShipping?.toString() || '50',
          freeShippingMin: s.freeShippingMin?.toString() || '500',
          estimatedDays: s.estimatedDays || '',
          razorpayKeyId: s.razorpayKeyId || '',
          razorpayKeySecret: s.razorpaySecret || '', // Mapped from DB razorpaySecret
          socialFacebook: s.facebook || '',
          socialInstagram: s.instagram || '',
          socialTwitter: s.twitter || '',
          socialYoutube: s.youtube || ''
        }))
      }
    } catch (e) {
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!')
      } else {
        toast.error('ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
      }
    } catch (error) {
       toast.error('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'ಸಾಮಾನ್ಯ', icon: Building },
    { id: 'gst', label: 'GST & ತೆರಿಗೆ', icon: FileText },
    { id: 'shipping', label: 'ಶಿಪ್ಪಿಂಗ್', icon: Truck },
    { id: 'payment', label: 'ಪಾವತಿ', icon: CreditCard }
  ]

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/site-config" className="btn btn-outline" style={{ gap: '0.5rem' }}>
            <Settings size={18} />
            ಸೈಟ್ ಕಾನ್ಫಿಗರೇಶನ್
            <ChevronRight size={16} />
          </Link>
          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
            {isSaving ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : <><Save size={18} /> ಉಳಿಸಿ</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Tabs */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1rem', background: activeTab === tab.id ? 'white' : 'transparent', border: 'none', borderRadius: 'var(--radius-lg)', marginBottom: '0.5rem', cursor: 'pointer', color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: activeTab === tab.id ? 600 : 400, boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none' }}>
                <Icon size={18} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>ವ್ಯಾಪಾರ ಮಾಹಿತಿ</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="label">ವ್ಯಾಪಾರ ಹೆಸರು (ಕನ್ನಡ)</label><input name="businessName" value={settings.businessName} onChange={handleChange} className="input" /></div>
                <div><label className="label">Business Name (English)</label><input name="businessNameEn" value={settings.businessNameEn} onChange={handleChange} className="input" /></div>
              </div>
              <div><label className="label">ಟ್ಯಾಗ್‌ಲೈನ್</label><input name="tagline" value={settings.tagline} onChange={handleChange} className="input" /></div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1rem' }}>ಸಂಪರ್ಕ ವಿವರಗಳು</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="label"><Mail size={14} style={{ display: 'inline' }} /> ಇ-ಮೇಲ್</label><input name="email" value={settings.email} onChange={handleChange} className="input" /></div>
                <div><label className="label"><Phone size={14} style={{ display: 'inline' }} /> ಫೋನ್</label><input name="phone" value={settings.phone} onChange={handleChange} className="input" /></div>
              </div>
              <div><label className="label"><MapPin size={14} style={{ display: 'inline' }} /> ವಿಳಾಸ</label><textarea name="address" value={settings.address} onChange={handleChange} className="input" rows={2} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div><label className="label">ನಗರ</label><input name="city" value={settings.city} onChange={handleChange} className="input" /></div>
                <div><label className="label">ರಾಜ್ಯ</label><input name="state" value={settings.state} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಪಿನ್‌ಕೋಡ್</label><input name="pincode" value={settings.pincode} onChange={handleChange} className="input" /></div>
              </div>
            </div>
          )}

          {activeTab === 'gst' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>GST & ತೆರಿಗೆ ಮಾಹಿತಿ</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '-0.5rem' }}>ಈ ವಿವರಗಳು ಇನ್ವಾಯ್ಸ್‌ಗಳಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="label">GSTIN</label><input name="gstNumber" value={settings.gstNumber} onChange={handleChange} className="input" placeholder="29XXXXX1234X1Z5" /></div>
                <div><label className="label">PAN ಸಂಖ್ಯೆ</label><input name="panNumber" value={settings.panNumber} onChange={handleChange} className="input" placeholder="AAAAA1234A" /></div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>📌 ಪುಸ್ತಕಗಳಿಗೆ GST ದರ: <strong>0%</strong> (ಪುಸ್ತಕಗಳು ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಸಾಮಗ್ರಿಗಳಿಗೆ GST ವಿನಾಯಿತಿ ಇದೆ)</p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>ಶಿಪ್ಪಿಂಗ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="label">ಡೀಫಾಲ್ಟ್ ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕ (₹)</label><input type="number" name="defaultShipping" value={settings.defaultShipping} onChange={handleChange} className="input" /></div>
                <div><label className="label">ಉಚಿತ ಶಿಪ್ಪಿಂಗ್ ಕನಿಷ್ಠ (₹)</label><input type="number" name="freeShippingMin" value={settings.freeShippingMin} onChange={handleChange} className="input" /></div>
              </div>
              <div><label className="label">ಅಂದಾಜು ವಿತರಣಾ ಸಮಯ</label><input name="estimatedDays" value={settings.estimatedDays} onChange={handleChange} className="input" /></div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Razorpay ಸೆಟ್ಟಿಂಗ್‌ಗಳು</h3>
              <div><label className="label">Key ID</label><input name="razorpayKeyId" value={settings.razorpayKeyId} onChange={handleChange} className="input" /></div>
              <div><label className="label">Key Secret</label><input type="password" name="razorpayKeySecret" value={settings.razorpayKeySecret} onChange={handleChange} className="input" /></div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>⚠️ Razorpay Dashboard ನಿಂದ Key ಪಡೆಯಿರಿ. ಈ keys ಅನ್ನು .env ಫೈಲ್‌ನಲ್ಲಿಯೂ ನಮೂದಿಸಿ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
