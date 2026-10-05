import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { getAdminProfile } from "../../services/adminService"

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.access_token) {
          setIsAdmin(false)
          return
        }

        const result = await getAdminProfile()

        console.log("ADMIN PROFILE RESULT:", result)

        // getAdminProfile returns the profile directly
        if (result?.role === "admin") {
          console.log("ADMIN ACCESS GRANTED")
          setIsAdmin(true)
        } else {
          console.log("ADMIN ACCESS DENIED")
          setIsAdmin(false)
        }
      } catch (error) {
        console.error(
          "Admin verification error:",
          error,
        )

        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAdmin()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

          <p className="mt-4 text-sm font-medium text-stone-500">
            Verifying admin access...
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute