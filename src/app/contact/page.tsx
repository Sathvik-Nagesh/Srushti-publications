'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('ದಯವಿಟ್ಟು ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ'); return
    }
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('ನಿಮ್ಮ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const contactInfo = [
    { icon: Phone, title: 'ಕರೆ ಮಾಡಿ', value: '+91 98450 96668', subtext: 'ಸೋಮ-ಶನಿ: 10AM - 6PM' },
    { icon: Mail, title: 'ಇ-ಮೇಲ್ ಕಳುಹಿಸಿ', value: 'srushtinagesh@gmail.com', subtext: '24 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ' },
    { icon: MessageCircle, title: 'WhatsApp', value: '+91 98450 96668', subtext: 'ತ್ವರಿತ ಪ್ರತಿಕ್ರಿಯೆ' },
    { icon: MapPin, title: 'ವಿಳಾಸ', value: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ', subtext: '560041' }
  ]

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)', padding: '4rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
              ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳು, ಸಲಹೆಗಳು ಅಥವಾ ಆರ್ಡರ್ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section style={{ padding: '3rem 0 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {contactInfo.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Icon size={24} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.value}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.subtext}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              {/* Contact Form */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>📝 ಸಂದೇಶ ಕಳುಹಿಸಿ</h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div><label className="label">ಹೆಸರು *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="ನಿಮ್ಮ ಹೆಸರು" required /></div>
                      <div><label className="label">ಫೋನ್</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input" placeholder="9876543210" /></div>
                    </div>
                    <div><label className="label">ಇ-ಮೇಲ್ *</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input" placeholder="email@example.com" required /></div>
                    <div><label className="label">ವಿಷಯ</label>
                      <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="input select">
                        <option value="">ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ</option>
                        <option value="order">ಆರ್ಡರ್ ಸಂಬಂಧಿತ</option>
                        <option value="return">ಮರುಪಾವತಿ / ವಾಪಸಾತಿ</option>
                        <option value="bulk">ಬೃಹತ್ ಆರ್ಡರ್</option>
                        <option value="partnership">ವ್ಯಾಪಾರ ಸಹಭಾಗಿತ್ವ</option>
                        <option value="other">ಇತರೆ</option>
                      </select>
                    </div>
                    <div><label className="label">ಸಂದೇಶ *</label><textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="input" rows={5} placeholder="ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..." required /></div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      {isSubmitting ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : <><Send size={18} /> ಸಂದೇಶ ಕಳುಹಿಸಿ</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* FAQ & Map */}
              <div>
                <div style={{ background: 'var(--color-cream-light)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>❓ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು</h3>
                  {[
                    { q: 'ವಿತರಣೆ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?', a: 'ಮೆಟ್ರೋ ನಗರಗಳಲ್ಲಿ 2-3 ದಿನಗಳು, ಇತರ ಸ್ಥಳಗಳಲ್ಲಿ 5-6 ದಿನಗಳು.' },
                    { q: 'ಮರಳಿಸುವ ನೀತಿ ಏನು?', a: 'ಡ್ಯಾಮೇಜ್ ಆದ ಪುಸ್ತಕಗಳಿಗೆ 7 ದಿನಗಳಲ್ಲಿ ಮರಳಿಸಬಹುದು.' },
                    { q: 'ಉಚಿತ ಶಿಪ್ಪಿಂಗ್ ಲಭ್ಯವಿದೆಯೇ?', a: '₹500 ಮೇಲಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್.' }
                  ].map((faq, i) => (
                    <div key={i} style={{ marginBottom: i < 2 ? '1rem' : 0, paddingBottom: i < 2 ? '1rem' : 0, borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{faq.q}</p>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-light)', margin: 0 }}>{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-xl)', padding: '2rem', color: 'white' }}>
                  <Clock size={32} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>ಕಾರ್ಯಾಲಯ ಸಮಯ</h3>
                  <p style={{ opacity: 0.9, marginBottom: '0.25rem' }}>ಸೋಮವಾರ - ಶನಿವಾರ</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>10:00 AM - 6:00 PM</p>
                  <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>ಭಾನುವಾರ ರಜೆ</p>
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
