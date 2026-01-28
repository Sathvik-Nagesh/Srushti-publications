'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

import { useSearchParams } from 'next/navigation'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-alt)' }}>
        <div style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px', width: '100%' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'var(--color-success)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckCircle size={48} color="white" strokeWidth={3} />
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text)' }}>
            ಧನ್ಯವಾದಗಳು!
          </h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
            ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿದೆ (Order Placed)
          </h2>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
            ನಿಮ್ಮ ಆರ್ಡರ್ ವಿವರಗಳನ್ನು ನಾವು ಸ್ವೀಕರಿಸಿದ್ದೇವೆ. ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ದೃಢೀಕರಣ ಇಮೇಲ್ ಮತ್ತು SMS ಕಳುಹಿಸಲಾಗುವುದು.
          </p>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>ಆರ್ಡರ್ ಸಂಖ್ಯೆ (Order Number)</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '1px' }}>
              #{orderNumber || 'PENDING'}
            </p>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
            ನಿಮ್ಮ ಆರ್ಡರ್ ಹಿಸ್ಟರಿಯಲ್ಲಿ ಇದನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/books" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <BookOpen size={20} />
              ಇನ್ನಷ್ಟು ಪುಸ್ತಕಗಳನ್ನು ನೋಡಿ
            </Link>
            
            <Link href="/" className="btn btn-ghost" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
             ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
