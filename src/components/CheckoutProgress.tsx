'use client'

import { Check } from 'lucide-react'

interface CheckoutProgressProps {
  currentStep: number
  steps?: { label: string; labelEn?: string }[]
}

const defaultSteps = [
  { label: 'ಕಾರ್ಟ್', labelEn: 'Cart' },
  { label: 'ವಿಳಾಸ', labelEn: 'Address' },
  { label: 'ಪಾವತಿ', labelEn: 'Payment' },
  { label: 'ದೃಢೀಕರಣ', labelEn: 'Confirm' }
]

export default function CheckoutProgress({ 
  currentStep, 
  steps = defaultSteps 
}: CheckoutProgressProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Progress Line Background */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '36px',
          right: '36px',
          height: 3,
          background: 'var(--color-border)',
          borderRadius: 2,
          zIndex: 0
        }} />
        
        {/* Progress Line Filled */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '36px',
          width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${currentStep === steps.length ? '0px' : '36px'})`,
          height: 3,
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          borderRadius: 2,
          zIndex: 1,
          transition: 'width 0.5s ease'
        }} />
        
        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep
          
          return (
            <div 
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 2,
                flex: 1
              }}
            >
              {/* Circle */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                ...(isCompleted ? {
                  background: 'var(--color-success)',
                  color: 'white',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
                } : isActive ? {
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  color: 'white',
                  boxShadow: '0 2px 10px rgba(217, 119, 6, 0.4)',
                  animation: 'pulse 2s infinite'
                } : {
                  background: 'white',
                  border: '2px solid var(--color-border)',
                  color: 'var(--color-text-muted)'
                })
              }}>
                {isCompleted ? <Check size={18} /> : stepNumber}
              </div>
              
              {/* Label */}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-success)' : 'var(--color-text-muted)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
