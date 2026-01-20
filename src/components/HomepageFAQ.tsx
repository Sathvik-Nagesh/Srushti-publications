'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretDown, CaretUp, Question } from '@phosphor-icons/react'

const homepageFAQs = [
  {
    question: 'ಪುಸ್ತಕಗಳನ್ನು ಹೇಗೆ ಆರ್ಡರ್ ಮಾಡುವುದು?',
    answer: 'ನಿಮಗೆ ಬೇಕಾದ ಪುಸ್ತಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ, "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ, ನಂತರ ಚೆಕ್‌ಔಟ್ ಪೂರ್ಣಗೊಳಿಸಿ.'
  },
  {
    question: 'ಶಿಪ್ಪಿಂಗ್ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?',
    answer: 'ಕರ್ನಾಟಕದಲ್ಲಿ 3-5 ದಿನಗಳು, ಇತರ ರಾಜ್ಯಗಳಲ್ಲಿ 5-7 ದಿನಗಳು. ₹500 ಮೇಲಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಶಿಪ್ಪಿಂಗ್.'
  },
  {
    question: 'ಯಾವ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ?',
    answer: 'UPI (Google Pay, PhonePe), ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ.'
  },
  {
    question: 'ಪುಸ್ತಕ ರಿಟರ್ನ್ ಮಾಡಬಹುದೇ?',
    answer: 'ಹೌದು, ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ತಪ್ಪು ಪುಸ್ತಕ ಸ್ವೀಕರಿಸಿದರೆ 7 ದಿನಗಳ ಒಳಗೆ ರಿಟರ್ನ್ ಮಾಡಬಹುದು.'
  }
]

export default function HomepageFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು
            </h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವರಿತ ಉತ್ತರಗಳು
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {homepageFAQs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1rem', paddingRight: '1rem' }}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <CaretUp size={20} weight="bold" style={{ flexShrink: 0 }} />
                  ) : (
                    <CaretDown size={20} weight="bold" style={{ flexShrink: 0 }} />
                  )}
                </button>
                {openIndex === index && (
                  <div style={{
                    padding: '0 1.25rem 1.25rem',
                    color: 'var(--color-text-light)',
                    lineHeight: 1.7
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-outline" style={{ gap: '0.5rem' }}>
              <Question size={20} weight="bold" />
              ಎಲ್ಲಾ FAQ ನೋಡಿ
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
