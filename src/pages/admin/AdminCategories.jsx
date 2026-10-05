import { useEffect, useState } from "react"
import {
    AlertTriangle,
    CheckCircle,
    Edit,
    FolderOpen,
    ImageOff,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import { Link } from "react-router-dom"

import {
    deleteCategory,
    getAdminCategories,
} from "../../services/categoryService"

function AdminCategories() {
    // ============================================================
    // STATE
    // ============================================================

    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] =
        useState("")

    const [search, setSearch] = useState("")

    // Category selected for deletion
    const [categoryToDelete, setCategoryToDelete] =
        useState(null)

    // ============================================================
    // FETCH CATEGORIES
    // ============================================================

    const fetchCategories = async (
        searchValue = search,
    ) => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminCategories({
                    search: searchValue,
                })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch categories",
                )
            }

            setCategories(result.data || [])
        } catch (err) {
            console.error(
                "Admin categories fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load categories.",
            )

            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchCategories("")
    }, [])

    // ============================================================
    // SUCCESS MESSAGE AUTO HIDE
    // ============================================================

    useEffect(() => {
        if (!successMessage) {
            return
        }

        const timer = setTimeout(() => {
            setSuccessMessage("")
        }, 4000)

        return () => clearTimeout(timer)
    }, [successMessage])

    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (event) => {
        event.preventDefault()

        fetchCategories(search)
    }

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearch("")
        fetchCategories("")
    }

    // ============================================================
    // OPEN DELETE MODAL
    // ============================================================

    const handleDeleteClick = (category) => {
        setError("")
        setSuccessMessage("")
        setCategoryToDelete(category)
    }

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const handleCancelDelete = () => {
        if (deleting) {
            return
        }

        setCategoryToDelete(null)
    }

    // ============================================================
    // CONFIRM DELETE
    // ============================================================

    const handleConfirmDelete = async () => {
        if (!categoryToDelete?.id) {
            return
        }

        try {
            setDeleting(true)
            setError("")

            const result =
                await deleteCategory(
                    categoryToDelete.id,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to delete category",
                )
            }

            // Remove category immediately from UI
            setCategories(
                (currentCategories) =>
                    currentCategories.filter(
                        (category) =>
                            category.id !==
                            categoryToDelete.id,
                    ),
            )

            setCategoryToDelete(null)

            setSuccessMessage(
                result.message ||
                    `"${categoryToDelete.name}" deleted successfully`,
            )
        } catch (err) {
            console.error(
                "Delete category error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete category.",
            )
        } finally {
            setDeleting(false)
        }
    }

    // ============================================================
    // IMAGE ERROR HANDLER
    // ============================================================

    const handleImageError = (event) => {
        event.currentTarget.style.display =
            "none"

        const fallback =
            event.currentTarget.parentElement?.querySelector(
                "[data-image-fallback]",
            )

        if (fallback) {
            fallback.classList.remove(
                "hidden",
            )
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
    // ACTIVE FILTER
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
                                Categories
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Manage product categories
                                for your musical
                                instrument store.
                            </p>
                        </div>

                        <Link
                            to="/admin/categories/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                        >
                            <Plus size={18} />
                            Add Category
                        </Link>
                    </div>
                </div>
            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">
                {/* ====================================================
                    SUCCESS MESSAGE
                ==================================================== */}

                <AnimatePresence>
                    {successMessage && (
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
                            className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <CheckCircle
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-emerald-800">
                                        Success
                                    </p>

                                    <p className="mt-0.5 text-sm text-emerald-700">
                                        {
                                            successMessage
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSuccessMessage(
                                        "",
                                    )
                                }
                                className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
                                aria-label="Close success message"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ====================================================
                    SEARCH
                ==================================================== */}

                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Search by category name or slug..."
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
                </div>

                {/* ====================================================
                    ERROR
                ==================================================== */}

                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        <div>
                            <p className="font-semibold">
                                Something went wrong
                            </p>

                            <p className="mt-1">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-100"
                            aria-label="Close error"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* ====================================================
                    LOADING
                ==================================================== */}

                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-stone-200 bg-white">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading categories...
                            </p>
                        </div>
                    </div>
                ) : categories.length ===
                  0 ? (
                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                <FolderOpen
                                    size={28}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-stone-950">
                                No categories found
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {hasSearch
                                    ? "Try changing your search."
                                    : "No categories are available yet."}
                            </p>

                            {hasSearch ? (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearSearch
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <X
                                        size={16}
                                    />
                                    Clear Search
                                </button>
                            ) : (
                                <Link
                                    to="/admin/categories/new"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
                                >
                                    <Plus
                                        size={16}
                                    />
                                    Add Category
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ==================================================
                       CATEGORIES TABLE
                    ================================================== */

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[950px]">
                                <thead>
                                    <tr className="border-b border-stone-200 bg-stone-50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Category
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Slug
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Description
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Created
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {categories.map(
                                        (
                                            category,
                                            index,
                                        ) => (
                                            <motion.tr
                                                key={
                                                    category.id
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
                                                {/* ==================================
                                                    CATEGORY
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100">
                                                            {category.image_url ? (
                                                                <>
                                                                    <img
                                                                        src={
                                                                            category.image_url
                                                                        }
                                                                        alt={
                                                                            category.name
                                                                        }
                                                                        onError={
                                                                            handleImageError
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />

                                                                    <div
                                                                        data-image-fallback
                                                                        className="absolute inset-0 hidden items-center justify-center bg-stone-100 text-stone-400"
                                                                    >
                                                                        <ImageOff
                                                                            size={
                                                                                21
                                                                            }
                                                                        />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <FolderOpen
                                                                    size={
                                                                        22
                                                                    }
                                                                    className="text-stone-400"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[230px] truncate font-semibold text-stone-950">
                                                                {
                                                                    category.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-stone-400">
                                                                Category
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ==================================
                                                    SLUG
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    <span className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600">
                                                        /
                                                        {
                                                            category.slug
                                                        }
                                                    </span>
                                                </td>

                                                {/* ==================================
                                                    DESCRIPTION
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    <p className="max-w-[280px] truncate text-sm text-stone-600">
                                                        {category.description ||
                                                            "No description"}
                                                    </p>
                                                </td>

                                                {/* ==================================
                                                    STATUS
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    {category.is_active ? (
                                                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                {/* ==================================
                                                    CREATED
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-stone-500">
                                                        {formatDate(
                                                            category.created_at,
                                                        )}
                                                    </span>
                                                </td>

                                                {/* ==================================
                                                    ACTIONS
                                                ================================== */}

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* EDIT */}

                                                        <Link
                                                            to={`/admin/categories/edit/${category.id}`}
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                            title="Edit category"
                                                        >
                                                            <Edit
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </Link>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    category,
                                                                )
                                                            }
                                                            disabled={
                                                                deleting
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            title="Delete category"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* =================================================
                            TABLE FOOTER
                        ================================================= */}

                        <div className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-stone-500">
                                Showing{" "}
                                <span className="font-semibold text-stone-800">
                                    {
                                        categories.length
                                    }
                                </span>{" "}
                                {categories.length ===
                                1
                                    ? "category"
                                    : "categories"}
                            </p>

                            {hasSearch && (
                                <p className="text-xs text-stone-400">
                                    Search filter
                                    applied
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* ========================================================
                DELETE CONFIRMATION MODAL
            ======================================================== */}

            <AnimatePresence>
                {categoryToDelete && (
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-5 py-6 backdrop-blur-sm"
                        onMouseDown={(
                            event,
                        ) => {
                            if (
                                event.target ===
                                    event.currentTarget &&
                                !deleting
                            ) {
                                handleCancelDelete()
                            }
                        }}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 15,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-category-title"
                        >
                            {/* ============================================
                                MODAL HEADER
                            ============================================ */}

                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                        <Trash2
                                            size={
                                                19
                                            }
                                        />
                                    </div>

                                    <div>
                                        <h2
                                            id="delete-category-title"
                                            className="font-bold text-stone-950"
                                        >
                                            Delete
                                            Category
                                        </h2>

                                        <p className="text-xs text-stone-400">
                                            This action
                                            cannot be
                                            undone
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Close delete dialog"
                                >
                                    <X
                                        size={
                                            19
                                        }
                                    />
                                </button>
                            </div>

                            {/* ============================================
                                MODAL BODY
                            ============================================ */}

                            <div className="px-5 py-6">
                                <div className="flex items-start gap-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                                    <div className="mt-0.5 shrink-0 text-amber-600">
                                        <AlertTriangle
                                            size={
                                                20
                                            }
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-stone-900">
                                            Are you
                                            sure you
                                            want to
                                            delete this
                                            category?
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-stone-600">
                                            The category
                                            will be
                                            permanently
                                            removed.
                                            Products
                                            associated
                                            with this
                                            category
                                            may prevent
                                            deletion.
                                        </p>
                                    </div>
                                </div>

                                {/* CATEGORY PREVIEW */}

                                <div className="mt-5 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                        {categoryToDelete.image_url ? (
                                            <img
                                                src={
                                                    categoryToDelete.image_url
                                                }
                                                alt={
                                                    categoryToDelete.name
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FolderOpen
                                                size={
                                                    20
                                                }
                                                className="text-stone-400"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-stone-900">
                                            {
                                                categoryToDelete.name
                                            }
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-stone-400">
                                            /
                                            {
                                                categoryToDelete.slug
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ============================================
                                MODAL FOOTER
                            ============================================ */}

                            <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        handleCancelDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2
                                                size={
                                                    16
                                                }
                                            />
                                            Delete
                                            Category
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

export default AdminCategories