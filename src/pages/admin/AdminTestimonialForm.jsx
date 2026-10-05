import { useEffect, useState } from "react"
import {
    ArrowLeft,
    Check,
    Loader2,
    Save,
    Star,
    X,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
    createTestimonial,
    getAdminTestimonialById,
    updateTestimonial,
} from "../../services/testimonialService"

function AdminTestimonialForm() {
    const navigate = useNavigate()
    const { id } = useParams()

    const isEditMode = Boolean(id)

    // ============================================================
    // STATE
    // ============================================================

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_role: "",
        review: "",
        rating: 5,
        display_order: 0,
        is_active: true,
    })

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditMode)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // ============================================================
    // FETCH TESTIMONIAL FOR EDIT
    // ============================================================

    useEffect(() => {
        if (!isEditMode) {
            return
        }

        const fetchTestimonial = async () => {
            try {
                setFetching(true)
                setError("")

                const result =
                    await getAdminTestimonialById(id)

                if (!result?.success) {
                    throw new Error(
                        result?.message ||
                            "Failed to fetch testimonial",
                    )
                }

                const testimonial = result.data

                setFormData({
                    customer_name:
                        testimonial.customer_name ||
                        "",

                    customer_role:
                        testimonial.customer_role ||
                        "",

                    review:
                        testimonial.review ||
                        "",

                    rating: Number(
                        testimonial.rating || 5,
                    ),

                    display_order: Number(
                        testimonial.display_order || 0,
                    ),

                    is_active:
                        testimonial.is_active !== false,
                })
            } catch (err) {
                console.error(
                    "Fetch testimonial error:",
                    err,
                )

                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Unable to load testimonial.",
                )
            } finally {
                setFetching(false)
            }
        }

        fetchTestimonial()
    }, [id, isEditMode])

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
    }

    // ============================================================
    // HANDLE RATING
    // ============================================================

    const handleRating = (rating) => {
        setFormData((previous) => ({
            ...previous,
            rating,
        }))
    }

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        if (!formData.customer_name.trim()) {
            return "Customer name is required."
        }

        if (!formData.review.trim()) {
            return "Review is required."
        }

        const rating = Number(
            formData.rating,
        )

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return "Rating must be between 1 and 5."
        }

        const displayOrder = Number(
            formData.display_order,
        )

        if (
            !Number.isInteger(displayOrder) ||
            displayOrder < 0
        ) {
            return "Display order must be 0 or greater."
        }

        return ""
    }

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setSuccess("")

        const validationError =
            validateForm()

        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setLoading(true)

            const payload = {
                customer_name:
                    formData.customer_name.trim(),

                customer_role:
                    formData.customer_role.trim() ||
                    null,

                review:
                    formData.review.trim(),

                rating: Number(
                    formData.rating,
                ),

                display_order: Number(
                    formData.display_order,
                ),

                is_active:
                    Boolean(
                        formData.is_active,
                    ),
            }

            let result

            // ====================================================
            // UPDATE
            // ====================================================

            if (isEditMode) {
                result =
                    await updateTestimonial(
                        id,
                        payload,
                    )
            }

            // ====================================================
            // CREATE
            // ====================================================

            else {
                result =
                    await createTestimonial(
                        payload,
                    )
            }

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        `Failed to ${
                            isEditMode
                                ? "update"
                                : "create"
                        } testimonial`,
                )
            }

            setSuccess(
                isEditMode
                    ? "Testimonial updated successfully."
                    : "Testimonial added successfully.",
            )

            setTimeout(() => {
                navigate(
                    "/admin/testimonials",
                )
            }, 800)
        } catch (err) {
            console.error(
                "Save testimonial error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    `Failed to ${
                        isEditMode
                            ? "update"
                            : "save"
                    } testimonial.`,
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // LOADING EDIT DATA
    // ============================================================

    if (fetching) {
        return (
            <main className="min-h-screen bg-stone-100 px-5 py-8 sm:px-8">

                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                    <div className="text-center">

                        <Loader2
                            size={36}
                            className="mx-auto animate-spin text-amber-500"
                        />

                        <p className="mt-4 text-sm text-stone-500">
                            Loading testimonial...
                        </p>

                    </div>

                </div>

            </main>
        )
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <main className="min-h-screen bg-stone-100">

            {/* ======================================================
                HEADER
            ====================================================== */}

            <section className="border-b border-stone-200 bg-white">

                <div className="px-5 py-7 sm:px-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">

                            <Link
                                to="/admin/testimonials"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                                title="Back to testimonials"
                            >
                                <ArrowLeft
                                    size={19}
                                />
                            </Link>

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                    Testimonial Management
                                </p>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-950">
                                    {isEditMode
                                        ? "Edit Testimonial"
                                        : "Add Testimonial"}
                                </h1>

                                <p className="mt-2 text-sm text-stone-500">
                                    {isEditMode
                                        ? "Update customer testimonial information."
                                        : "Add a new customer testimonial."}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                <div className="mx-auto max-w-4xl">

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

                            <div className="flex items-start gap-3">

                                <div className="mt-0.5 text-red-600">
                                    <X size={20} />
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-red-800">
                                        Unable to save
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                                className="rounded-lg p-1 text-red-500 transition hover:bg-red-100"
                            >
                                <X size={17} />
                            </button>

                        </div>
                    )}

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (
                        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Check size={18} />
                            </div>

                            <p className="text-sm font-semibold text-green-800">
                                {success}
                            </p>

                        </div>
                    )}

                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                    >

                        {/* ==================================================
                            CUSTOMER INFORMATION
                        ================================================== */}

                        <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                            <div className="mb-6">

                                <h2 className="text-lg font-bold text-stone-950">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    Enter the information displayed with the testimonial.
                                </p>

                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">

                                {/* CUSTOMER NAME */}

                                <div>

                                    <label
                                        htmlFor="customer_name"
                                        className="mb-2 block text-sm font-semibold text-stone-800"
                                    >
                                        Customer Name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="customer_name"
                                        name="customer_name"
                                        type="text"
                                        value={
                                            formData.customer_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter customer name"
                                        maxLength={100}
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                    />

                                </div>

                                {/* CUSTOMER ROLE */}

                                <div>

                                    <label
                                        htmlFor="customer_role"
                                        className="mb-2 block text-sm font-semibold text-stone-800"
                                    >
                                        Customer Role
                                    </label>

                                    <input
                                        id="customer_role"
                                        name="customer_role"
                                        type="text"
                                        value={
                                            formData.customer_role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Professional Musician"
                                        maxLength={100}
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            REVIEW
                        ================================================== */}

                        <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                            <div className="mb-6">

                                <h2 className="text-lg font-bold text-stone-950">
                                    Customer Review
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    Write the testimonial that customers will see.
                                </p>

                            </div>

                            <label
                                htmlFor="review"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Review
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="review"
                                name="review"
                                value={
                                    formData.review
                                }
                                onChange={
                                    handleChange
                                }
                                rows={6}
                                maxLength={1000}
                                placeholder="Write the customer's testimonial..."
                                className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                            />

                            <p className="mt-2 text-right text-xs text-stone-400">
                                {
                                    formData.review
                                        .length
                                }{" "}
                                / 1000 characters
                            </p>

                        </div>

                        {/* ==================================================
                            RATING & DISPLAY ORDER
                        ================================================== */}

                        <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                            <div className="mb-6">

                                <h2 className="text-lg font-bold text-stone-950">
                                    Rating & Display
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    Set the rating and display order.
                                </p>

                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">

                                {/* RATING */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-stone-800">
                                        Rating
                                    </label>

                                    <div className="flex items-center gap-1">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (
                                                <button
                                                    key={
                                                        star
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleRating(
                                                            star,
                                                        )
                                                    }
                                                    className="rounded-lg p-1.5 transition hover:bg-amber-50"
                                                    aria-label={`Set rating to ${star}`}
                                                >
                                                    <Star
                                                        size={
                                                            27
                                                        }
                                                        className={
                                                            star <=
                                                            Number(
                                                                formData.rating,
                                                            )
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-stone-300"
                                                        }
                                                    />
                                                </button>
                                            ),
                                        )}

                                        <span className="ml-3 text-sm font-semibold text-stone-600">
                                            {
                                                formData.rating
                                            }{" "}
                                            / 5
                                        </span>

                                    </div>

                                </div>

                                {/* DISPLAY ORDER */}

                                <div>

                                    <label
                                        htmlFor="display_order"
                                        className="mb-2 block text-sm font-semibold text-stone-800"
                                    >
                                        Display Order
                                    </label>

                                    <input
                                        id="display_order"
                                        name="display_order"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={
                                            formData.display_order
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                    />

                                    <p className="mt-2 text-xs text-stone-400">
                                        Lower numbers appear first.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            ACTIVE STATUS
                        ================================================== */}

                        <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                            <label className="flex cursor-pointer items-start gap-4">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        formData.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-500 focus:ring-amber-500"
                                />

                                <span>

                                    <span className="block text-sm font-semibold text-stone-900">
                                        Active Testimonial
                                    </span>

                                    <span className="mt-1 block text-sm text-stone-500">
                                        Active testimonials can be displayed on the customer website.
                                    </span>

                                </span>

                            </label>

                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div className="flex flex-col-reverse gap-3 bg-stone-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">

                            <Link
                                to="/admin/testimonials"
                                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        {isEditMode
                                            ? "Updating..."
                                            : "Saving..."}
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={18}
                                        />

                                        {isEditMode
                                            ? "Update Testimonial"
                                            : "Save Testimonial"}
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    )
}

export default AdminTestimonialForm