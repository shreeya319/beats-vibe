import { useEffect, useState } from "react"
import {
    Edit,
    Eye,
    Package,
    Plus,
    Search,
    Trash2,
    X,
    AlertTriangle,
    CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"

import { getProducts } from "../../services/productService"
import { getCategories } from "../../services/categoryService"
import { deleteProduct } from "../../services/adminService"

function AdminProducts() {
    // ============================================================
    // STATE
    // ============================================================

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] =
        useState(true)

    const [deleting, setDeleting] = useState(false)

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] =
        useState("")

    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] =
        useState("")

    const [productToDelete, setProductToDelete] =
        useState(null)

    // ============================================================
    // FETCH CATEGORIES
    // ============================================================

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true)

            const result = await getCategories()

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
                err.message ||
                    "Unable to load categories.",
            )
        } finally {
            setCategoriesLoading(false)
        }
    }

    // ============================================================
    // FETCH PRODUCTS
    // ============================================================

    const fetchProducts = async ({
        searchValue = search,
        categoryValue = selectedCategory,
    } = {}) => {
        try {
            setLoading(true)
            setError("")

            const result = await getProducts({
                search: searchValue,
                category: categoryValue,
                page: 1,
                limit: 50,
                sort: "newest",
            })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch products",
                )
            }

            setProducts(result.data || [])
        } catch (err) {
            console.error(
                "Admin products fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load products.",
            )

            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchCategories()
        fetchProducts()
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

        fetchProducts({
            searchValue: search,
            categoryValue: selectedCategory,
        })
    }

    // ============================================================
    // CATEGORY FILTER
    // ============================================================

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value

        setSelectedCategory(categoryId)

        fetchProducts({
            searchValue: search,
            categoryValue: categoryId,
        })
    }

    // ============================================================
    // CLEAR FILTERS
    // ============================================================

    const handleClearFilters = () => {
        setSearch("")
        setSelectedCategory("")

        fetchProducts({
            searchValue: "",
            categoryValue: "",
        })
    }

    // ============================================================
    // PRODUCT IMAGE
    // ============================================================

    const getProductImage = (product) => {
        if (
            !product?.product_images ||
            product.product_images.length === 0
        ) {
            return null
        }

        const primaryImage =
            product.product_images.find(
                (image) => image.is_primary,
            )

        if (primaryImage?.image_url) {
            return primaryImage.image_url
        }

        const sortedImages = [
            ...product.product_images,
        ].sort(
            (a, b) =>
                (a.display_order || 0) -
                (b.display_order || 0),
        )

        return (
            sortedImages[0]?.image_url ||
            null
        )
    }

    // ============================================================
    // SELLING PRICE
    // ============================================================

    const getSellingPrice = (product) => {
        if (
            product.discount_price !== null &&
            product.discount_price !== undefined &&
            Number(product.discount_price) <
                Number(product.price)
        ) {
            return Number(
                product.discount_price,
            )
        }

        return Number(product.price || 0)
    }

    // ============================================================
    // STOCK STATUS
    // ============================================================

    const getStockStatus = (quantity) => {
        const stock = Number(quantity || 0)

        if (stock <= 0) {
            return {
                label: "Out of Stock",
                className:
                    "bg-red-50 text-red-700",
            }
        }

        if (stock <= 5) {
            return {
                label: "Low Stock",
                className:
                    "bg-amber-50 text-amber-700",
            }
        }

        return {
            label: "In Stock",
            className:
                "bg-emerald-50 text-emerald-700",
        }
    }

    // ============================================================
    // FILTER ACTIVE CHECK
    // ============================================================

    const hasActiveFilters =
        search.trim() !== "" ||
        selectedCategory !== ""

    // ============================================================
    // OPEN DELETE MODAL
    // ============================================================

    const handleDeleteClick = (product) => {
        setError("")
        setSuccessMessage("")
        setProductToDelete(product)
    }

    // ============================================================
    // CLOSE DELETE MODAL
    // ============================================================

    const handleCancelDelete = () => {
        if (deleting) {
            return
        }

        setProductToDelete(null)
    }

    // ============================================================
    // CONFIRM DELETE
    // ============================================================

    const handleConfirmDelete = async () => {
        if (!productToDelete?.id) {
            return
        }

        try {
            setDeleting(true)
            setError("")

            const result = await deleteProduct(
                productToDelete.id,
            )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to delete product",
                )
            }

            // Remove deleted product immediately
            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                        product.id !==
                        productToDelete.id,
                ),
            )

            setSuccessMessage(
                result.message ||
                    `"${productToDelete.name}" deleted successfully`,
            )

            setProductToDelete(null)
        } catch (err) {
            console.error(
                "Delete product error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete product.",
            )
        } finally {
            setDeleting(false)
        }
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

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Products
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Manage your musical
                                instrument catalog.
                            </p>
                        </div>

                        <Link
                            to="/admin/products/new"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                        >
                            <Plus size={18} />
                            Add Product
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
                            >
                                <X size={18} />
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ====================================================
                    SEARCH + CATEGORY FILTER
                ==================================================== */}

                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 xl:flex-row"
                    >

                        {/* SEARCH */}

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
                                        event.target.value,
                                    )
                                }
                                placeholder="Search by product name or brand..."
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                            />

                        </div>

                        {/* CATEGORY */}

                        <div className="xl:w-60">

                            <select
                                value={
                                    selectedCategory
                                }
                                onChange={
                                    handleCategoryChange
                                }
                                disabled={
                                    categoriesLoading
                                }
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <option value="">
                                    {categoriesLoading
                                        ? "Loading categories..."
                                        : "All Categories"}
                                </option>

                                {categories.map(
                                    (
                                        category,
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    ),
                                )}

                            </select>

                        </div>

                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            Search
                        </button>

                        {/* CLEAR */}

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                            >
                                <X size={17} />
                                Clear
                            </button>
                        )}

                    </form>

                    {selectedCategory && (
                        <div className="mt-4 flex items-center gap-2">

                            <span className="text-xs font-medium text-stone-400">
                                Showing category:
                            </span>

                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                {categories.find(
                                    (category) =>
                                        String(
                                            category.id,
                                        ) ===
                                        String(
                                            selectedCategory,
                                        ),
                                )?.name ||
                                    "Selected Category"}
                            </span>

                        </div>
                    )}

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
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}

                {/* ====================================================
                    LOADING / EMPTY / TABLE
                ==================================================== */}

                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading products...
                            </p>

                        </div>

                    </div>
                ) : products.length === 0 ? (

                    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                <Package size={28} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-stone-950">
                                No products found
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {hasActiveFilters
                                    ? "Try changing your search or category filter."
                                    : "No products are available yet."}
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <X size={16} />
                                    Clear Filters
                                </button>
                            )}

                        </div>

                    </div>
                ) : (

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[950px]">

                                <thead>
                                    <tr className="border-b border-stone-200 bg-stone-50">

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Product
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Category
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Price
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Stock
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">

                                    {products.map(
                                        (
                                            product,
                                            index,
                                        ) => {
                                            const image =
                                                getProductImage(
                                                    product,
                                                )

                                            const stock =
                                                getStockStatus(
                                                    product.stock_quantity,
                                                )

                                            const sellingPrice =
                                                getSellingPrice(
                                                    product,
                                                )

                                            const hasDiscount =
                                                product.discount_price !==
                                                    null &&
                                                product.discount_price !==
                                                    undefined &&
                                                Number(
                                                    product.discount_price,
                                                ) <
                                                    Number(
                                                        product.price,
                                                    )

                                            return (
                                                <motion.tr
                                                    key={
                                                        product.id
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

                                                    {/* PRODUCT */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-4">

                                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">

                                                                {image ? (
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        className="h-full w-full object-contain p-1"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                                                                        <Package
                                                                            size={
                                                                                22
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}

                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="max-w-[260px] truncate font-semibold text-stone-950">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-xs text-stone-400">
                                                                    {product.brand ||
                                                                        "No brand"}

                                                                    {product.sku
                                                                        ? ` • ${product.sku}`
                                                                        : ""}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* CATEGORY */}

                                                    <td className="px-5 py-4">

                                                        <span className="text-sm text-stone-600">
                                                            {product.categories
                                                                ?.name ||
                                                                "Uncategorized"}
                                                        </span>

                                                    </td>

                                                    {/* PRICE */}

                                                    <td className="px-5 py-4">

                                                        <div>

                                                            <p className="font-semibold text-stone-950">
                                                                ₹
                                                                {sellingPrice.toLocaleString(
                                                                    "en-IN",
                                                                )}
                                                            </p>

                                                            {hasDiscount && (
                                                                <p className="text-xs text-stone-400 line-through">
                                                                    ₹
                                                                    {Number(
                                                                        product.price,
                                                                    ).toLocaleString(
                                                                        "en-IN",
                                                                    )}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </td>

                                                    {/* STOCK */}

                                                    <td className="px-5 py-4">

                                                        <p className="text-sm font-medium text-stone-700">
                                                            {product.stock_quantity ??
                                                                0}
                                                        </p>

                                                    </td>

                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex flex-col items-start gap-1.5">

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stock.className}`}
                                                            >
                                                                {
                                                                    stock.label
                                                                }
                                                            </span>

                                                            {product.is_featured && (
                                                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                                    Featured
                                                                </span>
                                                            )}

                                                            {!product.is_active && (
                                                                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                                                                    Inactive
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center justify-end gap-2">

                                                            {/* VIEW */}

                                                            <Link
                                                                to={`/products/${product.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900"
                                                                title="View product"
                                                            >
                                                                <Eye
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </Link>

                                                            {/* EDIT */}

                                                            <Link
                                                                to={`/admin/products/edit/${product.id}`}
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                                title="Edit product"
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
                                                                        product,
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                                title="Delete product"
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
                                            )
                                        },
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* TABLE FOOTER */}

                        <div className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-stone-500">

                                Showing{" "}

                                <span className="font-semibold text-stone-800">
                                    {
                                        products.length
                                    }
                                </span>{" "}

                                {products.length ===
                                1
                                    ? "product"
                                    : "products"}

                            </p>

                            {selectedCategory && (
                                <p className="text-xs text-stone-400">
                                    Category filter
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
                {productToDelete && (
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
                        onMouseDown={(event) => {
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
                            aria-labelledby="delete-product-title"
                        >

                            {/* MODAL HEADER */}

                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                        <Trash2
                                            size={19}
                                        />
                                    </div>

                                    <div>
                                        <h2
                                            id="delete-product-title"
                                            className="font-bold text-stone-950"
                                        >
                                            Delete Product
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
                                        size={19}
                                    />
                                </button>

                            </div>

                            {/* MODAL BODY */}

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
                                            Are you sure you
                                            want to delete
                                            this product?
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-stone-600">
                                            The product and
                                            its associated
                                            information will
                                            be permanently
                                            removed.
                                        </p>

                                    </div>

                                </div>

                                {/* PRODUCT PREVIEW */}

                                <div className="mt-5 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">

                                        {getProductImage(
                                            productToDelete,
                                        ) ? (
                                            <img
                                                src={getProductImage(
                                                    productToDelete,
                                                )}
                                                alt={
                                                    productToDelete.name
                                                }
                                                className="h-full w-full object-contain p-1"
                                            />
                                        ) : (
                                            <Package
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
                                                productToDelete.name
                                            }
                                        </p>

                                        <p className="mt-0.5 text-xs text-stone-400">
                                            {productToDelete.sku ||
                                                "No SKU"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* MODAL FOOTER */}

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
                                            Delete Product
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

export default AdminProducts