"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User, LoginCredentials, RegisterData, AuthResponse } from "@/types/api-types"
import { AUTH_ENDPOINTS } from "@/lib/api-config"

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  showAuthModal: boolean; // Added for auth modal control
}

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  showAuthModal: boolean; // Added for auth modal control
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  openAuthModal: () => void; // New function to open auth modal
  closeAuthModal: () => void; // New function to close auth modal
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_STORAGE_KEY = "triddle_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    showAuthModal: false, // Initialize modal as hidden
  })

  const router = useRouter()

  const setAuthState = (data: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...data }))
  }

  // Function to open auth modal
  const openAuthModal = () => {
    setAuthState({ showAuthModal: true });
  }

  // Function to close auth modal
  const closeAuthModal = () => {
    setAuthState({ showAuthModal: false });
  }

  // Check if user is logged in on initial load
  useEffect(() => {
    // Initialize token from localStorage (only on client side)
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
    setAuthState({ token })
    
    async function initializeAuth() {
      await checkAuth()
    }
    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState({ isLoading: true, error: null })
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      
      const data: AuthResponse = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed")
      }
      
      if (data.token && data.user) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
        
        setAuthState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          showAuthModal: false, // Close modal on successful login
        })
        
        toast.success("Successfully logged in")
        return true
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      })
      
      toast.error(message)
      return false
    }
  }

  // Register function
  const signup = async (data: RegisterData): Promise<boolean> => {
    setAuthState({ isLoading: true, error: null })
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      const responseData: AuthResponse = await response.json()
      
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Registration failed")
      }
      
      toast.success("Account created successfully")
      router.push("/login")
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed"
      setAuthState({
        isLoading: false,
        error: message,
      })
      
      toast.error(message)
      return false
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (state.token) {
        await fetch(AUTH_ENDPOINTS.logout, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      // Clear local storage and state regardless of API success
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      
      router.push("/login")
      toast.success("You have been logged out")
    }
  }

  // Check auth state
  const checkAuth = async (): Promise<boolean> => {
    setAuthState({ isLoading: true })
    
    if (typeof window === 'undefined') {
      return false // Server-side rendering, no authentication
    }
    
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    
    if (!token) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      return false
    }
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.me, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error("Session expired")
      }
      
      const data = await response.json()
      
      if (data.success && data.user) {
        setAuthState({
          user: data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return true
      } else {
        throw new Error("Failed to authenticate user")
      }
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please login again.",
      })
      
      return false
    }
  }

  const value = {
    ...state,
    login,
    signup,
    logout,
    checkAuth,
    openAuthModal,
    closeAuthModal,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}