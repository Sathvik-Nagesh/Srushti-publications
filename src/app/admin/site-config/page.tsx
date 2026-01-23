'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Settings,
  Home,
  Clock,
  Type,
  Image,
  MessageSquare,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SiteSettings {
  // Homepage Settings
  heroTagline: string
  heroTitle: string
  heroDescription: string
  heroButtonText: string
  
  // Sale Timer Settings
  saleTimerEnabled: boolean
  saleTimerTitle: string
  saleTimerEndDate: string
  saleTimerDiscountText: string
  
  // Social Proof Settings
  socialProofEnabled: boolean
  socialProofInterval: number
  
  // Contact Info
  whatsappNumber: string
  whatsappMessage: string
  
  // Footer Settings
  footerDescription: string
  copyrightText: string
  
  // SEO Settings
  siteTitle: string
  siteDescription: string
  siteKeywords: string
}

const defaultSettings: SiteSettings = {
  heroTagline: 'ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಸಮೃದ್ಧ ಸಂಗ್ರಹ',
  heroTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
  heroDescription: 'ವಿಶ್ವದ ಅತ್ಯುತ್ತಮ  ಪುಸ್ತಕಗಳು ಕನ್ನಡ‌  ಓದುಗರಿಗಾಗಿ...ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.',
  heroButtonText: 'ಪುಸ್ತಕಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
  
  saleTimerEnabled: true,
  saleTimerTitle: '🎉 ಮಹಾ ಮಾರಾಟ! ಎಲ್ಲಾ ಪುಸ್ತಕಗಳ ಮೇಲೆ 20% ರಿಯಾಯಿತಿ',
  saleTimerEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  saleTimerDiscountText: '20% ರಿಯಾಯಿತಿ',
  
  socialProofEnabled: true,
  socialProofInterval: 15000,
  
  whatsappNumber: '919876543210',
  whatsappMessage: 'ನಮಸ್ಕಾರ, ನನಗೆ ಪುಸ್ತಕಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು.',
  
  footerDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳ ಪ್ರಕಾಶನ ಮತ್ತು ಮಾರಾಟ.',
  copyrightText: '© 2024 ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  
  siteTitle: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್ | ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಆನ್‌ಲೈನ್ ಮಳಿಗೆ',
  siteDescription: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಕ್ಕಳ ಪುಸ್ತಕಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ.',
  siteKeywords: 'ಕನ್ನಡ ಪುಸ್ತಕಗಳು, kannada books, kannada literature'
}

// Storage key
const SETTINGS_KEY = 'srushti_site_settings'

export default function SiteConfigPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'homepage' | 'sale' | 'social' | 'contact' | 'seo'>('homepage')
  
  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/site-settings')
        const data = await response.json()
        
        if (data.success && data.data) {
          // Ensure no null values exist in the settings object to prevent controlled/uncontrolled input errors
          const sanitizedData = Object.entries(data.data).reduce((acc: any, [key, value]) => {
            acc[key] = value === null ? '' : value
            return acc
          }, {})
          
          setSettings({ ...defaultSettings, ...sanitizedData })
        }
      } catch (e) {
        console.error('Failed to load settings:', e)
        // Fallback to localStorage
        const savedSettings = localStorage.getItem(SETTINGS_KEY)
        if (savedSettings) {
          try {
            setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
          } catch (parseError) {
            console.error('Failed to parse local settings:', parseError)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseInt(value) || 0) : value
    }))
  }
  
  const handleToggle = (field: keyof SiteSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to database
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Also save to localStorage as backup
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
        toast.success('ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleReset = async () => {
    if (confirm('ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಡೀಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಬೇಕೇ?')) {
      setSettings(defaultSettings)
      localStorage.removeItem(SETTINGS_KEY)
      
      // Save defaults to database
      try {
        await fetch('/api/site-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultSettings)
        })
      } catch (e) {
        console.error('Failed to reset in DB:', e)
      }
      
      toast.success('ಡೀಫಾಲ್ಟ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ')
    }
  }
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }
  
  const tabs = [
    { id: 'homepage', label: 'ಮುಖಪುಟ', icon: Home },
    { id: 'sale', label: 'ಸೇಲ್ ಟೈಮರ್', icon: Clock },
    { id: 'social', label: 'ಸೋಶಿಯಲ್ ಪ್ರೂಫ್', icon: MessageSquare },
    { id: 'contact', label: 'ಸಂಪರ್ಕ', icon: MessageSquare },
    { id: 'seo', label: 'SEO', icon: Type }
  ] as const
  
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <Link 
            href="/admin/settings"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-light)',
              textDecoration: 'none',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಗೆ ಹಿಂತಿರುಗಿ
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <Settings size={28} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            ಸೈಟ್ ಕಾನ್ಫಿಗರೇಶನ್
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleReset}
            className="btn btn-ghost"
          >
            ಮರುಹೊಂದಿಸಿ
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            {isSaving ? (
              <span className="spinner" style={{ width: 20, height: 20 }} />
            ) : (
              <Save size={20} />
            )}
            ಉಳಿಸಿ
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--color-text-light)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>
      
      {/* Tab Content */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Homepage Settings */}
        {activeTab === 'homepage' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Home size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ಮುಖಪುಟ ಸೆಟ್ಟಿಂಗ್‌ಗಳು
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="label">ಹೀರೋ ಟ್ಯಾಗ್‌ಲೈನ್</label>
                <input
                  type="text"
                  name="heroTagline"
                  value={settings.heroTagline}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="ಟ್ಯಾಗ್‌ಲೈನ್ ನಮೂದಿಸಿ"
                />
              </div>
              
              <div className="form-group">
                <label className="label">ಹೀರೋ ಶೀರ್ಷಿಕೆ</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={settings.heroTitle}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="ಮುಖ್ಯ ಶೀರ್ಷಿಕೆ"
                />
              </div>
              
              <div className="form-group">
                <label className="label">ಹೀರೋ ವಿವರಣೆ</label>
                <textarea
                  name="heroDescription"
                  value={settings.heroDescription}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="ಮುಖಪುಟದ ವಿವರಣೆ"
                />
              </div>
              
              <div className="form-group">
                <label className="label">ಬಟನ್ ಪಠ್ಯ</label>
                <input
                  type="text"
                  name="heroButtonText"
                  value={settings.heroButtonText}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="CTA ಬಟನ್ ಪಠ್ಯ"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Sale Timer Settings */}
        {activeTab === 'sale' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Clock size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ಸೇಲ್ ಟೈಮರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Enable/Disable Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: settings.saleTimerEnabled ? '#10b98115' : 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${settings.saleTimerEnabled ? 'var(--color-success)' : 'var(--color-border)'}`
              }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>ಸೇಲ್ ಟೈಮರ್</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                    ಮುಖಪುಟದಲ್ಲಿ ಸೇಲ್ ಕೌಂಟ್‌ಡೌನ್ ಟೈಮರ್ ತೋರಿಸಿ
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('saleTimerEnabled')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {settings.saleTimerEnabled ? (
                    <ToggleRight size={48} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <ToggleLeft size={48} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </button>
              </div>
              
              <div className="form-group">
                <label className="label">ಸೇಲ್ ಶೀರ್ಷಿಕೆ</label>
                <input
                  type="text"
                  name="saleTimerTitle"
                  value={settings.saleTimerTitle}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="ಸೇಲ್ ಬ್ಯಾನರ್ ಶೀರ್ಷಿಕೆ"
                  disabled={!settings.saleTimerEnabled}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label">ಸೇಲ್ ಮುಕ್ತಾಯ ದಿನಾಂಕ</label>
                  <input
                    type="date"
                    name="saleTimerEndDate"
                    value={settings.saleTimerEndDate}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!settings.saleTimerEnabled}
                  />
                </div>
                
                <div className="form-group">
                  <label className="label">ರಿಯಾಯಿತಿ ಪಠ್ಯ</label>
                  <input
                    type="text"
                    name="saleTimerDiscountText"
                    value={settings.saleTimerDiscountText}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="ಉದಾ: 20% ರಿಯಾಯಿತಿ"
                    disabled={!settings.saleTimerEnabled}
                  />
                </div>
              </div>
              
              {/* Preview */}
              {settings.saleTimerEnabled && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.75rem', color: 'var(--color-text-light)' }}>
                    ಪೂರ್ವವೀಕ್ಷಣೆ:
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: 'var(--radius-xl)',
                    textAlign: 'center',
                    fontWeight: 600
                  }}>
                    {settings.saleTimerTitle}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Social Proof Settings */}
        {activeTab === 'social' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <MessageSquare size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ಸೋಶಿಯಲ್ ಪ್ರೂಫ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: settings.socialProofEnabled ? '#10b98115' : 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${settings.socialProofEnabled ? 'var(--color-success)' : 'var(--color-border)'}`
              }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>ಸೋಶಿಯಲ್ ಪ್ರೂಫ್ ಪಾಪ್-ಅಪ್</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                    "ಯಾರೋ ಇತ್ತೀಚೆಗೆ ಖರೀದಿಸಿದ್ದಾರೆ" ಪಾಪ್-ಅಪ್ ತೋರಿಸಿ
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('socialProofEnabled')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {settings.socialProofEnabled ? (
                    <ToggleRight size={48} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <ToggleLeft size={48} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </button>
              </div>
              
              <div className="form-group">
                <label className="label">ಪಾಪ್-ಅಪ್ ಮಧ್ಯಂತರ (ಮಿಲಿಸೆಕೆಂಡುಗಳು)</label>
                <input
                  type="number"
                  name="socialProofInterval"
                  value={settings.socialProofInterval}
                  onChange={handleInputChange}
                  className="input"
                  min={5000}
                  max={60000}
                  step={1000}
                  disabled={!settings.socialProofEnabled}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  ಪ್ರಸ್ತುತ: ಪ್ರತಿ {settings.socialProofInterval / 1000} ಸೆಕೆಂಡುಗಳಿಗೊಮ್ಮೆ
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <MessageSquare size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ಸಂಪರ್ಕ ಸೆಟ್ಟಿಂಗ್‌ಗಳು
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="label">WhatsApp ನಂಬರ್</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="919876543210"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  ದೇಶದ ಕೋಡ್ ಸೇರಿಸಿ (ಉದಾ: 91 for India)
                </p>
              </div>
              
              <div className="form-group">
                <label className="label">ಡೀಫಾಲ್ಟ್ WhatsApp ಸಂದೇಶ</label>
                <textarea
                  name="whatsappMessage"
                  value={settings.whatsappMessage}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="ಆರಂಭಿಕ ಸಂದೇಶ"
                />
              </div>
              
              <div className="form-group">
                <label className="label">ಫೂಟರ್ ವಿವರಣೆ</label>
                <textarea
                  name="footerDescription"
                  value={settings.footerDescription}
                  onChange={handleInputChange}
                  className="input"
                  rows={2}
                  placeholder="ಫೂಟರ್‌ನಲ್ಲಿ ವಿವರಣೆ"
                />
              </div>
              
              <div className="form-group">
                <label className="label">ಕಾಪಿರೈಟ್ ಪಠ್ಯ</label>
                <input
                  type="text"
                  name="copyrightText"
                  value={settings.copyrightText}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="© 2024..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Type size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              SEO ಸೆಟ್ಟಿಂಗ್‌ಗಳು
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="label">ಸೈಟ್ ಶೀರ್ಷಿಕೆ</label>
                <input
                  type="text"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="ಸೈಟ್ ಶೀರ್ಷಿಕೆ"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  {settings.siteTitle.length}/60 ಅಕ್ಷರಗಳು (ಶಿಫಾರಸು: 60 ಕ್ಕಿಂತ ಕಡಿಮೆ)
                </p>
              </div>
              
              <div className="form-group">
                <label className="label">ಮೆಟಾ ವಿವರಣೆ</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  placeholder="SEO ವಿವರಣೆ"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  {settings.siteDescription.length}/160 ಅಕ್ಷರಗಳು (ಶಿಫಾರಸು: 160 ಕ್ಕಿಂತ ಕಡಿಮೆ)
                </p>
              </div>
              
              <div className="form-group">
                <label className="label">ಕೀವರ್ಡ್‌ಗಳು</label>
                <input
                  type="text"
                  name="siteKeywords"
                  value={settings.siteKeywords}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="ಕೀವರ್ಡ್‌ಗಳನ್ನು ಅಲ್ಪವಿರಾಮದಿಂದ ಬೇರ್ಪಡಿಸಿ"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Info Banner */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'var(--color-info)15',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-info)30',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <AlertCircle size={20} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: '0.125rem' }} />
        <div>
          <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
            ಸೂಚನೆ
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
            ಬದಲಾವಣೆಗಳನ್ನು ನೋಡಲು ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಬೇಕಾಗಬಹುದು. ಉತ್ಪಾದನೆಯಲ್ಲಿ, ಈ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.
          </p>
        </div>
      </div>
    </div>
  )
}
