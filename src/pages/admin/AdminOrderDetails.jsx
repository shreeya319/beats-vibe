import { useEffect, useState } from "react"
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    Truck,
    User,
    X,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"

import {
    getAdminOrderById,
    updateAdminOrderStatus,
} from "../../services/orderService"

// ============================================================
// ORDER STATUS OPTIONS
// ============================================================

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
]

// ============================================================
// STATUS STYLES
// ============================================================

const getStatusClasses = (status) => {
    switch (status) {
        case "Pending":
            return "bg-amber-50 text-amber-700 border-amber-200"

        case "Confirmed":
            return "bg-blue-50 text-blue-700 border-blue-200"

        case "Processing":
            return "bg-violet-50 text-violet-700 border-violet-200"

        case "Shipped":
            return "bg-indigo-50 text-indigo-700 border-indigo-200"

        case "Delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200"

        case "Cancelled":
            return "bg-red-50 text-red-700 border-red-200"

        default:
            return "bg-stone-50 text-stone-600 border-stone-200"
    }
}

// ============================================================
// STATUS ICON
// ============================================================

const StatusIcon = ({ status, size = 17 }) => {
    switch (status) {
        case "Pending":
            return <Clock size={size} />

        case "Confirmed":
            return <CheckCircle size={size} />

        case "Processing":
            return <Package size={size} />

        case "Shipped":
            return <Truck size={size} />

        case "Delivered":
            return <CheckCircle size={size} />

        case "Cancelled":
            return <X size={size} />

        default:
            return <Package size={size} />
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

    if (Number.isNaN(parsedDate.getTime())) {
        return "—"
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

// ============================================================
// FORMAT DATE + TIME
// ============================================================

const formatDateTime = (date) => {
    if (!date) {
        return "—"
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return "—"
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

// ============================================================
// CURRENCY
// ============================================================

const formatCurrency = (value) => {
    const amount = Number(value || 0)

    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    })
}

// ============================================================
// ADMIN ORDER DETAILS
// ============================================================

function AdminOrderDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    // ========================================================
    // STATE
    // ========================================================

    const [order, setOrder] = useState(null)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingStatus, setUpdatingStatus] =
        useState(false)

    const [selectedStatus, setSelectedStatus] =
        useState("")

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] =
        useState("")

    // ========================================================
    // FETCH ORDER
    // ========================================================

    const fetchOrder = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true)
            } else {
                setRefreshing(true)
            }

            setError("")

            const result =
                await getAdminOrderById(id)

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch order",
                )
            }

            const fetchedOrder = result.data

            setOrder(fetchedOrder)

            setSelectedStatus(
                fetchedOrder?.status || "",
            )
        } catch (err) {
            console.error(
                "Admin order details error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load order details.",
            )
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        if (id) {
            fetchOrder()
        }
    }, [id])

    // ========================================================
    // AUTO HIDE SUCCESS MESSAGE
    // ========================================================

    useEffect(() => {
        if (!successMessage) {
            return
        }

        const timer = setTimeout(() => {
            setSuccessMessage("")
        }, 4000)

        return () => clearTimeout(timer)
    }, [successMessage])

    // ========================================================
    // UPDATE STATUS
    // ========================================================

    const handleStatusUpdate = async () => {
        if (!order?.id) {
            return
        }

        if (!selectedStatus) {
            return
        }

        if (selectedStatus === order.status) {
            return
        }

        try {
            setUpdatingStatus(true)
            setError("")
            setSuccessMessage("")

            const result =
                await updateAdminOrderStatus(
                    order.id,
                    selectedStatus,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update order status",
                )
            }

            // ------------------------------------------------
            // Update local order immediately
            // ------------------------------------------------

            setOrder((currentOrder) => ({
                ...currentOrder,
                status:
                    result.data?.status ||
                    selectedStatus,
                updated_at:
                    result.data?.updated_at ||
                    new Date().toISOString(),
            }))

            setSelectedStatus(
                result.data?.status ||
                    selectedStatus,
            )

            setSuccessMessage(
                result.message ||
                    "Order status updated successfully.",
            )
        } catch (err) {
            console.error(
                "Update order status error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to update order status.",
            )

            // Restore current database status
            setSelectedStatus(
                order.status,
            )
        } finally {
            setUpdatingStatus(false)
        }
    }

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-100">
                <section className="border-b border-stone-200 bg-white">
                    <div className="px-5 py-6 sm:px-8">
                        <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />

                        <div className="mt-3 h-9 w-64 animate-pulse rounded bg-stone-200" />
                    </div>
                </section>

                <section className="px-5 py-8 sm:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="h-72 animate-pulse rounded-2xl bg-white lg:col-span-2" />

                        <div className="h-72 animate-pulse rounded-2xl bg-white" />
                    </div>
                </section>
            </main>
        )
    }

    // ========================================================
    // ERROR / NOT FOUND
    // ========================================================

    if (!order) {
        return (
            <main className="min-h-screen bg-stone-100">
                <section className="px-5 py-10 sm:px-8">
                    <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <Package size={28} />
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-stone-950">
                            Order not found
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-stone-500">
                            {error ||
                                "The requested order could not be found."}
                        </p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/orders",
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                                <ArrowLeft
                                    size={17}
                                />
                                Back to Orders
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    fetchOrder()
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                <RefreshCw
                                    size={17}
                                />
                                Retry
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // ========================================================
    // DATA
    // ========================================================

    const orderItems = order.order_items || []

    const customerName =
        order.shipping_name ||
        order.profiles?.full_name ||
        "Customer"

    const customerEmail =
        order.profiles?.email ||
        order.email ||
        "—"

    const customerPhone =
        order.shipping_phone ||
        order.profiles?.phone ||
        "—"

    const shippingAddress = [
        order.shipping_address,
        order.shipping_city,
        order.shipping_state,
        order.shipping_postal_code,
        order.shipping_country,
    ]
        .filter(Boolean)
        .join(", ")

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <main className="min-h-screen bg-stone-100">
            {/* ==================================================
                HEADER
            ================================================== */}

            <section className="border-b border-stone-200 bg-white">
                <div className="px-5 py-6 sm:px-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/orders",
                                    )
                                }
                                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-950"
                            >
                                <ArrowLeft
                                    size={17}
                                />
                                Back to Orders
                            </button>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Order Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Order Details
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Order{" "}
                                <span className="font-semibold text-stone-800">
                                    {order.order_number}
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
                                    order.status,
                                )}`}
                            >
                                <StatusIcon
                                    status={
                                        order.status
                                    }
                                    size={16}
                                />

                                {order.status}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    fetchOrder(false)
                                }
                                disabled={
                                    refreshing
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <section className="px-5 py-7 sm:px-8">
                {/* =================================================
                    SUCCESS
                ================================================= */}

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

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                    {/* =================================================
                        LEFT / MAIN
                    ================================================= */}

                    <div className="space-y-6 xl:col-span-2">
                        {/* =============================================
                            ORDER SUMMARY
                        ============================================= */}

                        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-bold text-stone-950">
                                        Order Summary
                                    </h2>

                                    <p className="mt-1 text-xs text-stone-400">
                                        Placed on{" "}
                                        {formatDateTime(
                                            order.created_at,
                                        )}
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-stone-600">
                                    {orderItems.length}{" "}
                                    {orderItems.length ===
                                    1
                                        ? "item"
                                        : "items"}
                                </span>
                            </div>

                            <div className="divide-y divide-stone-100">
                                {orderItems.length ===
                                0 ? (
                                    <div className="px-5 py-10 text-center text-sm text-stone-500">
                                        No order items
                                        found.
                                    </div>
                                ) : (
                                    orderItems.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                                        <Package
                                                            size={
                                                                22
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-stone-950">
                                                            {
                                                                item.product_name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-stone-400">
                                                            Product
                                                            ID:{" "}
                                                            {item.product_id ||
                                                                "—"}
                                                        </p>

                                                        <p className="mt-1 text-sm text-stone-500">
                                                            Qty:{" "}
                                                            <span className="font-semibold text-stone-700">
                                                                {
                                                                    item.quantity
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <p className="text-sm text-stone-500">
                                                        {formatCurrency(
                                                            item.unit_price,
                                                        )}{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-lg font-bold text-stone-950">
                                                        {formatCurrency(
                                                            item.subtotal,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )
                                )}
                            </div>

                            {/* ORDER TOTALS */}

                            <div className="border-t border-stone-200 bg-stone-50 px-5 py-5">
                                <div className="ml-auto max-w-sm space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-stone-500">
                                            Subtotal
                                        </span>

                                        <span className="font-semibold text-stone-800">
                                            {formatCurrency(
                                                order.subtotal,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-stone-500">
                                            Shipping
                                        </span>

                                        <span className="font-semibold text-stone-800">
                                            {Number(
                                                order.shipping_fee ||
                                                    0,
                                            ) === 0
                                                ? "FREE"
                                                : formatCurrency(
                                                      order.shipping_fee,
                                                  )}
                                        </span>
                                    </div>

                                    <div className="border-t border-stone-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-stone-950">
                                                Total
                                            </span>

                                            <span className="text-xl font-bold text-amber-600">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            CUSTOMER INFORMATION
                        ============================================= */}

                        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-5 py-5">
                                <h2 className="font-bold text-stone-950">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-xs text-stone-400">
                                    Customer details associated
                                    with this order
                                </p>
                            </div>

                            <div className="grid gap-5 p-5 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                        <User
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                            Name
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-stone-900">
                                            {
                                                customerName
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                        <CreditCard
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                            Customer ID
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-stone-900">
                                            {order.user_id ||
                                                "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                        <Phone
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                            Phone
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-stone-900">
                                            {
                                                customerPhone
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                        <User
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                            Email
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-stone-900">
                                            {
                                                customerEmail
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            SHIPPING ADDRESS
                        ============================================= */}

                        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-5 py-5">
                                <h2 className="font-bold text-stone-950">
                                    Shipping Address
                                </h2>

                                <p className="mt-1 text-xs text-stone-400">
                                    Delivery information
                                </p>
                            </div>

                            <div className="p-5">
                                <div className="flex items-start gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                                        <MapPin
                                            size={20}
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-stone-900">
                                            {
                                                order.shipping_name
                                            }
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-stone-600">
                                            {shippingAddress ||
                                                "Shipping address not available"}
                                        </p>

                                        {order.shipping_phone && (
                                            <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                                                <Phone
                                                    size={
                                                        14
                                                    }
                                                />

                                                {
                                                    order.shipping_phone
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT / SIDEBAR
                    ================================================= */}

                    <div className="space-y-6">
                        {/* =============================================
                            UPDATE STATUS
                        ============================================= */}

                        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-5 py-5">
                                <h2 className="font-bold text-stone-950">
                                    Update Order Status
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-stone-400">
                                    Change the current status
                                    of this order.
                                </p>
                            </div>

                            <div className="p-5">
                                <label
                                    htmlFor="order-status"
                                    className="text-sm font-semibold text-stone-800"
                                >
                                    Order Status
                                </label>

                                <div className="relative mt-2">
                                    <select
                                        id="order-status"
                                        value={
                                            selectedStatus
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setSelectedStatus(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        disabled={
                                            updatingStatus
                                        }
                                        className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-10 text-sm font-medium text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {ORDER_STATUSES.map(
                                            (
                                                status,
                                            ) => (
                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {
                                                        status
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div
                                    className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${getStatusClasses(
                                        selectedStatus,
                                    )}`}
                                >
                                    <StatusIcon
                                        status={
                                            selectedStatus
                                        }
                                        size={17}
                                    />

                                    {selectedStatus}
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleStatusUpdate
                                    }
                                    disabled={
                                        updatingStatus ||
                                        selectedStatus ===
                                            order.status
                                    }
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
                                >
                                    {updatingStatus ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                size={
                                                    17
                                                }
                                            />
                                            Update Status
                                        </>
                                    )}
                                </button>

                                {selectedStatus ===
                                    order.status && (
                                    <p className="mt-3 text-center text-xs text-stone-400">
                                        Select a different
                                        status to update
                                        the order.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* =============================================
                            PAYMENT INFORMATION
                        ============================================= */}

                        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-5 py-5">
                                <h2 className="font-bold text-stone-950">
                                    Payment Information
                                </h2>
                            </div>

                            <div className="space-y-4 p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-stone-500">
                                        Payment Method
                                    </span>

                                    <span className="text-right text-sm font-semibold text-stone-900">
                                        {order.payment_method ||
                                            "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-stone-500">
                                        Payment Status
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            order.payment_status ===
                                                "Paid" ||
                                            order.payment_status ===
                                                "Completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : order.payment_status ===
                                                    "Failed"
                                                  ? "bg-red-50 text-red-700"
                                                  : "bg-amber-50 text-amber-700"
                                        }`}
                                    >
                                        {order.payment_status ||
                                            "Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            ORDER INFORMATION
                        ============================================= */}

                        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-5 py-5">
                                <h2 className="font-bold text-stone-950">
                                    Order Information
                                </h2>
                            </div>

                            <div className="space-y-4 p-5">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                        Order Number
                                    </p>

                                    <p className="mt-1 break-all text-sm font-semibold text-stone-900">
                                        {
                                            order.order_number
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                        Order ID
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-stone-900">
                                        {order.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                        Created
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-stone-900">
                                        {formatDateTime(
                                            order.created_at,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                                        Last Updated
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-stone-900">
                                        {formatDateTime(
                                            order.updated_at,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =============================================
                            TOTAL CARD
                        ============================================= */}

                        <div className="overflow-hidden rounded-2xl bg-stone-950 text-white shadow-sm">
                            <div className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                                    Order Total
                                </p>

                                <p className="mt-2 text-3xl font-bold">
                                    {formatCurrency(
                                        order.total_amount,
                                    )}
                                </p>

                                <p className="mt-2 text-sm text-stone-400">
                                    {orderItems.length}{" "}
                                    {orderItems.length ===
                                    1
                                        ? "product"
                                        : "products"}{" "}
                                    in this order
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default AdminOrderDetails