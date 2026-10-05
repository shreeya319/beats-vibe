import { useEffect, useState } from "react"
import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    Eye,
    Package,
    RefreshCw,
    Search,
    ShoppingBag,
    User,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import { Link } from "react-router-dom"

import {
    getAdminOrders,
    getAdminOrderStats,
} from "../../services/orderService"


// ============================================================
// STATUS CONFIGURATION
// ============================================================

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
]


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
// FORMAT CURRENCY
// ============================================================

const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        },
    ).format(Number(amount || 0))
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
// FORMAT DATE + TIME
// ============================================================

const formatDateTime = (date) => {
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

    return parsedDate.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    )
}


// ============================================================
// ADMIN ORDERS
// ============================================================

function AdminOrders() {

    // ========================================================
    // STATE
    // ========================================================

    const [orders, setOrders] = useState([])

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        total_revenue: 0,
    })

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")

    // ========================================================
    // FETCH ORDERS
    // ========================================================

    const fetchOrders = async (
        searchValue = search,
        statusValue = status,
        showRefresh = false,
    ) => {
        try {
            if (showRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError("")

            const result =
                await getAdminOrders({
                    search: searchValue,
                    status: statusValue,
                })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch orders",
                )
            }

            setOrders(result.data || [])
        } catch (err) {
            console.error(
                "Admin orders fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load orders.",
            )

            setOrders([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }


    // ========================================================
    // FETCH STATS
    // ========================================================

    const fetchStats = async () => {
        try {
            const result =
                await getAdminOrderStats()

            if (result?.success) {
                setStats(
                    result.data || {},
                )
            }
        } catch (err) {
            console.error(
                "Admin order stats error:",
                err,
            )
        }
    }


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        fetchOrders("", "")
        fetchStats()
    }, [])


    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = (event) => {
        event.preventDefault()

        fetchOrders(
            search,
            status,
        )
    }


    // ========================================================
    // STATUS FILTER
    // ========================================================

    const handleStatusChange = (
        event,
    ) => {
        const newStatus =
            event.target.value

        setStatus(newStatus)

        fetchOrders(
            search,
            newStatus,
        )
    }


    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const handleClearFilters = () => {
        setSearch("")
        setStatus("")

        fetchOrders("", "")
    }


    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        await fetchOrders(
            search,
            status,
            true,
        )

        await fetchStats()
    }


    const hasFilters =
        search.trim() !== "" ||
        status !== ""


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <main className="min-h-screen bg-stone-100">

            {/* ==================================================
                HEADER
            ================================================== */}

            <section className="border-b border-stone-200 bg-white">
                <div className="px-5 py-7 sm:px-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Orders
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Manage customer orders,
                                payments and order
                                status.
                            </p>
                        </div>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>

                </div>
            </section>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <section className="px-5 py-7 sm:px-8">

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-stone-500">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-2xl font-bold text-stone-950">
                                    {stats.total || 0}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                                <ShoppingBag
                                    size={21}
                                />
                            </div>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-stone-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-2xl font-bold text-amber-600">
                                    {stats.pending ||
                                        0}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Package
                                    size={21}
                                />
                            </div>

                        </div>

                    </div>


                    {/* DELIVERED */}

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-stone-500">
                                    Delivered
                                </p>

                                <p className="mt-2 text-2xl font-bold text-emerald-600">
                                    {stats.delivered ||
                                        0}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Package
                                    size={21}
                                />
                            </div>

                        </div>

                    </div>


                    {/* REVENUE */}

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm text-stone-500">
                                    Revenue
                                </p>

                                <p className="mt-2 text-2xl font-bold text-stone-950">
                                    {formatCurrency(
                                        stats.total_revenue,
                                    )}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                ₹
                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    FILTERS
                ================================================== */}

                <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

                    <form
                        onSubmit={
                            handleSearch
                        }
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
                                onChange={(
                                    event,
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                placeholder="Search order number, customer name, email or phone..."
                                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                            />

                        </div>


                        {/* STATUS */}

                        <div className="relative">

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-3 pl-4 pr-10 text-sm font-medium text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 sm:w-[190px]"
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                {ORDER_STATUSES.map(
                                    (
                                        orderStatus,
                                    ) => (
                                        <option
                                            key={
                                                orderStatus
                                            }
                                            value={
                                                orderStatus
                                            }
                                        >
                                            {
                                                orderStatus
                                            }
                                        </option>
                                    ),
                                )}
                            </select>

                            <ChevronDown
                                size={17}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                            />

                        </div>


                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            Search
                        </button>


                        {/* CLEAR */}

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                            >
                                <X
                                    size={17}
                                />

                                Clear
                            </button>
                        )}

                    </form>

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
                            className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
                        >

                            <div className="flex items-start gap-3">

                                <AlertCircle
                                    size={20}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-red-800">
                                        Something went
                                        wrong
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
                                <X
                                    size={18}
                                />
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>


                {/* ==================================================
                    ORDERS TABLE
                ================================================== */}

                <div className="mt-6">

                    {loading ? (

                        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                            <div className="text-center">

                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                                <p className="mt-4 text-sm text-stone-500">
                                    Loading orders...
                                </p>

                            </div>

                        </div>

                    ) : orders.length === 0 ? (

                        /* ==========================================
                           EMPTY STATE
                        ========================================== */

                        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                            <div className="text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                    <ShoppingBag
                                        size={28}
                                    />
                                </div>

                                <h2 className="mt-5 text-lg font-bold text-stone-950">
                                    No orders found
                                </h2>

                                <p className="mt-2 text-sm text-stone-500">
                                    {hasFilters
                                        ? "Try changing your search or status filter."
                                        : "No customer orders have been placed yet."}
                                </p>

                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleClearFilters
                                        }
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                    >
                                        <X
                                            size={16}
                                        />
                                        Clear Filters
                                    </button>
                                )}

                            </div>

                        </div>

                    ) : (

                        /* ==========================================
                           TABLE
                        ========================================== */

                        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[1150px]">

                                    <thead>
                                        <tr className="border-b border-stone-200 bg-stone-50">

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Order
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Customer
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Date
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Items
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Payment
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Total
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>


                                    <tbody className="divide-y divide-stone-100">

                                        {orders.map(
                                            (
                                                order,
                                                index,
                                            ) => (

                                                <motion.tr
                                                    key={
                                                        order.id
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

                                                    {/* ORDER */}

                                                    <td className="px-5 py-4">

                                                        <div>
                                                            <p className="font-semibold text-stone-950">
                                                                {
                                                                    order.order_number
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-stone-400">
                                                                ID #
                                                                {
                                                                    order.id
                                                                }
                                                            </p>
                                                        </div>

                                                    </td>


                                                    {/* CUSTOMER */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                                                <User
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="max-w-[190px] truncate text-sm font-semibold text-stone-900">
                                                                    {order
                                                                        .profiles
                                                                        ?.full_name ||
                                                                        "Customer"}
                                                                </p>

                                                                <p className="max-w-[190px] truncate text-xs text-stone-400">
                                                                    {order
                                                                        .profiles
                                                                        ?.email ||
                                                                        "No email"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* DATE */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <CalendarDays
                                                                size={
                                                                    16
                                                                }
                                                                className="text-stone-400"
                                                            />

                                                            <div>
                                                                <p className="text-sm text-stone-700">
                                                                    {formatDate(
                                                                        order.created_at,
                                                                    )}
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-stone-400">
                                                                    {new Date(
                                                                        order.created_at,
                                                                    ).toLocaleTimeString(
                                                                        "en-IN",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ITEMS */}

                                                    <td className="px-5 py-4">

                                                        <div>
                                                            <p className="text-sm font-semibold text-stone-800">
                                                                {
                                                                    order.item_count
                                                                }{" "}
                                                                {order.item_count ===
                                                                1
                                                                    ? "item"
                                                                    : "items"}
                                                            </p>

                                                            {order.unique_item_count !==
                                                                order.item_count && (
                                                                <p className="mt-1 text-xs text-stone-400">
                                                                    {
                                                                        order.unique_item_count
                                                                    }{" "}
                                                                    products
                                                                </p>
                                                            )}
                                                        </div>

                                                    </td>


                                                    {/* PAYMENT */}

                                                    <td className="px-5 py-4">

                                                        <div>

                                                            <p className="text-sm font-medium text-stone-700">
                                                                {
                                                                    order.payment_method ||
                                                                        "—"
                                                                }
                                                            </p>

                                                            <p
                                                                className={`mt-1 text-xs font-semibold ${
                                                                    order.payment_status ===
                                                                    "Paid"
                                                                        ? "text-emerald-600"
                                                                        : order.payment_status ===
                                                                            "Failed"
                                                                          ? "text-red-600"
                                                                          : "text-amber-600"
                                                                }`}
                                                            >
                                                                {
                                                                    order.payment_status ||
                                                                        "Pending"
                                                                }
                                                            </p>

                                                        </div>

                                                    </td>


                                                    {/* TOTAL */}

                                                    <td className="px-5 py-4">

                                                        <p className="text-sm font-bold text-stone-950">
                                                            {formatCurrency(
                                                                order.total_amount,
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-stone-400">
                                                            Subtotal{" "}
                                                            {formatCurrency(
                                                                order.subtotal,
                                                            )}
                                                        </p>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                                                order.status,
                                                            )}`}
                                                        >
                                                            {
                                                                order.status
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex justify-end">

                                                            <Link
                                                                to={`/admin/orders/${order.id}`}
                                                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                                                title="View order"
                                                            >
                                                                <Eye
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                View
                                                            </Link>

                                                        </div>

                                                    </td>

                                                </motion.tr>

                                            ),
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
                                            orders.length
                                        }
                                    </span>{" "}
                                    {orders.length ===
                                    1
                                        ? "order"
                                        : "orders"}
                                </p>

                                <p className="text-xs text-stone-400">
                                    Last updated{" "}
                                    {formatDateTime(
                                        new Date(),
                                    )}
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </section>

        </main>
    )
}

export default AdminOrders