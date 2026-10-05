import { useEffect, useState } from "react"
import {
    Save,
    Store,
    Mail,
    Phone,
    MapPin,
    Truck,
    Percent,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Settings as SettingsIcon,
    Globe2,
    MessageCircle,
    AtSign,
} from "lucide-react"

const API = "http://localhost:5000/api/settings"

function AdminSettings() {
    const [settingsId, setSettingsId] = useState(null)

    const [formData, setFormData] = useState({
        // Store settings
        store_name: "",
        store_description: "",
        currency: "INR",

        free_shipping_threshold: "",
        shipping_charge: "",
        tax_percentage: "",

        store_status: true,

        // Contact information
        email: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        support_description: "",

        // Social links
        facebook_url: "",
        instagram_url: "",
        whatsapp_number: "",
        whatsapp_message: "",
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // ============================================================
    // FETCH SETTINGS
    // ============================================================

    const fetchSettings = async () => {
        try {
            setLoading(true)
            setErrorMessage("")
            setSuccessMessage("")

            const response = await fetch(`${API}/admin`)

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to fetch store settings",
                )
            }

            const store = result.data?.store || {}
            const contact = result.data?.contact || {}

            setSettingsId(store.id)

            setFormData({
                // Store settings
                store_name: store.store_name || "",
                store_description:
                    store.store_description || "",

                currency: store.currency || "INR",

                free_shipping_threshold:
                    store.free_shipping_threshold ?? "",

                shipping_charge:
                    store.shipping_charge ?? "",

                tax_percentage:
                    store.tax_percentage ?? "",

                store_status:
                    store.store_status !== false,

                // Contact information
                email: contact.email || "",
                phone: contact.phone || "",

                address_line1:
                    contact.address_line1 || "",

                address_line2:
                    contact.address_line2 || "",

                support_description:
                    contact.support_description || "",

                // Social links
                facebook_url:
                    contact.facebook_url || "",

                instagram_url:
                    contact.instagram_url || "",

                whatsapp_number:
                    contact.whatsapp_number || "",

                whatsapp_message:
                    contact.whatsapp_message || "",
            })
        } catch (error) {
            console.error(
                "Fetch settings error:",
                error,
            )

            setErrorMessage(
                error.message ||
                    "Failed to load settings",
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchSettings()
    }, [])

    // ============================================================
    // HANDLE INPUT
    // ============================================================

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }))

        setSuccessMessage("")
        setErrorMessage("")
    }

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        if (!formData.store_name.trim()) {
            return "Store name is required"
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim(),
            )
        ) {
            return "Please enter a valid contact email"
        }

        const numericFields = [
            {
                label: "Free shipping threshold",
                value:
                    formData.free_shipping_threshold,
            },
            {
                label: "Shipping charge",
                value:
                    formData.shipping_charge,
            },
            {
                label: "Tax percentage",
                value:
                    formData.tax_percentage,
            },
        ]

        for (const field of numericFields) {
            if (
                field.value !== "" &&
                (
                    Number.isNaN(
                        Number(field.value),
                    ) ||
                    Number(field.value) < 0
                )
            ) {
                return `${field.label} must be a valid non-negative number`
            }
        }

        if (
            formData.tax_percentage !== "" &&
            Number(formData.tax_percentage) > 100
        ) {
            return "Tax percentage cannot exceed 100"
        }

        return null
    }

    // ============================================================
    // SAVE SETTINGS
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault()

        setSuccessMessage("")
        setErrorMessage("")

        const validationError =
            validateForm()

        if (validationError) {
            setErrorMessage(validationError)
            return
        }

        if (!settingsId) {
            setErrorMessage(
                "Store settings record was not found",
            )
            return
        }

        try {
            setSaving(true)

            const response = await fetch(
                `${API}/${settingsId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        // ==================================================
                        // STORE SETTINGS
                        // ==================================================

                        store_name:
                            formData.store_name,

                        store_description:
                            formData.store_description,

                        currency:
                            formData.currency,

                        free_shipping_threshold:
                            formData.free_shipping_threshold,

                        shipping_charge:
                            formData.shipping_charge,

                        tax_percentage:
                            formData.tax_percentage,

                        store_status:
                            formData.store_status,

                        // ==================================================
                        // CONTACT INFORMATION
                        // These update contact_information table
                        // ==================================================

                        email:
                            formData.email,

                        phone:
                            formData.phone,

                        address_line1:
                            formData.address_line1,

                        address_line2:
                            formData.address_line2,

                        support_description:
                            formData.support_description,

                        // ==================================================
                        // SOCIAL MEDIA
                        // These also update contact_information table
                        // ==================================================

                        facebook_url:
                            formData.facebook_url,

                        instagram_url:
                            formData.instagram_url,

                        whatsapp_number:
                            formData.whatsapp_number,

                        whatsapp_message:
                            formData.whatsapp_message,
                    }),
                },
            )

            const result =
                await response.json()

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                        "Failed to update settings",
                )
            }

            const store = result.data?.store || {}
            const contact =
                result.data?.contact || {}

            setSettingsId(store.id)

            setFormData({
                // Store
                store_name:
                    store.store_name || "",

                store_description:
                    store.store_description || "",

                currency:
                    store.currency || "INR",

                free_shipping_threshold:
                    store.free_shipping_threshold ??
                    "",

                shipping_charge:
                    store.shipping_charge ??
                    "",

                tax_percentage:
                    store.tax_percentage ??
                    "",

                store_status:
                    store.store_status !== false,

                // Contact
                email:
                    contact.email || "",

                phone:
                    contact.phone || "",

                address_line1:
                    contact.address_line1 || "",

                address_line2:
                    contact.address_line2 || "",

                support_description:
                    contact.support_description ||
                    "",

                // Social
                facebook_url:
                    contact.facebook_url || "",

                instagram_url:
                    contact.instagram_url || "",

                whatsapp_number:
                    contact.whatsapp_number || "",

                whatsapp_message:
                    contact.whatsapp_message || "",
            })

            setSuccessMessage(
                "Settings and contact information updated successfully.",
            )
        } catch (error) {
            console.error(
                "Update settings error:",
                error,
            )

            setErrorMessage(
                error.message ||
                    "Failed to update settings",
            )
        } finally {
            setSaving(false)
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100 p-5 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="text-center">
                            <RefreshCw
                                size={30}
                                className="mx-auto animate-spin text-amber-600"
                            />

                            <p className="mt-4 text-sm font-medium text-stone-600">
                                Loading settings...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="min-h-screen bg-stone-100 p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <SettingsIcon size={22} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                        Administration
                                    </p>

                                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                                        Settings
                                    </h1>
                                </div>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-stone-500">
                                Manage store information,
                                contact details, shipping,
                                tax, social links, and
                                store status.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchSettings}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {successMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <p>{successMessage}</p>
                    </div>
                )}

                {/* ==================================================
                    ERROR
                ================================================== */}

                {errorMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <p>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">

                        {/* ==================================================
                            STORE INFORMATION
                        ================================================== */}

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Store size={20} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-stone-950">
                                        Store Information
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500">
                                        Basic information about your store.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Store Name
                                    </label>

                                    <input
                                        type="text"
                                        name="store_name"
                                        value={formData.store_name}
                                        onChange={handleChange}
                                        placeholder="Enter store name"
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Store Description
                                    </label>

                                    <textarea
                                        name="store_description"
                                        value={formData.store_description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Enter store description"
                                        className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Currency
                                    </label>

                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    >
                                        <option value="INR">
                                            INR — Indian Rupee
                                        </option>

                                        <option value="USD">
                                            USD — US Dollar
                                        </option>

                                        <option value="EUR">
                                            EUR — Euro
                                        </option>

                                        <option value="GBP">
                                            GBP — British Pound
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* ==================================================
                            CONTACT INFORMATION
                        ================================================== */}

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-stone-950">
                                        Contact Information
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500">
                                        These details are used by the customer Contact page.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* EMAIL */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="support@example.com"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* PHONE */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Phone
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* ADDRESS LINE 1 */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Address Line 1
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={formData.address_line1}
                                            onChange={handleChange}
                                            placeholder="Shop No. 12, Main Market"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* ADDRESS LINE 2 */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Address Line 2
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="text"
                                            name="address_line2"
                                            value={formData.address_line2}
                                            onChange={handleChange}
                                            placeholder="City, State, PIN"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* SUPPORT DESCRIPTION */}

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Support Description
                                    </label>

                                    <textarea
                                        name="support_description"
                                        value={formData.support_description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="We're here to help with your questions..."
                                        className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    />
                                </div>

                            </div>

                            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                <strong>Note:</strong> Support title and map location are not changed from this section. Your existing values remain unchanged.
                            </div>
                        </section>

                        {/* ==================================================
                            SHIPPING & TAX
                        ================================================== */}

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Truck size={20} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-stone-950">
                                        Shipping & Tax
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500">
                                        Configure default shipping and tax values.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Free Shipping Threshold
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="free_shipping_threshold"
                                        value={formData.free_shipping_threshold}
                                        onChange={handleChange}
                                        placeholder="5000"
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    />

                                    <p className="mt-2 text-xs text-stone-400">
                                        Orders above this amount qualify for free shipping.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Shipping Charge
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="shipping_charge"
                                        value={formData.shipping_charge}
                                        onChange={handleChange}
                                        placeholder="100"
                                        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                    />

                                    <p className="mt-2 text-xs text-stone-400">
                                        Standard shipping fee.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Tax Percentage
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            name="tax_percentage"
                                            value={formData.tax_percentage}
                                            onChange={handleChange}
                                            placeholder="18"
                                            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-11 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />

                                        <Percent
                                            size={17}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-stone-400">
                                        Default tax percentage.
                                    </p>
                                </div>

                            </div>
                        </section>

                        {/* ==================================================
                            SOCIAL MEDIA
                        ================================================== */}

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Globe2 size={20} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-stone-950">
                                        Social Links
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500">
                                        Update the social media links displayed on the customer website.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* FACEBOOK */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Facebook URL
                                    </label>

                                    <div className="relative">
                                        <AtSign
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="url"
                                            name="facebook_url"
                                            value={formData.facebook_url}
                                            onChange={handleChange}
                                            placeholder="https://facebook.com/yourpage"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* INSTAGRAM */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        Instagram URL
                                    </label>

                                    <div className="relative">
                                        <AtSign
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="url"
                                            name="instagram_url"
                                            value={formData.instagram_url}
                                            onChange={handleChange}
                                            placeholder="https://instagram.com/yourpage"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* WHATSAPP NUMBER */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        WhatsApp Number / Link
                                    </label>

                                    <div className="relative">
                                        <MessageCircle
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="text"
                                            name="whatsapp_number"
                                            value={formData.whatsapp_number}
                                            onChange={handleChange}
                                            placeholder="919876543210 or https://wa.me/919876543210"
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {/* WHATSAPP MESSAGE */}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                                        WhatsApp Message
                                    </label>

                                    <div className="relative">
                                        <MessageCircle
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                        />

                                        <input
                                            type="text"
                                            name="whatsapp_message"
                                            value={formData.whatsapp_message}
                                            onChange={handleChange}
                                            placeholder="Hello, I need assistance..."
                                            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* ==================================================
                            STORE STATUS
                        ================================================== */}

                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-xl font-bold text-stone-950">
                                        Store Status
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-stone-500">
                                        Control whether your online store is currently active.
                                    </p>
                                </div>

                                <label className="inline-flex cursor-pointer items-center gap-3">

                                    <span
                                        className={`text-sm font-semibold ${
                                            formData.store_status
                                                ? "text-green-600"
                                                : "text-stone-500"
                                        }`}
                                    >
                                        {formData.store_status
                                            ? "Store Active"
                                            : "Store Offline"}
                                    </span>

                                    <input
                                        type="checkbox"
                                        name="store_status"
                                        checked={formData.store_status}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                    />

                                    <div className="relative h-7 w-12 rounded-full bg-stone-300 transition peer-checked:bg-amber-500 peer-focus:ring-4 peer-focus:ring-amber-100">
                                        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                                    </div>

                                </label>
                            </div>
                        </section>

                        {/* ==================================================
                            SAVE
                        ================================================== */}

                        <div className="flex justify-end pb-4">

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-sm font-bold text-stone-950 shadow-sm transition hover:bg-amber-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />

                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminSettings