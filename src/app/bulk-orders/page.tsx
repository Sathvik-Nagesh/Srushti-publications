'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import toast from 'react-hot-toast'
import { 
  Building2, 
  Library, 
  GraduationCap, 
  Users, 
  CheckCircle,
  Truck,
  Percent,
  Send,
  BookOpen
} from 'lucide-react'

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    organization: '',
    type: 'school', // school, library, college, bookstore, corporate, other
    contactPerson: '',
    email: '',
    phone: '',
    requirements: '',
    quantity: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('ನಿಮ್ಮ ವಿಚಾರಣೆ ಸ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.')
    setFormData({
      organization: '',
      type: 'school',
      contactPerson: '',
      email: '',
      phone: '',
      requirements: '',
      quantity: ''
    })
    setIsSubmitting(false)
  }

  const benefits = [
    {
      icon: Percent,
      title: 'ವಿಶೇಷ ರಿಯಾಯಿತಿ',
      description: 'ಬೃಹತ್ ಆರ್ಡರ್‌ಗಳಿಗೆ ಆಕರ್ಷಕ ರಿಯಾಯಿತಿಗಳು'
    },
    {
      icon: Truck,
      title: 'ಉಚಿತ ಸಾಗಣೆ',
      description: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಉಚಿತ ಡೋರ್ ಡೆಲಿವರಿ'
    },
    {
      icon: BookOpen,
      title: 'ಕಸ್ಟಮ್ ಆಯ್ಕೆ',
      description: 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಪುಸ್ತಕಗಳ ಆಯ್ಕೆ'
    },
    {
      icon: Building2,
      title: 'GST ಬಿಲ್ಲಿಂಗ್',
      description: 'ಸಂಸ್ಥೆಗಳಿಗೆ ಔಪಚಾರಿಕ GST ಇನ್‌ವಾಯ್ಸ್'
    }
  ]

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <section style={{ 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #b45309 100%)', 
          color: 'white',
          padding: '4rem 0 6rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '999px',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(5px)'
              }}>
                <Building2 size={18} />
                <span style={{ fontWeight: 600 }}>ಸಂಸ್ಥೆಗಳಿಗೆ ವಿಶೇಷ ಸೇವೆ</span>
              </div>
              <h1 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                fontWeight: 700, 
                marginBottom: '1.5rem',
                lineHeight: 1.2
              }}>
                ಬೃಹತ್ ಮತ್ತು ಸಾಂಸ್ಥಿಕ ಆದೇಶಗಳು
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                opacity: 0.9, 
                marginBottom: '0' 
              }}>
                ಶಾಲೆಗಳು, ಕಾಲೇಜುಗಳು, ಗ್ರಂಥಾಲಯಗಳು ಮತ್ತು ಪುಸ್ತಕ ಮಳಿಗೆಗಳಿಗೆ ವಿಶೇಷ ದರಗಳು ಮತ್ತು ಸೇವೆಗಳು.
              </p>
            </div>
          </div>
          
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '0',
            width: '100%',
            height: '100px',
            background: 'var(--color-bg)',
            clipPath: 'ellipse(60% 100% at 50% 100%)'
          }} />
        </section>

        {/* Form & Benefits Section */}
        <section style={{ marginTop: '-4rem', paddingBottom: '4rem' }}>
          <div className="container">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem',
              alignItems: 'start'
            }}>
              {/* Left Column: Form */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-2xl)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ಉಚಿತ ಉಲ್ಲೇಖ (Quote) ಪಡೆಯಿರಿ
                </h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  ಕೆಳಗಿನ ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ, ನಮ್ಮ ಪ್ರತಿನಿಧಿ 24 ಗಂಟೆಗಳಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="label">ಸಂಸ್ಥೆಯ ಹೆಸರು *</label>
                      <input 
                        type="text" 
                        required 
                        className="input" 
                        placeholder="ಶಾಲಾ / ಲೈಬ್ರರಿ ಹೆಸರು" 
                        value={formData.organization}
                        onChange={e => setFormData({...formData, organization: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="label">ಸಂಸ್ಥೆಯ ಪ್ರಕಾರ</label>
                      <select 
                        className="input select"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="school">ಶಾಲೆ / ವಿದ್ಯಾಸಂಸ್ಥೆ</option>
                        <option value="college">ಕಾಲೇಜು / ವಿವಿ</option>
                        <option value="library">ಗ್ರಂಥಾಲಯ</option>
                        <option value="bookstore">ಪುಸ್ತಕ ಮಳಿಗೆ</option>
                        <option value="corporate">ಕಾರ್ಪೊರೇಟ್</option>
                        <option value="other">ಇತರೆ</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="label">ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ *</label>
                      <input 
                        type="text" 
                        required 
                        className="input" 
                        placeholder="ವ್ಯಕ್ತಿಯ ಹೆಸರು" 
                        value={formData.contactPerson}
                        onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="label">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *</label>
                      <input 
                        type="tel" 
                        required 
                        className="input" 
                        placeholder="9876543210" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">ಇ-ಮೇಲ್ ವಿಳಾಸ *</label>
                    <input 
                      type="email" 
                      required 
                      className="input" 
                      placeholder="admin@school.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="label">ಅಂದಾಜು ಅಗತ್ಯತೆ</label>
                    <textarea 
                      className="input" 
                      rows={3} 
                      placeholder="ನಿಮಗೆ ಬೇಕಾದ ಪುಸ್ತಕಗಳ ಪಟ್ಟಿ ಅಥವಾ ವಿಷಯಗಳನ್ನು ತಿಳಿಸಿ..." 
                      value={formData.requirements}
                      onChange={e => setFormData({...formData, requirements: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg" 
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {isSubmitting ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : <><Send size={18} /> ಉಲ್ಲೇಖ (Quote) ಕೇಳಿ</>}
                  </button>
                </form>
              </div>

              {/* Right Column: Content */}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                  ನಾವು ಯಾರಿಗೆ ಸೇವೆ ನೀಡುತ್ತೇವೆ?
                </h3>
                 
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                    {[
                        { icon: GraduationCap, label: 'ಶಾಲೆಗಳು & ಕಾಲೇಜುಗಳು' },
                        { icon: Library, label: 'ಗ್ರಂಥಾಲಯಗಳು' },
                        { icon: Building2, label: 'ಪುಸ್ತಕ ಮಳಿಗೆಗಳು' },
                        { icon: Users, label: 'ಎನ್‌ಜಿಒ & ಟ್ರಸ್ಟ್‌ಗಳು' },
                    ].map((item, i) => (
                        <div key={i} style={{ 
                            background: 'white', 
                            padding: '1rem', 
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: '1px solid var(--color-border)'
                        }}>
                             <item.icon size={20} style={{ color: 'var(--color-primary)' }} />
                             <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.label}</span>
                        </div>
                    ))}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು
                </h3>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {benefits.map((benefit, i) => (
                         <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '12px', 
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-sm)',
                                flexShrink: 0
                            }}>
                                <benefit.icon size={24} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{benefit.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>
                                    {benefit.description}
                                </p>
                            </div>
                         </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
