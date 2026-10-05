import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { supabase } from "../lib/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  const loadProfile = async (userId) => {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error(
        "Failed to load profile:",
        error.message,
      )

      setProfile(null)

      return null
    }

    setProfile(data)

    return data
  }

  // ============================================================
  // INITIAL SESSION
  // ============================================================

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    }

    loadSession()

    // ==========================================================
    // AUTH STATE CHANGE
    // ==========================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }

        setLoading(false)
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ============================================================
  // REGISTER
  // ============================================================

  const register = async ({
    email,
    password,
    fullName,
  }) => {
    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw error
    }

    return data
  }

  // ============================================================
  // LOGIN
  // ============================================================

  const login = async ({
    email,
    password,
  }) => {
    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // ----------------------------------------------------------
    // Load profile immediately after successful login
    // ----------------------------------------------------------

    let loggedInProfile = null

    if (data?.user) {
      loggedInProfile = await loadProfile(
        data.user.id,
      )
    }

    return {
      ...data,
      profile: loggedInProfile,
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {
    const { error } =
      await supabase.auth.signOut()

    if (error) {
      throw error
    }

    setUser(null)
    setProfile(null)
  }

  // ============================================================
  // AUTH VALUE
  // ============================================================

  const value = {
    user,
    profile,
    loading,

    register,
    login,
    logout,

    isAuthenticated: Boolean(user),

    isAdmin:
      profile?.role === "admin",
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}