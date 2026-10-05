import { useEffect, useState } from "react"
import {
  Edit3,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../services/addressService"

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
}

function Addresses() {
  const [addresses, setAddresses] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // ==========================================================
  // LOAD ADDRESSES
  // ==========================================================

  const loadAddresses = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getAddresses()

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load addresses",
        )
      }

      setAddresses(result.data || [])
    } catch (err) {
      console.error("Load addresses error:", err)

      setError(
        err.message || "Unable to load addresses.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

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
  // OPEN ADD FORM
  // ==========================================================

  const handleAddAddress = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError("")
    setMessage("")
  }

  // ==========================================================
  // OPEN EDIT FORM
  // ==========================================================

  const handleEdit = (address) => {
    setForm({
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "India",
    })

    setEditingId(address.id)
    setShowForm(true)

    setError("")
    setMessage("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ==========================================================
  // CREATE / UPDATE ADDRESS
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")
      setMessage("")

      // Basic validation
      if (
        !form.name.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.postal_code.trim() ||
        !form.country.trim()
      ) {
        setError(
          "Please fill in all required fields.",
        )

        return
      }

      const addressData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postal_code: form.postal_code.trim(),
        country: form.country.trim() || "India",
      }

      // ======================================================
      // UPDATE EXISTING ADDRESS
      // ======================================================

      if (editingId) {
        const result = await updateAddress(
          editingId,
          addressData,
        )

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to update address",
          )
        }

        setMessage(
          "Address updated successfully.",
        )
      }

      // ======================================================
      // CREATE NEW ADDRESS
      // ======================================================

      else {
        const result = await createAddress(
          addressData,
        )

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to create address",
          )
        }

        setMessage(
          "Address added successfully.",
        )
      }

      // Reset form
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)

      await loadAddresses()
    } catch (err) {
      console.error(
        editingId
          ? "Update address error:"
          : "Create address error:",
        err,
      )

      setError(
        err.message ||
          "Unable to save address.",
      )
    } finally {
      setSaving(false)
    }
  }

  // ==========================================================
  // DELETE ADDRESS
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(id)
      setError("")
      setMessage("")

      const result = await deleteAddress(id)

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete address",
        )
      }

      setMessage(
        "Address deleted successfully.",
      )

      await loadAddresses()
    } catch (err) {
      console.error(
        "Delete address error:",
        err,
      )

      setError(
        err.message ||
          "Unable to delete address.",
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ==========================================================
  // CANCEL FORM
  // ==========================================================

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setError("")
  }

  // ==========================================================
  // PAGE
  // ==========================================================

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

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                My Addresses
              </h1>

              <p className="mt-2 text-stone-500">
                Manage your shipping addresses for
                faster checkout.
              </p>
            </div>

            {!showForm && (
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                <Plus size={18} />
                Add Address
              </button>
            )}
          </div>
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

        {/* ======================================================
            ADD / EDIT FORM
        ====================================================== */}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Form Header */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-950">
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {editingId
                    ? "Update your shipping address details."
                    : "Enter the address where you want your order delivered."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >
              {/* Full Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* Phone */}

              <div>
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
                  placeholder="Enter phone number"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* Address */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  rows={3}
                  required
                  disabled={saving}
                  className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* City */}

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* State */}

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* Postal Code */}

              <div>
                <label
                  htmlFor="postal_code"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Postal Code
                </label>

                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* Country */}

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-100"
                />
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                      ? "Update Address"
                      : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================
            SAVED ADDRESSES
        ====================================================== */}

        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-950">
                Saved Addresses
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {addresses.length}{" "}
                {addresses.length === 1
                  ? "address"
                  : "addresses"}{" "}
                saved
              </p>
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            /* Empty State */

            <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <MapPin
                size={36}
                className="mx-auto text-stone-300"
              />

              <h3 className="mt-4 font-semibold text-stone-800">
                No saved addresses
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Add an address to use during checkout.
              </p>

              {!showForm && (
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                >
                  <Plus size={17} />
                  Add Address
                </button>
              )}
            </div>
          ) : (
            /* Address Cards */

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {addresses.map((item) => {
                const isDeleting =
                  deletingId === item.id

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md ${
                      isDeleting
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    {/* Card Header */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <MapPin size={19} />
                        </div>

                        <div>
                          <h3 className="font-bold text-stone-900">
                            {item.name}
                          </h3>

                          <p className="text-sm text-stone-500">
                            {item.phone}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="flex items-center gap-1">
                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-stone-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Edit address"
                          title="Edit address"
                        >
                          <Edit3 size={18} />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Delete address"
                          title="Delete address"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Address Details */}

                    <div className="mt-5 border-t border-stone-100 pt-4">
                      <p className="text-sm leading-6 text-stone-600">
                        {item.address}
                        <br />
                        {item.city}, {item.state}
                        <br />
                        {item.postal_code},{" "}
                        {item.country}
                      </p>
                    </div>

                    {/* Checkout Note */}

                    <div className="mt-4 rounded-xl bg-stone-50 px-4 py-3">
                      <p className="text-xs font-medium text-stone-500">
                        This address can be selected
                        during checkout.
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Addresses