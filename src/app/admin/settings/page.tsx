'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Save, FileText, Truck, CreditCard, Settings, ChevronRight, Lock, Download, Key, Eye, EyeOff, FileSpreadsheet, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('gst')
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
  
  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Export state
  const [exportDates, setExportDates] = useState({
    startDate: '',
    endDate: ''
  })
  const [exportStatus, setExportStatus] = useState('')
  const [isExporting, setIsExporting] = useState(false)

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
          gstNumber: s.gstNumber || '',
          panNumber: s.panNumber || '',
          defaultShipping: s.defaultShipping?.toString() || '50',
          freeShippingMin: s.freeShippingMin?.toString() || '500',
          estimatedDays: s.estimatedDays || '',
          razorpayKeyId: s.razorpayKeyId || '',
          razorpayKeySecret: s.razorpaySecret || '',
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
  
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ')
      return
    }
    if (passwords.newPassword.length < 8) {
      toast.error('ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು ಇರಬೇಕು')
      return
    }
    
    setIsChangingPassword(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords)
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success(data.message || 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(data.error || 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ')
      }
    } catch (error) {
      toast.error('ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಲು ದೋಷ')
    } finally {
      setIsChangingPassword(false)
    }
  }
  
  const handleExportOrders = async (format: 'csv' | 'json') => {
    setIsExporting(true)
    setExportStatus('ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ...')
    
    try {
      const params = new URLSearchParams()
      if (exportDates.startDate) params.append('startDate', exportDates.startDate)
      if (exportDates.endDate) params.append('endDate', exportDates.endDate)
      params.append('format', format)
      
      const res = await fetch(`/api/admin/orders/export?${params.toString()}`)
      
      if (format === 'csv') {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-${exportDates.startDate || 'all'}-to-${exportDates.endDate || 'today'}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('CSV ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!')
      } else {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-${exportDates.startDate || 'all'}-to-${exportDates.endDate || 'today'}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`${data.count} ಆರ್ಡರ್‌ಗಳು ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಆಗಿವೆ!`)
      }
      
      setExportStatus('')
    } catch (error) {
      toast.error('ಎಕ್ಸ್‌ಪೋರ್ಟ್ ವಿಫಲವಾಗಿದೆ')
      setExportStatus('ದೋಷ')
    } finally {
      setIsExporting(false)
    }
  }

  const tabs = [
    { id: 'gst', label: 'GST & ತೆರಿಗೆ', icon: FileText },
    { id: 'shipping', label: 'ಶಿಪ್ಪಿಂಗ್', icon: Truck },
    { id: 'payment', label: 'ಪಾವತಿ', icon: CreditCard },
    { id: 'security', label: 'ಭದ್ರತೆ', icon: Lock },
    { id: 'export', label: 'ಎಕ್ಸ್‌ಪೋರ್ಟ್', icon: Download }
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

      <div style={{ padding: '1rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>
        ℹ️ <strong>ಗಮನಿಸಿ:</strong> ವಿಳಾಸ, ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಇತರ ಸ್ಥಿರ ಮಾಹಿತಿಯನ್ನು ಈಗ <code>src/config/site.ts</code> ಫೈಲ್‌ನಲ್ಲಿ ಬದಲಾಯಿಸಬೇಕು.
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
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
        <div style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          
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
          
          {activeTab === 'security' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={20} /> ಅಡ್ಮಿನ್ ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                  ಭದ್ರತೆಗಾಗಿ ನಿಮ್ಮ ಅಡ್ಮಿನ್ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ನಿಯಮಿತವಾಗಿ ಬದಲಾಯಿಸಿ
                </p>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="label">ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="input"
                      style={{ paddingRight: '3rem' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="label">ಹೊಸ ಪಾಸ್‌ವರ್ಡ್</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="input"
                      style={{ paddingRight: '3rem' }}
                      placeholder="ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="label">ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input"
                      style={{ paddingRight: '3rem' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                className="btn btn-primary"
                style={{ width: 'fit-content' }}
              >
                {isChangingPassword ? 'ಬದಲಾಯಿಸಲಾಗುತ್ತಿದೆ...' : <><Lock size={18} /> ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ</>}
              </button>
              
              <div style={{ padding: '1rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  💡 <strong>ಸುರಕ್ಷಿತ ಪಾಸ್‌ವರ್ಡ್ ಸಲಹೆಗಳು:</strong><br/>
                  • ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು ಬಳಸಿ<br/>
                  • ಅಕ್ಷರಗಳು, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ವಿಶೇಷ ಚಿಹ್ನೆಗಳನ್ನು ಸೇರಿಸಿ<br/>
                  • ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಬಳಸಬೇಡಿ
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'export' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileSpreadsheet size={20} /> ಆರ್ಡರ್ ಎಕ್ಸ್‌ಪೋರ್ಟ್
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                  ಲೆಕ್ಕಪತ್ರಕ್ಕಾಗಿ ಆರ್ಡರ್‌ಗಳನ್ನು CSV ಅಥವಾ JSON ಫಾರ್ಮ್ಯಾಟ್‌ನಲ್ಲಿ ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಮಾಡಿ
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> ಪ್ರಾರಂಭ ದಿನಾಂಕ
                  </label>
                  <input 
                    type="date"
                    value={exportDates.startDate}
                    onChange={(e) => setExportDates(prev => ({ ...prev, startDate: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> ಅಂತ್ಯ ದಿನಾಂಕ
                  </label>
                  <input 
                    type="date"
                    value={exportDates.endDate}
                    onChange={(e) => setExportDates(prev => ({ ...prev, endDate: e.target.value }))}
                    className="input"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleExportOrders('csv')}
                  disabled={isExporting}
                  className="btn btn-primary"
                >
                  {isExporting ? 'ಎಕ್ಸ್‌ಪೋರ್ಟ್...' : <><Download size={18} /> CSV ಡೌನ್‌ಲೋಡ್</>}
                </button>
                <button 
                  onClick={() => handleExportOrders('json')}
                  disabled={isExporting}
                  className="btn btn-outline"
                >
                  <Download size={18} /> JSON ಡೌನ್‌ಲೋಡ್
                </button>
              </div>
              
              {exportStatus && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{exportStatus}</p>
              )}
              
              <div style={{ padding: '1rem', background: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  📊 <strong>ಎಕ್ಸ್‌ಪೋರ್ಟ್ ವಿವರಗಳು:</strong><br/>
                  • CSV - Excel ಅಥವಾ Google Sheets ನಲ್ಲಿ ತೆರೆಯಬಹುದು<br/>
                  • JSON - ಪ್ರೋಗ್ರಾಮೆಟಿಕ್ ಬಳಕೆಗಾಗಿ<br/>
                  • ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡದಿದ್ದರೆ ಎಲ್ಲಾ ಆರ್ಡರ್‌ಗಳು ಎಕ್ಸ್‌ಪೋರ್ಟ್ ಆಗುತ್ತವೆ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

