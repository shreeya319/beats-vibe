import { useEffect, useState } from "react"
import {
    AlertCircle,
    Edit,
    MessageSquareQuote,
    Plus,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import { Link } from "react-router-dom"

import {
    getAdminTestimonials,
    toggleTestimonialStatus,
    deleteTestimonial,
} from "../../services/testimonialService"

function AdminTestimonials() {
    // ============================================================
    // STATE
    // ============================================================

    const [testimonials, setTestimonials] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")

    const [deleteId, setDeleteId] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const [updatingStatusId, setUpdatingStatusId] =
        useState(null)

    // ============================================================
    // FETCH TESTIMONIALS
    // ============================================================

    const fetchTestimonials = async () => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminTestimonials({
                    search: search.trim(),
                    status,
                })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch testimonials",
                )
            }

            setTestimonials(result.data || [])
        } catch (err) {
            console.error(
                "Admin testimonials fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load testimonials.",
            )

            setTestimonials([])
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD / FILTER
    // ============================================================

    useEffect(() => {
        fetchTestimonials()
    }, [status])

    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (event) => {
        event.preventDefault()

        fetchTestimonials()
    }

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearch("")

        setTimeout(() => {
            fetchTestimonials()
        }, 0)
    }

    // ============================================================
    // TOGGLE STATUS
    // ============================================================

    const handleToggleStatus = async (
        id,
    ) => {
        try {
            setUpdatingStatusId(id)
            setError("")

            const result =
                await toggleTestimonialStatus(
                    id,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update testimonial status",
                )
            }

            await fetchTestimonials()
        } catch (err) {
            console.error(
                "Toggle testimonial status error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to update testimonial status.",
            )
        } finally {
            setUpdatingStatusId(null)
        }
    }

    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = async () => {
        if (!deleteId) {
            return
        }

        try {
            setDeleting(true)
            setError("")

            const result =
                await deleteTestimonial(
                    deleteId,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to delete testimonial",
                )
            }

            setDeleteId(null)

            await fetchTestimonials()
        } catch (err) {
            console.error(
                "Delete testimonial error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete testimonial.",
            )
        } finally {
            setDeleting(false)
        }
    }

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {
        if (!date) {
            return "—"
        }

        const parsedDate = new Date(date)

        if (
            Number.isNaN(
                parsedDate.getTime(),
            )
        ) {
            return "—"
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            },
        )
    }

    // ============================================================
    // RATING
    // ============================================================

    const renderStars = (rating) => {
        const numericRating =
            Number(rating || 0)

        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(
                    (star) => (
                        <Star
                            key={star}
                            size={15}
                            className={
                                star <=
                                numericRating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-stone-300"
                            }
                        />
                    ),
                )}
            </div>
        )
    }

    // ============================================================
    // SEARCH STATE
    // ============================================================

    const hasSearch =
        search.trim() !== ""

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

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Testimonials
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Manage customer reviews
                                and testimonials displayed
                                on your website.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-400">
                                <MessageSquareQuote
                                    size={23}
                                />
                            </div>

                            <Link
                                to="/admin/testimonials/new"
                                className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                                <Plus size={18} />
                                Add Testimonial
                            </Link>

                        </div>

                    </div>

                </div>
            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                {/* ==================================================
                    SEARCH + FILTER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* SEARCH */}

                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex flex-1 flex-col gap-3 sm:flex-row"
                        >

                            <div className="relative flex-1">

                                <Search
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(
                                        event,
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Search by customer, role or review..."
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                />

                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                                Search
                            </button>

                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearSearch
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                                >
                                    <X size={17} />
                                    Clear
                                </button>
                            )}

                        </form>

                        {/* STATUS */}

                        <select
                            value={status}
                            onChange={(
                                event,
                            ) =>
                                setStatus(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                        >
                            <option value="all">
                                All Testimonials
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                    </div>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -10,
                            }}
                            className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
                        >

                            <div className="flex items-start gap-3">

                                <AlertCircle
                                    size={20}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-red-800">
                                        Something went wrong
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
                                className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-100"
                            >
                                <X size={18} />
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (
                    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading testimonials...
                            </p>

                        </div>

                    </div>
                ) : testimonials.length === 0 ? (

                    /* ==================================================
                       EMPTY
                    ================================================== */

                    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                <MessageSquareQuote
                                    size={28}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-stone-950">
                                No testimonials found
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {hasSearch
                                    ? "Try changing your search."
                                    : "No testimonials have been added yet."}
                            </p>

                            {!hasSearch && (
                                <Link
                                    to="/admin/testimonials/new"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <Plus size={16} />
                                    Add Testimonial
                                </Link>
                            )}

                        </div>

                    </div>
                ) : (

                    /* ==================================================
                       TABLE
                    ================================================== */

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead>
                                    <tr className="border-b border-stone-200 bg-stone-50">

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Review
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Rating
                                        </th>

                                        <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Order
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Created
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">

                                    {testimonials.map(
                                        (
                                            testimonial,
                                            index,
                                        ) => (
                                            <motion.tr
                                                key={
                                                    testimonial.id
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay:
                                                        index *
                                                        0.03,
                                                }}
                                                className="transition hover:bg-stone-50"
                                            >

                                                {/* CUSTOMER */}

                                                <td className="px-5 py-4">

                                                    <div className="max-w-[200px]">

                                                        <p className="truncate font-semibold text-stone-950">
                                                            {
                                                                testimonial.customer_name
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-stone-400">
                                                            {
                                                                testimonial.customer_role ||
                                                                    "Customer"
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* REVIEW */}

                                                <td className="px-5 py-4">

                                                    <p className="max-w-[420px] text-sm leading-6 text-stone-600">
                                                        "
                                                        {
                                                            testimonial.review
                                                        }
                                                        "
                                                    </p>

                                                </td>

                                                {/* RATING */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        {renderStars(
                                                            testimonial.rating,
                                                        )}

                                                        <span className="text-xs font-semibold text-stone-500">
                                                            {
                                                                testimonial.rating
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* DISPLAY ORDER */}

                                                <td className="px-5 py-4 text-center">

                                                    <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-bold text-stone-600">
                                                        {
                                                            testimonial.display_order
                                                        }
                                                    </span>

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingStatusId ===
                                                            testimonial.id
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                testimonial.id,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2"
                                                        title="Click to change status"
                                                    >

                                                        <span
                                                            className={`h-2.5 w-2.5 rounded-full ${
                                                                testimonial.is_active
                                                                    ? "bg-emerald-500"
                                                                    : "bg-stone-400"
                                                            }`}
                                                        />

                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                testimonial.is_active
                                                                    ? "text-emerald-700"
                                                                    : "text-stone-500"
                                                            }`}
                                                        >
                                                            {testimonial.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>

                                                    </button>

                                                </td>

                                                {/* CREATED */}

                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-stone-500">
                                                        {formatDate(
                                                            testimonial.created_at,
                                                        )}
                                                    </span>

                                                </td>

                                                {/* ACTION */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <Link
                                                            to={`/admin/testimonials/edit/${testimonial.id}`}
                                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-medium text-stone-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                            title="Edit testimonial"
                                                        >
                                                            <Edit
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    testimonial.id,
                                                                )
                                                            }
                                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                            title="Delete testimonial"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </motion.tr>
                                        ),
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-stone-500">
                                Showing{" "}
                                <span className="font-semibold text-stone-800">
                                    {
                                        testimonials.length
                                    }
                                </span>{" "}
                                {testimonials.length ===
                                1
                                    ? "testimonial"
                                    : "testimonials"}
                            </p>

                            <p className="text-xs text-stone-400">
                                Click Active/Inactive
                                to change visibility
                            </p>

                        </div>

                    </div>
                )}

            </section>

            {/* ======================================================
                DELETE MODAL
            ====================================================== */}

            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
                        onClick={() =>
                            !deleting &&
                            setDeleteId(null)
                        }
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
                        >

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Trash2
                                        size={21}
                                    />
                                </div>

                                {!deleting && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteId(
                                                null,
                                            )
                                        }
                                        className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                                    >
                                        <X
                                            size={19}
                                        />
                                    </button>
                                )}

                            </div>

                            <h2 className="mt-5 text-xl font-bold text-stone-950">
                                Delete testimonial?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-stone-500">
                                This testimonial will
                                be permanently removed.
                                This action cannot be
                                undone.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    disabled={
                                        deleting
                                    }
                                    onClick={() =>
                                        setDeleteId(
                                            null,
                                        )
                                    }
                                    className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        deleting
                                    }
                                    onClick={
                                        handleDelete
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2
                                                size={
                                                    17
                                                }
                                            />
                                            Delete
                                        </>
                                    )}
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    )
}

export default AdminTestimonials