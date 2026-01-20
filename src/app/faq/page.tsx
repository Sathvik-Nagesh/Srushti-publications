'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { HelpCircle, ChevronDown, ChevronUp, ShoppingCart, Truck, CreditCard, RefreshCw, Book, Phone } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: React.ReactNode
  faqs: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: 'ಆರ್ಡರ್ ಮಾಡುವುದು',
    icon: <ShoppingCart size={20} />,
    faqs: [
      {
        question: 'ಆರ್ಡರ್ ಹೇಗೆ ಮಾಡುವುದು?',
        answer: 'ನಿಮಗೆ ಬೇಕಾದ ಪುಸ್ತಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ, "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ, ನಂತರ ಚೆಕ್‌ಔಟ್ ಪುಟಕ್ಕೆ ಹೋಗಿ. ನಿಮ್ಮ ವಿಳಾಸ ಮತ್ತು ಪಾವತಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಆರ್ಡರ್ ಪೂರ್ಣಗೊಳಿಸಿ.'
      },
      {
        question: 'ಆರ್ಡರ್ ಮಾಡಲು ಖಾತೆ ಬೇಕೇ?',
        answer: 'ಇಲ್ಲ, ನೀವು ಅತಿಥಿಯಾಗಿ ಆರ್ಡರ್ ಮಾಡಬಹುದು. ಆದಾಗ್ಯೂ, ಖಾತೆ ರಚಿಸಿದರೆ ನಿಮ್ಮ ಆರ್ಡರ್ ಇತಿಹಾಸವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.'
      },
      {
        question: 'ಆರ್ಡರ್ ರದ್ದುಗೊಳಿಸಬಹುದೇ?',
        answer: 'ಹೌದು, ಆರ್ಡರ್ ಶಿಪ್ ಆಗುವ ಮೊದಲು ರದ್ದುಗೊಳಿಸಬಹುದು. ನಮ್ಮನ್ನು ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ.'
      },
      {
        question: 'ಆರ್ಡರ್ ದೃಢೀಕರಣ ಸಿಗುತ್ತದೆಯೇ?',
        answer: 'ಹೌದು, ಆರ್ಡರ್ ಮಾಡಿದ ನಂತರ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ದೃಢೀಕರಣ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ಆರ್ಡರ್ ಸಂಖ್ಯೆ ಮತ್ತು ವಿವರಗಳು ಸೇರಿರುತ್ತವೆ.'
      }
    ]
  },
  {
    title: 'ಪಾವತಿ',
    icon: <CreditCard size={20} />,
    faqs: [
      {
        question: 'ಯಾವ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ?',
        answer: 'ನಾವು UPI (Google Pay, PhonePe, Paytm), ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ (COD) ಸ್ವೀಕರಿಸುತ್ತೇವೆ.'
      },
      {
        question: 'ಪಾವತಿ ಸುರಕ್ಷಿತವೇ?',
        answer: 'ಹೌದು, 100% ಸುರಕ್ಷಿತ. ನಾವು Razorpay ಪಾವತಿ ಗೇಟ್‌ವೇ ಬಳಸುತ್ತೇವೆ ಮತ್ತು ಎಲ್ಲಾ ವಹಿವಾಟುಗಳು SSL ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ ಆಗಿವೆ.'
      },
      {
        question: 'COD ಗೆ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ ಇದೆಯೇ?',
        answer: 'ಹೌದು, ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿಗೆ ₹40 ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ ಅನ್ವಯವಾಗುತ್ತದೆ.'
      },
      {
        question: 'EMI ಲಭ್ಯವಿದೆಯೇ?',
        answer: 'ಪ್ರಸ್ತುತ EMI ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ಆದರೆ UPI ಮತ್ತು ಕಾರ್ಡ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪಾವತಿಸಬಹುದು.'
      }
    ]
  },
  {
    title: 'ಶಿಪ್ಪಿಂಗ್ ಮತ್ತು ವಿತರಣೆ',
    icon: <Truck size={20} />,
    faqs: [
      {
        question: 'ಶಿಪ್ಪಿಂಗ್ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?',
        answer: 'ಕರ್ನಾಟಕದಲ್ಲಿ 3-5 ದಿನಗಳು, ಇತರ ರಾಜ್ಯಗಳಲ್ಲಿ 5-7 ದಿನಗಳು. ದೂರದ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ 2-3 ದಿನಗಳು ಬೇಕಾಗಬಹುದು.'
      },
      {
        question: 'ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕ ಎಷ್ಟು?',
        answer: 'ಕರ್ನಾಟಕದಲ್ಲಿ ₹500 ಮೇಲಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ. ₹500 ಕೆಳಗಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ₹50 ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕ.'
      },
      {
        question: 'ಭಾರತದ ಹೊರಗೆ ಶಿಪ್ ಮಾಡುತ್ತೀರಾ?',
        answer: 'ಪ್ರಸ್ತುತ ನಾವು ಭಾರತದೊಳಗೆ ಮಾತ್ರ ಶಿಪ್ ಮಾಡುತ್ತೇವೆ. ಅಂತರರಾಷ್ಟ್ರೀಯ ಶಿಪ್ಪಿಂಗ್ ಶೀಘ್ರದಲ್ಲಿ ಬರಲಿದೆ.'
      },
      {
        question: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದೇ?',
        answer: 'ಹೌದು, ಆರ್ಡರ್ ಶಿಪ್ ಆದ ನಂತರ ನಿಮಗೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಲಿಂಕ್ ಇಮೇಲ್ ಮಾಡಲಾಗುತ್ತದೆ.'
      }
    ]
  },
  {
    title: 'ರಿಟರ್ನ್ ಮತ್ತು ಮರುಪಾವತಿ',
    icon: <RefreshCw size={20} />,
    faqs: [
      {
        question: 'ಪುಸ್ತಕ ರಿಟರ್ನ್ ಮಾಡಬಹುದೇ?',
        answer: 'ಹೌದು, ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ತಪ್ಪು ಪುಸ್ತಕ ಸ್ವೀಕರಿಸಿದರೆ 7 ದಿನಗಳ ಒಳಗೆ ರಿಟರ್ನ್ ಮಾಡಬಹುದು.'
      },
      {
        question: 'ಮರುಪಾವತಿ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?',
        answer: 'ರಿಟರ್ನ್ ಅನುಮೋದಿಸಿದ ನಂತರ 5-7 ಕಾರ್ಯ ದಿನಗಳಲ್ಲಿ ಮರುಪಾವತಿ ಆಗುತ್ತದೆ.'
      },
      {
        question: 'ಮನಸ್ಸು ಬದಲಾದರೆ ರಿಟರ್ನ್ ಮಾಡಬಹುದೇ?',
        answer: 'ಕ್ಷಮಿಸಿ, ಮನಸ್ಸು ಬದಲಾವಣೆ ಅಥವಾ ತಪ್ಪು ಆರ್ಡರ್ ಸಂದರ್ಭಗಳಲ್ಲಿ ರಿಟರ್ನ್ ಸ್ವೀಕರಿಸಲಾಗುವುದಿಲ್ಲ.'
      }
    ]
  },
  {
    title: 'ಪುಸ್ತಕಗಳು',
    icon: <Book size={20} />,
    faqs: [
      {
        question: 'ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು ಕನ್ನಡದಲ್ಲಿವೆಯೇ?',
        answer: 'ಹೌದು, ನಾವು ಮುಖ್ಯವಾಗಿ ಕನ್ನಡ ಪುಸ್ತಕಗಳನ್ನು ಮಾರಾಟ ಮಾಡುತ್ತೇವೆ - ಸಾಹಿತ್ಯ, ಶೈಕ್ಷಣಿಕ, ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು.'
      },
      {
        question: 'ಪುಸ್ತಕಗಳು ಅಸಲಿಯೇ?',
        answer: 'ಖಂಡಿತವಾಗಿ! ನಾವು ಅಧಿಕೃತ ಪ್ರಕಾಶಕರು ಮತ್ತು ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು 100% ಅಸಲಿ.'
      },
      {
        question: 'ನಿರ್ದಿಷ್ಟ ಪುಸ್ತಕ ಹುಡುಕಲು ಸಹಾಯ ಬೇಕು',
        answer: 'ನಮ್ಮ ಸರ್ಚ್ ಬಾಕ್ಸ್ ಬಳಸಿ ಅಥವಾ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ. ಲಭ್ಯವಿಲ್ಲದ ಪುಸ್ತಕಗಳನ್ನು ತರಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತೇವೆ.'
      }
    ]
  }
]

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: isOpen ? 'var(--color-cream-light)' : 'white'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontWeight: 500, fontSize: '1rem', paddingRight: '1rem' }}>{faq.question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1.25rem 1rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>
          {faq.answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <Header />
      <main>
        <section style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: '4rem 0 3rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <HelpCircle size={48} style={{ marginBottom: '1rem', opacity: 0.9 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Frequently Asked Questions</p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            {faqData.map((category, catIndex) => (
              <div key={catIndex} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-primary)'
                }}>
                  {category.icon}
                  {category.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {category.faqs.map((faq, faqIndex) => {
                    const key = `${catIndex}-${faqIndex}`
                    return (
                      <FAQAccordion
                        key={key}
                        faq={faq}
                        isOpen={openItems[key] || false}
                        onToggle={() => toggleItem(key)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Still have questions */}
            <div style={{
              background: 'var(--color-cream-light)',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              marginTop: '3rem'
            }}>
              <Phone size={32} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                ಇನ್ನೂ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?
              </h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+919845096668" className="btn btn-primary">
                  <Phone size={18} /> +91 98450 96668
                </a>
                <a href="mailto:srushtinagesh@gmail.com" className="btn btn-outline">
                  ಇಮೇಲ್ ಕಳುಹಿಸಿ
                </a>
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
