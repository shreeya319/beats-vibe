import { useEffect, useState } from "react"
import {
    AlertCircle,
    Eye,
    Mail,
    Phone,
    Search,
    Users,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import { Link } from "react-router-dom"

import {
    getAdminCustomers,
} from "../../services/customerService"

function AdminCustomers() {
    // ============================================================
    // STATE
    // ============================================================

    const [customers, setCustomers] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")

    // ============================================================
    // FETCH CUSTOMERS
    // ============================================================

    const fetchCustomers = async (
        searchValue = "",
    ) => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminCustomers({
                    search: searchValue,
                })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch customers",
                )
            }

            setCustomers(result.data || [])
        } catch (err) {
            console.error(
                "Admin customers fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load customers.",
            )

            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchCustomers("")
    }, [])

    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (event) => {
        event.preventDefault()

        fetchCustomers(search.trim())
    }

    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearch("")
        fetchCustomers("")
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
    // CUSTOMER INITIALS
    // ============================================================

    const getInitials = (customer) => {
        const name =
            customer.full_name?.trim()

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
    // IMAGE ERROR
    // ============================================================

    const handleImageError = (event) => {
        event.currentTarget.style.display =
            "none"

        const fallback =
            event.currentTarget.parentElement?.querySelector(
                "[data-avatar-fallback]",
            )

        if (fallback) {
            fallback.classList.remove(
                "hidden",
            )
        }
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
                                Customers
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                Manage registered
                                customers and view
                                their account
                                information.
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-400">
                            <Users size={23} />
                        </div>

                    </div>

                </div>
            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                {/* ==================================================
                    SEARCH
                ================================================== */}

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
                                        event.target.value,
                                    )
                                }
                                placeholder="Search by name, email or phone..."
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

                                <div className="mt-0.5 text-red-600">
                                    <AlertCircle
                                        size={20}
                                    />
                                </div>

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
                                aria-label="Close error"
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
                                Loading customers...
                            </p>

                        </div>

                    </div>

                ) : customers.length === 0 ? (

                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                <Users size={28} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-stone-950">
                                No customers found
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {hasSearch
                                    ? "Try changing your search."
                                    : "No customer accounts are available yet."}
                            </p>

                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearSearch
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <X size={16} />
                                    Clear Search
                                </button>
                            )}

                        </div>

                    </div>

                ) : (

                    /* ==================================================
                       CUSTOMERS TABLE
                    ================================================== */

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px]">

                                <thead>

                                    <tr className="border-b border-stone-200 bg-stone-50">

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Contact
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Orders
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Total Spent
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Joined
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-stone-100">

                                    {customers.map(
                                        (
                                            customer,
                                            index,
                                        ) => {

                                            return (
                                                <motion.tr
                                                    key={
                                                        customer.id
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
                                                        CUSTOMER
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-4">

                                                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-sm font-bold text-amber-700">

                                                                {customer.avatar_url ? (
                                                                    <>

                                                                        <img
                                                                            src={
                                                                                customer.avatar_url
                                                                            }
                                                                            alt={
                                                                                customer.full_name ||
                                                                                "Customer"
                                                                            }
                                                                            onError={
                                                                                handleImageError
                                                                            }
                                                                            className="h-full w-full object-cover"
                                                                        />

                                                                        <div
                                                                            data-avatar-fallback
                                                                            className="absolute inset-0 hidden items-center justify-center bg-amber-50 text-sm font-bold text-amber-700"
                                                                        >
                                                                            {getInitials(
                                                                                customer,
                                                                            )}
                                                                        </div>

                                                                    </>
                                                                ) : (
                                                                    getInitials(
                                                                        customer,
                                                                    )
                                                                )}

                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="max-w-[220px] truncate font-semibold text-stone-950">
                                                                    {customer.full_name ||
                                                                        "Unnamed Customer"}
                                                                </p>

                                                                <p className="mt-1 text-xs text-stone-400">
                                                                    Customer
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* ==================================
                                                        CONTACT
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <div className="space-y-1.5">

                                                            {customer.email && (
                                                                <div className="flex max-w-[270px] items-center gap-2">

                                                                    <Mail
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="shrink-0 text-stone-400"
                                                                    />

                                                                    <span className="truncate text-sm text-stone-600">
                                                                        {
                                                                            customer.email
                                                                        }
                                                                    </span>

                                                                </div>
                                                            )}

                                                            {customer.phone && (
                                                                <div className="flex items-center gap-2">

                                                                    <Phone
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="shrink-0 text-stone-400"
                                                                    />

                                                                    <span className="text-xs text-stone-500">
                                                                        {
                                                                            customer.phone
                                                                        }
                                                                    </span>

                                                                </div>
                                                            )}

                                                            {!customer.email &&
                                                                !customer.phone && (
                                                                    <span className="text-sm text-stone-400">
                                                                        No contact
                                                                        information
                                                                    </span>
                                                                )}

                                                        </div>

                                                    </td>

                                                    {/* ==================================
                                                        ORDERS
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <Link
                                                            to={`/admin/customers/${customer.id}`}
                                                            className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-amber-50 hover:text-amber-700"
                                                            title="View customer orders"
                                                        >
                                                            View Details
                                                        </Link>

                                                    </td>

                                                    {/* ==================================
                                                        TOTAL SPENT
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <span className="text-sm font-semibold text-stone-700">
                                                            {customer.total_spent !==
                                                            undefined &&
                                                            customer.total_spent !==
                                                            null
                                                                ? formatCurrency(
                                                                      customer.total_spent,
                                                                  )
                                                                : "—"}
                                                        </span>

                                                    </td>

                                                    {/* ==================================
                                                        JOINED
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <span className="text-sm text-stone-500">
                                                            {formatDate(
                                                                customer.created_at,
                                                            )}
                                                        </span>

                                                    </td>

                                                    {/* ==================================
                                                        ACTION
                                                    ================================== */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center justify-end">

                                                            <Link
                                                                to={`/admin/customers/${customer.id}`}
                                                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-medium text-stone-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                                title="View customer"
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
                                            )
                                        },
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* ==================================================
                            TABLE FOOTER
                        ================================================== */}

                        <div className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-stone-500">

                                Showing{" "}

                                <span className="font-semibold text-stone-800">
                                    {customers.length}
                                </span>{" "}

                                {customers.length === 1
                                    ? "customer"
                                    : "customers"}

                            </p>

                            {hasSearch && (
                                <p className="text-xs text-stone-400">
                                    Search filter applied
                                </p>
                            )}

                        </div>

                    </div>
                )}

            </section>
        </main>
    )
}

export default AdminCustomers