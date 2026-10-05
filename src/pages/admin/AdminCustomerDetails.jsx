import { useEffect, useState } from "react"
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingBag,
    UserRound,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import {
    Link,
    useParams,
} from "react-router-dom"

import {
    getAdminCustomerById,
} from "../../services/customerService"

function AdminCustomerDetails() {
    // ============================================================
    // PARAMS
    // ============================================================

    const { id } = useParams()

    // ============================================================
    // STATE
    // ============================================================

    const [customer, setCustomer] =
        useState(null)

    const [orders, setOrders] =
        useState([])

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
    })

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState("")

    // ============================================================
    // FETCH CUSTOMER
    // ============================================================

    const fetchCustomer = async () => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminCustomerById(id)

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch customer",
                )
            }

            setCustomer(
                result.data?.customer || null,
            )

            setOrders(
                result.data?.orders || [],
            )

            setStats(
                result.data?.stats || {
                    totalOrders: 0,
                    totalSpent: 0,
                },
            )
        } catch (err) {
            console.error(
                "Admin customer details error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load customer details.",
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        if (id) {
            fetchCustomer()
        }
    }, [id])

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
    // INITIALS
    // ============================================================

    const getInitials = () => {
        const name =
            customer?.full_name?.trim()

        if (!name) {
            return "CU"
        }

        const words = name.split(/\s+/)

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase()
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase()
    }

    // ============================================================
    // ORDER STATUS STYLE
    // ============================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-50 text-emerald-700"

            case "Shipped":
                return "bg-blue-50 text-blue-700"

            case "Processing":
                return "bg-amber-50 text-amber-700"

            case "Confirmed":
                return "bg-indigo-50 text-indigo-700"

            case "Cancelled":
                return "bg-red-50 text-red-700"

            default:
                return "bg-stone-100 text-stone-600"
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-100">
                <div className="flex min-h-[500px] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                        <p className="mt-4 text-sm text-stone-500">
                            Loading customer details...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    // ============================================================
    // ERROR / NOT FOUND
    // ============================================================

    if (error || !customer) {
        return (
            <main className="min-h-screen bg-stone-100 px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-5xl">

                    <Link
                        to="/admin/customers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-amber-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Customers
                    </Link>

                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <X size={25} />
                        </div>

                        <h1 className="mt-4 text-xl font-bold text-stone-950">
                            Customer not found
                        </h1>

                        <p className="mt-2 text-sm text-red-700">
                            {error ||
                                "The requested customer could not be found."}
                        </p>

                        <Link
                            to="/admin/customers"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            <ArrowLeft size={16} />
                            Back to Customers
                        </Link>

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
                <div className="px-5 py-6 sm:px-8">

                    <Link
                        to="/admin/customers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Customers
                    </Link>

                    <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-amber-50 text-xl font-bold text-amber-700">

                                {customer.avatar_url ? (
                                    <img
                                        src={
                                            customer.avatar_url
                                        }
                                        alt={
                                            customer.full_name ||
                                            "Customer"
                                        }
                                        className="h-full w-full object-cover"
                                        onError={(
                                            event,
                                        ) => {
                                            event.currentTarget.style.display =
                                                "none"
                                        }}
                                    />
                                ) : (
                                    getInitials()
                                )}

                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                                    Customer Details
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-950">
                                    {customer.full_name ||
                                        "Unnamed Customer"}
                                </h1>

                                <p className="mt-1 text-sm text-stone-500">
                                    Customer account
                                </p>
                            </div>

                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                            <CheckCircle
                                size={15}
                            />
                            Active Customer
                        </span>

                    </div>

                </div>
            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                <div className="mx-auto max-w-7xl">

                    {/* ==================================================
                        STATISTICS
                    ================================================== */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* TOTAL ORDERS */}

                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Total Orders
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-stone-950">
                                        {
                                            stats.totalOrders
                                        }
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <ShoppingBag
                                        size={21}
                                    />
                                </div>

                            </div>

                        </div>

                        {/* TOTAL SPENT */}

                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Total Spent
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-stone-950">
                                        {formatCurrency(
                                            stats.totalSpent,
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <CreditCard
                                        size={21}
                                    />
                                </div>

                            </div>

                        </div>

                        {/* JOINED */}

                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Customer Since
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-stone-950">
                                        {formatDate(
                                            customer.created_at,
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                                    <CalendarDays
                                        size={21}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        CUSTOMER INFORMATION
                    ================================================== */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-5">

                        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white shadow-sm">

                            <div className="border-b border-stone-200 px-5 py-4">
                                <h2 className="font-bold text-stone-950">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-xs text-stone-400">
                                    Account information
                                </p>
                            </div>

                            <div className="divide-y divide-stone-100">

                                {/* NAME */}

                                <div className="flex items-start gap-3 px-5 py-4">

                                    <UserRound
                                        size={18}
                                        className="mt-0.5 shrink-0 text-stone-400"
                                    />

                                    <div>
                                        <p className="text-xs font-medium text-stone-400">
                                            Full Name
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-stone-900">
                                            {customer.full_name ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="flex items-start gap-3 px-5 py-4">

                                    <Mail
                                        size={18}
                                        className="mt-0.5 shrink-0 text-stone-400"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-stone-400">
                                            Email
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-stone-900">
                                            {customer.email ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                </div>

                                {/* PHONE */}

                                <div className="flex items-start gap-3 px-5 py-4">

                                    <Phone
                                        size={18}
                                        className="mt-0.5 shrink-0 text-stone-400"
                                    />

                                    <div>
                                        <p className="text-xs font-medium text-stone-400">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-stone-900">
                                            {customer.phone ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                </div>

                                {/* ROLE */}

                                <div className="flex items-start gap-3 px-5 py-4">

                                    <UserRound
                                        size={18}
                                        className="mt-0.5 shrink-0 text-stone-400"
                                    />

                                    <div>
                                        <p className="text-xs font-medium text-stone-400">
                                            Account Role
                                        </p>

                                        <span className="mt-1 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold capitalize text-stone-600">
                                            {
                                                customer.role
                                            }
                                        </span>
                                    </div>

                                </div>

                                {/* CREATED */}

                                <div className="flex items-start gap-3 px-5 py-4">

                                    <CalendarDays
                                        size={18}
                                        className="mt-0.5 shrink-0 text-stone-400"
                                    />

                                    <div>
                                        <p className="text-xs font-medium text-stone-400">
                                            Registered
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-stone-900">
                                            {formatDateTime(
                                                customer.created_at,
                                            )}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            ORDER SUMMARY
                        ================================================== */}

                        <div className="lg:col-span-3 rounded-2xl border border-stone-200 bg-white shadow-sm">

                            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">

                                <div>
                                    <h2 className="font-bold text-stone-950">
                                        Order History
                                    </h2>

                                    <p className="mt-1 text-xs text-stone-400">
                                        Orders placed by this
                                        customer
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                                    <Package
                                        size={19}
                                    />
                                </div>

                            </div>

                            {orders.length === 0 ? (
                                <div className="flex min-h-[260px] items-center justify-center px-5">

                                    <div className="text-center">

                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                            <ShoppingBag
                                                size={25}
                                            />
                                        </div>

                                        <h3 className="mt-4 font-semibold text-stone-900">
                                            No orders yet
                                        </h3>

                                        <p className="mt-1 text-sm text-stone-500">
                                            This customer has
                                            not placed any
                                            orders.
                                        </p>

                                    </div>

                                </div>
                            ) : (
                                <div className="divide-y divide-stone-100">

                                    {orders.map(
                                        (
                                            order,
                                        ) => (
                                            <div
                                                key={
                                                    order.id
                                                }
                                                className="px-5 py-4 transition hover:bg-stone-50"
                                            >

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                    <div className="min-w-0">

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <span className="font-semibold text-stone-950">
                                                                {
                                                                    order.order_number
                                                                }
                                                            </span>

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                                                    order.status,
                                                                )}`}
                                                            >
                                                                {
                                                                    order.status
                                                                }
                                                            </span>

                                                        </div>

                                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">

                                                            <span className="inline-flex items-center gap-1">
                                                                <CalendarDays
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                {formatDate(
                                                                    order.created_at,
                                                                )}
                                                            </span>

                                                            <span className="inline-flex items-center gap-1">
                                                                <CreditCard
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                {
                                                                    order.payment_method ||
                                                                    "Payment not specified"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 sm:justify-end">

                                                        <div className="text-left sm:text-right">

                                                            <p className="text-xs text-stone-400">
                                                                Total
                                                            </p>

                                                            <p className="mt-0.5 font-bold text-stone-950">
                                                                {formatCurrency(
                                                                    order.total_amount,
                                                                )}
                                                            </p>

                                                        </div>

                                                        <Link
                                                            to={`/admin/orders/${order.id}`}
                                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                        >
                                                            View
                                                        </Link>

                                                    </div>

                                                </div>

                                            </div>
                                        ),
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </section>
        </main>
    )
}

export default AdminCustomerDetails