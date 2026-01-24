'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef3e2 0%, #fde68a 50%, #fef3e2 100%)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {/* Decorative Book Stack */}
      <div style={{
        fontSize: '8rem',
        marginBottom: '1rem',
        animation: 'float 3s ease-in-out infinite'
      }}>
        📚
      </div>
      
      {/* 404 Number */}
      <h1 style={{
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        lineHeight: 1,
        textShadow: '4px 4px 8px rgba(217, 119, 6, 0.2)'
      }}>
        404
      </h1>
      
      {/* Message in Kannada */}
      <h2 style={{
        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        fontWeight: 600,
        color: '#92400e',
        marginTop: '1rem',
        marginBottom: '0.5rem'
      }}>
        ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ
      </h2>
      
      {/* English subtitle */}
      <p style={{
        fontSize: '1.125rem',
        color: '#78716c',
        marginBottom: '2rem',
        maxWidth: '400px'
      }}>
        Oops! The page you&apos;re looking for seems to have wandered off into the library...
      </p>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link 
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          🏠 ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ
        </Link>
        
        <Link 
          href="/books"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: 'white',
            color: '#d97706',
            textDecoration: 'none',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '2px solid #d97706',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          📖 ಪುಸ್ತಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ
        </Link>
      </div>
      
      {/* Fun fact */}
      <div style={{
        marginTop: '3rem',
        padding: '1rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        maxWidth: '500px'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: '#78716c',
          margin: 0,
          fontStyle: 'italic'
        }}>
          💡 <strong>ಸಲಹೆ:</strong> ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಸ್ತಕವನ್ನು ನಮ್ಮ ಮುಖಪುಟದ ಹುಡುಕಾಟ ಪಟ್ಟಿಯಲ್ಲಿ ಹುಡುಕಿ!
        </p>
      </div>
      
      {/* Floating animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
      `}} />
    </div>
  )
}
