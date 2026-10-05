import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, LogIn } from "lucide-react"

import AuthLayout from "../../components/auth/AuthLayout"
import { useAuth } from "../../hooks/useAuth"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ============================================================
  // HANDLE LOGIN
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const result = await login(form)

      // ========================================================
      // ADMIN LOGIN
      // ========================================================

      if (result?.profile?.role === "admin") {
        navigate("/admin", {
          replace: true,
        })

        return
      }

      // ========================================================
      // CUSTOMER LOGIN
      // ========================================================

      navigate("/", {
        replace: true,
      })
    } catch (err) {
      console.error("Login error:", err)

      setError(
        err.message ||
          "Unable to sign in. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your musical journey."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-amber-400 transition hover:text-amber-300"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ======================================================
            EMAIL
        ====================================================== */}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-stone-300"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* ======================================================
            PASSWORD
        ====================================================== */}

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-stone-300"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 pr-12 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-stone-500 transition hover:text-stone-200"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================
            LOGIN BUTTON
        ====================================================== */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={18} />

          {loading
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login