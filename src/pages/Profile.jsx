import {
  ClipboardList,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { supabase } from "../lib/supabase"

function Profile() {
  const { user, profile } = useAuth()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  })

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // ==========================================================
  // LOAD PROFILE DATA
  // ==========================================================

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    })
  }, [profile])

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ==========================================================
  // START EDITING
  // ==========================================================

  const handleEdit = () => {
    setMessage("")
    setError("")

    setForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    })

    setEditing(true)
  }

  // ==========================================================
  // CANCEL EDITING
  // ==========================================================

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    })

    setEditing(false)
    setError("")
  }

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")
      setMessage("")

      if (!form.full_name.trim()) {
        setError("Please enter your full name.")
        return
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      setMessage(
        "Profile updated successfully.",
      )

      setEditing(false)

      // Refresh page so useAuth gets latest profile
      window.location.reload()
    } catch (err) {
      console.error(
        "Profile update error:",
        err,
      )

      setError(
        err.message ||
          "Unable to update profile.",
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <User size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-stone-950">
            Login Required
          </h1>

          <p className="mt-2 text-stone-500">
            Please login to view your profile.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Account
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-stone-500">
            Manage your personal information and
            account settings.
          </p>
        </div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ====================================================
              PROFILE CARD
          ==================================================== */}

          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            {/* Card Header */}

            <div className="flex items-center justify-between border-b border-stone-100 p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-xl font-bold text-amber-400">
                  {(profile?.full_name ||
                    user.email ||
                    "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-stone-950">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Your account details
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                >
                  <Edit3 size={17} />
                  <span className="hidden sm:inline">
                    Edit
                  </span>
                </button>
              )}
            </div>

            {/* ==================================================
                VIEW MODE
            ================================================== */}

            {!editing ? (
              <div className="divide-y divide-stone-100">
                {/* Name */}

                <div className="flex items-start gap-4 p-6 sm:p-7">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                      {profile?.full_name ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}

                <div className="flex items-start gap-4 p-6 sm:p-7">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all font-semibold text-stone-900">
                      {profile?.email ||
                        user.email ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Phone */}

                <div className="flex items-start gap-4 p-6 sm:p-7">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Phone Number
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                      {profile?.phone ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ==================================================
                 EDIT MODE
              ================================================== */

              <form
                onSubmit={handleSave}
                className="p-6 sm:p-7"
              >
                {/* Full Name */}

                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={saving}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                  />
                </div>

                {/* Email */}

                <div className="mt-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={
                      profile?.email ||
                      user.email ||
                      ""
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-500"
                  />

                  <p className="mt-2 text-xs text-stone-400">
                    Email is managed through your
                    authentication account.
                  </p>
                </div>

                {/* Phone */}

                <div className="mt-5">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    disabled={saving}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                  />
                </div>

                {/* Buttons */}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* ====================================================
              QUICK LINKS
          ==================================================== */}

          <aside className="space-y-4">
            {/* Addresses */}

            <Link
              to="/addresses"
              className="group block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-100">
                  <MapPin size={21} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-stone-950">
                    My Addresses
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    Add and manage shipping addresses
                  </p>
                </div>
              </div>
            </Link>

            {/* Orders */}

            <Link
              to="/orders"
              className="group block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition group-hover:bg-stone-200">
                  <ClipboardList size={21} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-stone-950">
                    My Orders
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    View your order history
                  </p>
                </div>
              </div>
            </Link>

            {/* Account Information */}

            <div className="rounded-2xl bg-amber-50 p-6">
              <p className="text-sm font-semibold text-amber-900">
                Account Information
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800/70">
                Keep your profile and shipping
                information up to date for a
                smoother checkout experience.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Profile