import { useEffect, useState } from "react"
import {
    AlertCircle,
    Archive,
    CheckCircle2,
    Eye,
    Mail,
    MessageSquare,
    Phone,
    RefreshCw,
    Search,
    Trash2,
    UserRound,
    X,
} from "lucide-react"
import {
    AnimatePresence,
    motion,
} from "motion/react"
import { Link } from "react-router-dom"

import {
    getAdminContactMessages,
    getAdminContactMessageStats,
    updateContactMessageStatus,
    deleteContactMessage,
} from "../../services/contactService"


function AdminContactMessages() {

    // ============================================================
    // STATE
    // ============================================================

    const [messages, setMessages] = useState([])

    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        read: 0,
        resolved: 0,
        archived: 0,
    })

    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] =
        useState(true)

    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")

    const [deletingId, setDeletingId] =
        useState(null)

    const [updatingId, setUpdatingId] =
        useState(null)

    const [deleteModal, setDeleteModal] =
        useState({
            open: false,
            id: null,
            name: "",
        })


    // ============================================================
    // FETCH MESSAGES
    // ============================================================

    const fetchMessages = async (
        searchValue = search,
        statusValue = status,
    ) => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminContactMessages({
                    search: searchValue.trim(),
                    status: statusValue,
                })

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch contact messages",
                )
            }

            setMessages(result.data || [])
        } catch (err) {
            console.error(
                "Admin contact messages fetch error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load contact messages.",
            )

            setMessages([])
        } finally {
            setLoading(false)
        }
    }


    // ============================================================
    // FETCH STATS
    // ============================================================

    const fetchStats = async () => {
        try {
            setStatsLoading(true)

            const result =
                await getAdminContactMessageStats()

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch message statistics",
                )
            }

            setStats(
                result.data || {
                    total: 0,
                    unread: 0,
                    read: 0,
                    resolved: 0,
                    archived: 0,
                },
            )
        } catch (err) {
            console.error(
                "Admin contact message stats error:",
                err,
            )
        } finally {
            setStatsLoading(false)
        }
    }


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        fetchMessages("", "all")
        fetchStats()
    }, [])


    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (event) => {
        event.preventDefault()

        fetchMessages(
            search.trim(),
            status,
        )
    }


    // ============================================================
    // STATUS FILTER
    // ============================================================

    const handleStatusChange = (event) => {
        const newStatus =
            event.target.value

        setStatus(newStatus)

        fetchMessages(
            search.trim(),
            newStatus,
        )
    }


    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {
        setSearch("")

        fetchMessages(
            "",
            status,
        )
    }


    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = async () => {
        await Promise.all([
            fetchMessages(
                search.trim(),
                status,
            ),
            fetchStats(),
        ])
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    const handleStatusUpdate = async (
        id,
        newStatus,
    ) => {
        try {
            setUpdatingId(id)
            setError("")

            const result =
                await updateContactMessageStatus(
                    id,
                    newStatus,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update message status",
                )
            }

            setMessages((previous) =>
                previous.map((message) =>
                    String(message.id) ===
                    String(id)
                        ? {
                              ...message,
                              status: newStatus,
                              updated_at:
                                  new Date().toISOString(),
                          }
                        : message,
                ),
            )

            await fetchStats()
        } catch (err) {
            console.error(
                "Update contact message status error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to update message status.",
            )
        } finally {
            setUpdatingId(null)
        }
    }


    // ============================================================
    // DELETE MODAL
    // ============================================================

    const openDeleteModal = (
        message,
    ) => {
        setDeleteModal({
            open: true,
            id: message.id,
            name: message.name,
        })
    }


    const closeDeleteModal = () => {
        if (deletingId) {
            return
        }

        setDeleteModal({
            open: false,
            id: null,
            name: "",
        })
    }


    // ============================================================
    // DELETE MESSAGE
    // ============================================================

    const handleDelete = async () => {
        if (!deleteModal.id) {
            return
        }

        try {
            setDeletingId(deleteModal.id)
            setError("")

            const result =
                await deleteContactMessage(
                    deleteModal.id,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to delete contact message",
                )
            }

            setMessages((previous) =>
                previous.filter(
                    (message) =>
                        String(message.id) !==
                        String(deleteModal.id),
                ),
            )

            setDeleteModal({
                open: false,
                id: null,
                name: "",
            })

            await fetchStats()
        } catch (err) {
            console.error(
                "Delete contact message error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete contact message.",
            )
        } finally {
            setDeletingId(null)
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
    // FORMAT TIME
    // ============================================================

    const formatTime = (date) => {
        if (!date) {
            return ""
        }

        const parsedDate = new Date(date)

        if (
            Number.isNaN(
                parsedDate.getTime(),
            )
        ) {
            return ""
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            },
        )
    }


    // ============================================================
    // STATUS STYLE
    // ============================================================

    const getStatusStyle = (value) => {
        switch (value) {

            case "unread":
                return "bg-red-50 text-red-700 border-red-200"

            case "read":
                return "bg-blue-50 text-blue-700 border-blue-200"

            case "resolved":
                return "bg-green-50 text-green-700 border-green-200"

            case "archived":
                return "bg-stone-100 text-stone-600 border-stone-200"

            default:
                return "bg-stone-100 text-stone-600 border-stone-200"
        }
    }


    // ============================================================
    // STATUS LABEL
    // ============================================================

    const getStatusLabel = (value) => {
        switch (value) {

            case "unread":
                return "Unread"

            case "read":
                return "Read"

            case "resolved":
                return "Resolved"

            case "archived":
                return "Archived"

            default:
                return value
        }
    }


    // ============================================================
    // STATUS ICON
    // ============================================================

    const getStatusIcon = (value) => {
        switch (value) {

            case "unread":
                return (
                    <Mail size={13} />
                )

            case "read":
                return (
                    <Eye size={13} />
                )

            case "resolved":
                return (
                    <CheckCircle2
                        size={13}
                    />
                )

            case "archived":
                return (
                    <Archive size={13} />
                )

            default:
                return null
        }
    }


    // ============================================================
    // MESSAGE PREVIEW
    // ============================================================

    const getMessagePreview = (
        message,
    ) => {
        if (!message) {
            return "—"
        }

        const text =
            message.trim()

        if (text.length <= 80) {
            return text
        }

        return `${text.substring(
            0,
            80,
        )}...`
    }


    // ============================================================
    // SEARCH STATE
    // ============================================================

    const hasSearch =
        search.trim() !== ""


    // ============================================================
    // STAT CARD
    // ============================================================

    const StatCard = ({
        title,
        value,
        icon,
        description,
        active,
    }) => {
        return (
            <div
                className={`rounded-2xl border p-5 shadow-sm transition ${
                    active
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-stone-200 bg-white"
                }`}
            >

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                            {title}
                        </p>

                        {statsLoading ? (
                            <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-stone-200" />
                        ) : (
                            <p className="mt-2 text-2xl font-bold text-stone-950">
                                {value}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-stone-400">
                            {description}
                        </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-950 text-amber-400">
                        {icon}
                    </div>

                </div>

            </div>
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

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Contact Messages
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-stone-500">
                                Manage customer inquiries,
                                contact requests and
                                incoming messages.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>

                    </div>

                </div>

            </section>


            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    <StatCard
                        title="Total"
                        value={stats.total}
                        description="All messages"
                        icon={
                            <MessageSquare
                                size={20}
                            />
                        }
                    />

                    <StatCard
                        title="Unread"
                        value={stats.unread}
                        description="Needs attention"
                        active={
                            stats.unread > 0
                        }
                        icon={
                            <Mail size={20} />
                        }
                    />

                    <StatCard
                        title="Read"
                        value={stats.read}
                        description="Viewed messages"
                        icon={
                            <Eye size={20} />
                        }
                    />

                    <StatCard
                        title="Resolved"
                        value={stats.resolved}
                        description="Completed inquiries"
                        icon={
                            <CheckCircle2
                                size={20}
                            />
                        }
                    />

                    <StatCard
                        title="Archived"
                        value={stats.archived}
                        description="Archived messages"
                        icon={
                            <Archive
                                size={20}
                            />
                        }
                    />

                </div>


                {/* ==================================================
                    SEARCH + FILTER
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-3 lg:flex-row">

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
                                    placeholder="Search by name, email, subject or message..."
                                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                />

                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                                Search
                            </button>

                        </form>


                        <div className="flex flex-col gap-3 sm:flex-row">

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="unread">
                                    Unread
                                </option>

                                <option value="read">
                                    Read
                                </option>

                                <option value="resolved">
                                    Resolved
                                </option>

                                <option value="archived">
                                    Archived
                                </option>
                            </select>


                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearSearch
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                                >
                                    <X
                                        size={
                                            17
                                        }
                                    />

                                    Clear
                                </button>
                            )}

                        </div>

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

                    <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading contact messages...
                            </p>

                        </div>

                    </div>

                ) : messages.length === 0 ? (

                    /* ==================================================
                       EMPTY
                    ================================================== */

                    <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                                <MessageSquare
                                    size={28}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-stone-950">
                                No contact messages found
                            </h2>

                            <p className="mt-2 text-sm text-stone-500">
                                {hasSearch ||
                                status !==
                                    "all"
                                    ? "Try changing your search or status filter."
                                    : "No customer messages have been received yet."}
                            </p>

                            {(hasSearch ||
                                status !==
                                    "all") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch(
                                            "",
                                        )
                                        setStatus(
                                            "all",
                                        )
                                        fetchMessages(
                                            "",
                                            "all",
                                        )
                                    }}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                                >
                                    <X size={16} />
                                    Clear Filters
                                </button>
                            )}

                        </div>

                    </div>

                ) : (

                    /* ==================================================
                       TABLE
                    ================================================== */

                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1150px]">

                                <thead>

                                    <tr className="border-b border-stone-200 bg-stone-50">

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Subject
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Message
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Received
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-stone-100">

                                    {messages.map(
                                        (
                                            message,
                                            index,
                                        ) => (
                                            <motion.tr
                                                key={
                                                    message.id
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
                                                className={`transition hover:bg-stone-50 ${
                                                    message.status ===
                                                    "unread"
                                                        ? "bg-amber-50/20"
                                                        : ""
                                                }`}
                                            >

                                                {/* ==================================
                                                    CUSTOMER
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                                            <UserRound
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="max-w-[190px] truncate font-semibold text-stone-950">
                                                                {
                                                                    message.name
                                                                }
                                                            </p>

                                                            <div className="mt-1 flex max-w-[230px] items-center gap-1.5">

                                                                <Mail
                                                                    size={
                                                                        12
                                                                    }
                                                                    className="shrink-0 text-stone-400"
                                                                />

                                                                <span className="truncate text-xs text-stone-500">
                                                                    {
                                                                        message.email
                                                                    }
                                                                </span>

                                                            </div>

                                                            {message.phone && (
                                                                <div className="mt-1 flex items-center gap-1.5">

                                                                    <Phone
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-stone-400"
                                                                    />

                                                                    <span className="text-xs text-stone-400">
                                                                        {
                                                                            message.phone
                                                                        }
                                                                    </span>

                                                                </div>
                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* ==================================
                                                    SUBJECT
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="max-w-[220px] truncate text-sm font-semibold text-stone-800">
                                                        {
                                                            message.subject
                                                        }
                                                    </p>

                                                </td>


                                                {/* ==================================
                                                    MESSAGE
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="max-w-[330px] text-sm leading-6 text-stone-500">
                                                        {getMessagePreview(
                                                            message.message,
                                                        )}
                                                    </p>

                                                </td>


                                                {/* ==================================
                                                    STATUS
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                                                message.status,
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                message.status,
                                                            )}

                                                            {getStatusLabel(
                                                                message.status,
                                                            )}
                                                        </span>

                                                        <select
                                                            value={
                                                                message.status
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                message.id
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleStatusUpdate(
                                                                    message.id,
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-600 outline-none focus:border-amber-500 disabled:opacity-50"
                                                            aria-label="Change message status"
                                                        >

                                                            <option value="unread">
                                                                Unread
                                                            </option>

                                                            <option value="read">
                                                                Read
                                                            </option>

                                                            <option value="resolved">
                                                                Resolved
                                                            </option>

                                                            <option value="archived">
                                                                Archived
                                                            </option>

                                                        </select>

                                                    </div>

                                                </td>


                                                {/* ==================================
                                                    RECEIVED
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <p className="text-sm text-stone-600">
                                                        {formatDate(
                                                            message.created_at,
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-stone-400">
                                                        {formatTime(
                                                            message.created_at,
                                                        )}
                                                    </p>

                                                </td>


                                                {/* ==================================
                                                    ACTIONS
                                                ================================== */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <Link
                                                            to={`/admin/contact-messages/${message.id}`}
                                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-medium text-stone-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                                            title="View message"
                                                        >
                                                            <Eye
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            View
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    message,
                                                                )
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                                                            title="Delete message"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
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


                        {/* ==================================================
                            TABLE FOOTER
                        ================================================== */}

                        <div className="flex flex-col gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-sm text-stone-500">

                                Showing{" "}

                                <span className="font-semibold text-stone-800">
                                    {messages.length}
                                </span>{" "}

                                {messages.length ===
                                1
                                    ? "message"
                                    : "messages"}

                            </p>

                            {(hasSearch ||
                                status !==
                                    "all") && (
                                <p className="text-xs text-stone-400">
                                    Filter applied
                                </p>
                            )}

                        </div>

                    </div>
                )}

            </section>


            {/* ======================================================
                DELETE CONFIRMATION MODAL
            ====================================================== */}

            <AnimatePresence>

                {deleteModal.open && (
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-5 backdrop-blur-sm"
                        onMouseDown={
                            closeDeleteModal
                        }
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
                            onMouseDown={(
                                event,
                            ) =>
                                event.stopPropagation()
                            }
                            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
                        >

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Trash2
                                        size={21}
                                    />
                                </div>

                                <div className="min-w-0">

                                    <h2 className="text-lg font-bold text-stone-950">
                                        Delete Message
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-stone-500">
                                        Are you sure you
                                        want to delete
                                        the message from{" "}
                                        <span className="font-semibold text-stone-800">
                                            {
                                                deleteModal.name
                                            }
                                        </span>
                                        ? This action
                                        cannot be undone.
                                    </p>

                                </div>

                            </div>


                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={
                                        Boolean(
                                            deletingId,
                                        )
                                    }
                                    className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        Boolean(
                                            deletingId,
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {deletingId ? (
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

export default AdminContactMessages