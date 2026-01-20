'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Tag,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Package,
  TrendingUp,
  Users,
  FolderOpen
} from 'lucide-react'

const navItems = [
  { label: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', labelEn: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'ಪುಸ್ತಕಗಳು', labelEn: 'Books', href: '/admin/books', icon: BookOpen },
  { label: 'ಆರ್ಡರ್‌ಗಳು', labelEn: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'ವಿಭಾಗಗಳು', labelEn: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'ರಿಯಾಯಿತಿಗಳು', labelEn: 'Offers', href: '/admin/offers', icon: Tag },
  { label: 'ಸೆಟ್ಟಿಂಗ್ಸ್', labelEn: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    
    // Check authentication
    const isAuth = localStorage.getItem('admin_authenticated') === 'true'
    setIsAuthenticated(isAuth)
    
    if (!isAuth && !pathname.includes('/admin/login')) {
      router.push('/admin/login')
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [pathname, router])
  
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    document.cookie = 'admin_session=; path=/admin; max-age=0'
    router.push('/admin/login')
  }
  
  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'var(--color-bg-alt)'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    )
  }
  
  // If on login page, don't show admin layout
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }
  
  // If not authenticated, redirect is happening
  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}
      
      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarOpen ? '260px' : '0',
          background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
          padding: sidebarOpen ? '1.5rem' : '0',
          zIndex: 100,
          overflow: 'hidden',
          transition: 'width 0.3s ease, padding 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Image
            src="/logo.jpg"
            alt="Srushti"
            width={40}
            height={40}
            style={{ borderRadius: '8px' }}
          />
          <span style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: 'white',
            whiteSpace: 'nowrap'
          }}>
            ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್
          </span>
        </div>
        
        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '0.75rem'
            }}>
              ಮುಖ್ಯ ಮೆನು
            </p>
            
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            width: '100%',
            fontSize: '0.9375rem'
          }}
        >
          <LogOut size={20} />
          <span>ಲಾಗ್ ಔಟ್</span>
        </button>
      </aside>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen && !isMobile ? '260px' : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        background: 'var(--color-bg-alt)'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: 'var(--color-bg-alt)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {navItems.find(item => 
                pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              )?.label || 'ಅಡ್ಮಿನ್'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link 
              href="/" 
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--color-text)',
                fontSize: '0.875rem'
              }}
            >
              ಸೈಟ್ ನೋಡಿ
            </Link>
          </div>
        </header>
        
        {/* Page Content */}
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
