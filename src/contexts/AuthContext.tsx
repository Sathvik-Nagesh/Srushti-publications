'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  orderCount?: number
}

interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<Customer>) => Promise<{ success: boolean; error?: string }>
  createAccountFromGuest: (data: { email: string; password: string; name: string; orderNumber?: string }) => Promise<{ success: boolean; error?: string }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success && data.authenticated && data.data) {
        setCustomer(data.data)
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCustomer(data.data)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'ಲಾಗಿನ್ ವಿಫಲ' }
    }
  }

  const register = async (userData: { email: string; password: string; name: string; phone?: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCustomer(data.data)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'ನೋಂದಣಿ ವಿಫಲ' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setCustomer(null)
    }
  }

  const updateProfile = async (data: Partial<Customer>) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCustomer(prev => prev ? { ...prev, ...result.data } : null)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'ಅಪ್ಡೇಟ್ ವಿಫಲ' }
    }
  }

  const createAccountFromGuest = async (data: { email: string; password: string; name: string; orderNumber?: string }) => {
    try {
      const response = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        await refreshSession()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'ಖಾತೆ ರಚನೆ ವಿಫಲ' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        updateProfile,
        createAccountFromGuest,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
