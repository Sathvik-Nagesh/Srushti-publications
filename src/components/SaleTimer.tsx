'use client'

import { useState, useEffect, memo } from 'react'
import { Clock, Zap } from 'lucide-react'

interface SaleTimerProps {
  endDate?: Date
  title?: string
  variant?: 'banner' | 'inline' | 'compact'
}

// Settings storage key (same as in site-config page)
const SETTINGS_KEY = 'srushti_site_settings'

// Memoized to prevent re-renders on every second tick when values haven't changed
const TimeBox = memo(({ value, label, variant }: { value: number; label: string; variant: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <div style={{
      background: variant === 'banner' ? 'rgba(255,255,255,0.2)' : 'var(--color-primary)',
      color: 'white',
      padding: variant === 'compact' ? '0.25rem 0.5rem' : '0.5rem 0.75rem',
      borderRadius: 'var(--radius-md)',
      minWidth: variant === 'compact' ? 36 : 48,
      textAlign: 'center',
      fontWeight: 700,
      fontSize: variant === 'compact' ? '0.875rem' : '1.25rem',
      fontFamily: 'monospace'
    }}>
      {String(value).padStart(2, '0')}
    </div>
    <span style={{
      fontSize: '0.625rem',
      marginTop: '0.25rem',
      opacity: 0.8,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {label}
    </span>
  </div>
))

TimeBox.displayName = 'TimeBox'

// Memoized to prevent re-renders on every second tick
const Separator = memo(({ variant }: { variant: string }) => (
  <span style={{
    fontSize: variant === 'compact' ? '1rem' : '1.5rem',
    fontWeight: 700,
    animation: 'blink 1s infinite'
  }}>
    :
  </span>
))

Separator.displayName = 'Separator'

export default function SaleTimer({ 
  endDate: propEndDate,
  title: propTitle,
  variant = 'banner'
}: SaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [timerTitle, setTimerTitle] = useState(propTitle || 'ವಿಶೇಷ ಆಫರ್ ಮುಕ್ತಾಯ!')
  const [endDate, setEndDate] = useState(() => propEndDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY)
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setIsEnabled(settings.saleTimerEnabled !== false)
        if (settings.saleTimerTitle) {
          setTimerTitle(settings.saleTimerTitle)
        }
        if (settings.saleTimerEndDate) {
          const endDateFromSettings = new Date(settings.saleTimerEndDate)
          // Set end time to 23:59:59
          endDateFromSettings.setHours(23, 59, 59, 999)
          setEndDate(endDateFromSettings)
        }
      }
    } catch (e) {
      console.error('Failed to load sale timer settings:', e)
    }
  }, [])
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - Date.now()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [endDate])
  
  // Don't render if not mounted or disabled
  if (!mounted || !isEnabled) return null
  
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: '0.875rem'
      }}>
        <Zap size={16} />
        <span style={{ fontWeight: 500 }}>ಆಫರ್ ಮುಕ್ತಾಯ:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'monospace', fontWeight: 700 }}>
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <style jsx>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }
  
  if (variant === 'inline') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 0 20px rgba(217, 119, 6, 0.2)'
      }}>
        <Clock size={24} style={{ color: 'var(--color-primary)' }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, margin: 0 }}>{timerTitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TimeBox value={timeLeft.days} label="ದಿನ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.hours} label="ಗಂ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.minutes} label="ನಿ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.seconds} label="ಸೆ" variant={variant} />
        </div>
        <style jsx>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    )
  }
  
  // Banner variant (default)
  return (
    <div style={{
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Zap size={24} />
          <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>{timerTitle}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TimeBox value={timeLeft.days} label="ದಿನ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.hours} label="ಗಂಟೆ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.minutes} label="ನಿಮಿಷ" variant={variant} />
          <Separator variant={variant} />
          <TimeBox value={timeLeft.seconds} label="ಸೆಕೆಂ" variant={variant} />
        </div>
      </div>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
