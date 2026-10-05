import { useEffect, useState } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Mail,
    MessageSquare,
    Phone,
    UserRound,
    Archive,
    AlertCircle,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion } from "motion/react"

import {
    getAdminContactMessageById,
    updateContactMessageStatus,
} from "../../services/contactService"

function AdminContactMessageDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState(false)

    // ============================================================
    // FETCH MESSAGE
    // ============================================================

    const fetchMessage = async () => {
        try {
            setLoading(true)
            setError("")

            const result =
                await getAdminContactMessageById(id)

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to fetch contact message",
                )
            }

            setMessage(result.data)
        } catch (err) {
            console.error(
                "Admin contact message details error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load contact message.",
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchMessage()
        }
    }, [id])

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {
        if (!date) return "—"

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
    // STATUS
    // ============================================================

    const getStatusConfig = (status) => {
        switch (status) {
            case "unread":
                return {
                    label: "Unread",
                    className:
                        "bg-red-50 text-red-700 border-red-200",
                    icon: AlertCircle,
                }

            case "read":
                return {
                    label: "Read",
                    className:
                        "bg-blue-50 text-blue-700 border-blue-200",
                    icon: CheckCircle2,
                }

            case "resolved":
                return {
                    label: "Resolved",
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: CheckCircle2,
                }

            case "archived":
                return {
                    label: "Archived",
                    className:
                        "bg-stone-100 text-stone-600 border-stone-200",
                    icon: Archive,
                }

            default:
                return {
                    label: status || "Unknown",
                    className:
                        "bg-stone-100 text-stone-600 border-stone-200",
                    icon: Clock3,
                }
        }
    }

    // ============================================================
    // UPDATE STATUS
    // ============================================================

    const handleStatusChange = async (newStatus) => {
        if (!message || message.status === newStatus) {
            return
        }

        try {
            setUpdating(true)
            setError("")

            const result =
                await updateContactMessageStatus(
                    message.id,
                    newStatus,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update message status",
                )
            }

            setMessage((current) => ({
                ...current,
                ...(result.data || {}),
                status:
                    result.data?.status ||
                    newStatus,
            }))
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
            setUpdating(false)
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-100 px-5 py-8 sm:px-8">

                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-stone-200 bg-white">

                    <div className="text-center">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                        <p className="mt-4 text-sm text-stone-500">
                            Loading message...
                        </p>

                    </div>

                </div>

            </main>
        )
    }

    // ============================================================
    // ERROR / NOT FOUND
    // ============================================================

    if (!message) {
        return (
            <main className="min-h-screen bg-stone-100 px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-4xl">

                    <Link
                        to="/admin/contact-messages"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-amber-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Contact Messages
                    </Link>

                    <div className="mt-6 rounded-2xl border border-red-200 bg-white p-8 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <AlertCircle size={26} />
                        </div>

                        <h1 className="mt-4 text-xl font-bold text-stone-950">
                            Message not found
                        </h1>

                        <p className="mt-2 text-sm text-stone-500">
                            {error ||
                                "The requested contact message could not be found."}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/contact-messages",
                                )
                            }
                            className="mt-6 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            Back to Messages
                        </button>

                    </div>

                </div>

            </main>
        )
    }

    const statusConfig =
        getStatusConfig(message.status)

    const StatusIcon = statusConfig.icon

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

                            <Link
                                to="/admin/contact-messages"
                                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-600"
                            >
                                <ArrowLeft size={17} />
                                Back to Contact Messages
                            </Link>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                Message Details
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                View and manage the customer
                                contact message.
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-400">
                            <MessageSquare size={23} />
                        </div>

                    </div>

                </div>

            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">

                <div className="mx-auto max-w-5xl">

                    {/* ERROR */}

                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
                        >
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
                        </motion.div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

                        {/* ==================================================
                            MESSAGE
                        ================================================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                        >

                            {/* SUBJECT */}

                            <div className="border-b border-stone-200 px-6 py-6">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                                            Subject
                                        </p>

                                        <h2 className="mt-2 text-xl font-bold text-stone-950">
                                            {message.subject}
                                        </h2>

                                    </div>

                                    <div
                                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
                                    >
                                        <StatusIcon size={14} />
                                        {statusConfig.label}
                                    </div>

                                </div>

                            </div>

                            {/* MESSAGE BODY */}

                            <div className="px-6 py-7">

                                <p className="whitespace-pre-wrap text-[15px] leading-7 text-stone-700">
                                    {message.message}
                                </p>

                            </div>

                            {/* DATE */}

                            <div className="border-t border-stone-100 bg-stone-50 px-6 py-4">

                                <p className="text-xs text-stone-400">
                                    Received{" "}
                                    <span className="font-medium text-stone-600">
                                        {formatDate(
                                            message.created_at,
                                        )}
                                    </span>
                                </p>

                            </div>

                        </motion.div>

                        {/* ==================================================
                            CUSTOMER INFORMATION
                        ================================================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.08,
                            }}
                            className="h-fit overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                        >

                            <div className="border-b border-stone-200 px-5 py-5">

                                <h3 className="font-bold text-stone-950">
                                    Customer Information
                                </h3>

                            </div>

                            <div className="space-y-5 px-5 py-5">

                                {/* NAME */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <UserRound size={17} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs text-stone-400">
                                            Name
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-stone-800">
                                            {message.name}
                                        </p>

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                        <Mail size={17} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs text-stone-400">
                                            Email
                                        </p>

                                        <a
                                            href={`mailto:${message.email}`}
                                            className="mt-1 block break-all text-sm font-medium text-stone-700 transition hover:text-amber-600"
                                        >
                                            {message.email}
                                        </a>

                                    </div>

                                </div>

                                {/* PHONE */}

                                {message.phone && (
                                    <div className="flex items-start gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                            <Phone size={17} />
                                        </div>

                                        <div>

                                            <p className="text-xs text-stone-400">
                                                Phone
                                            </p>

                                            <a
                                                href={`tel:${message.phone}`}
                                                className="mt-1 block text-sm font-medium text-stone-700 transition hover:text-amber-600"
                                            >
                                                {
                                                    message.phone
                                                }
                                            </a>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </motion.div>

                    </div>

                    {/* ==================================================
                        STATUS MANAGEMENT
                    ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                        className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                    >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <h3 className="font-bold text-stone-950">
                                    Message Status
                                </h3>

                                <p className="mt-1 text-sm text-stone-500">
                                    Update the current status of
                                    this contact message.
                                </p>

                            </div>

                            <div className="flex flex-wrap gap-2">

                                {[
                                    "unread",
                                    "read",
                                    "resolved",
                                    "archived",
                                ].map((status) => {

                                    const config =
                                        getStatusConfig(
                                            status,
                                        )

                                    const Icon =
                                        config.icon

                                    const active =
                                        message.status ===
                                        status

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            disabled={
                                                updating ||
                                                active
                                            }
                                            onClick={() =>
                                                handleStatusChange(
                                                    status,
                                                )
                                            }
                                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold capitalize transition ${
                                                active
                                                    ? config.className
                                                    : "border-stone-200 bg-white text-stone-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                            } ${
                                                updating
                                                    ? "cursor-not-allowed opacity-60"
                                                    : ""
                                            }`}
                                        >
                                            <Icon size={15} />
                                            {status}
                                        </button>
                                    )
                                })}

                            </div>

                        </div>

                    </motion.div>

                    {/* ==================================================
                        FOOTER INFO
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-2 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">

                        <span>
                            Message ID:{" "}
                            <span className="font-medium text-stone-500">
                                #{message.id}
                            </span>
                        </span>

                        {message.updated_at && (
                            <span>
                                Last updated:{" "}
                                <span className="font-medium text-stone-500">
                                    {formatDate(
                                        message.updated_at,
                                    )}
                                </span>
                            </span>
                        )}

                    </div>

                </div>

            </section>

        </main>
    )
}

export default AdminContactMessageDetails