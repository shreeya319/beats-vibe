const supabase = require("../config/supabase")

// ============================================================
// CUSTOMER — SUBMIT CONTACT MESSAGE
// ============================================================

const createContactMessage = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
        } = req.body

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (
            !name?.trim() ||
            !email?.trim() ||
            !subject?.trim() ||
            !message?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, subject and message are required.",
            })
        }

        // --------------------------------------------------------
        // INSERT MESSAGE
        // --------------------------------------------------------

        const { data, error } = await supabase
            .from("contact_messages")
            .insert([
                {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone?.trim() || null,
                    subject: subject.trim(),
                    message: message.trim(),
                    status: "unread",
                },
            ])
            .select()
            .single()

        if (error) {
            console.error(
                "Contact message database error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to send your message.",
                error: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message:
                "Your message has been sent successfully.",
            data,
        })
    } catch (error) {
        console.error(
            "Create contact message error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — GET ALL CONTACT MESSAGES
// ============================================================

const getAdminContactMessages = async (req, res) => {
    try {
        const {
            search = "",
            status = "all",
        } = req.query

        let query = supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", {
                ascending: false,
            })

        // --------------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------------

        if (
            [
                "unread",
                "read",
                "resolved",
                "archived",
            ].includes(status)
        ) {
            query = query.eq("status", status)
        }

        // --------------------------------------------------------
        // SEARCH
        // --------------------------------------------------------

        if (search.trim()) {
            const value = search.trim()

            query = query.or(
                `name.ilike.%${value}%,email.ilike.%${value}%,subject.ilike.%${value}%,message.ilike.%${value}%`,
            )
        }

        const {
            data,
            error,
        } = await query

        if (error) {
            console.error(
                "Admin contact messages fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch contact messages",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Get admin contact messages error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch contact messages",
        })
    }
}


// ============================================================
// ADMIN — GET SINGLE CONTACT MESSAGE
// ============================================================

const getAdminContactMessageById = async (
    req,
    res,
) => {
    try {
        const messageId = req.params.id

        const {
            data,
            error,
        } = await supabase
            .from("contact_messages")
            .select("*")
            .eq("id", messageId)
            .single()

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message:
                    "Contact message not found",
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get contact message error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch contact message",
        })
    }
}


// ============================================================
// ADMIN — UPDATE MESSAGE STATUS
// ============================================================

const updateContactMessageStatus = async (
    req,
    res,
) => {
    try {
        const messageId = req.params.id
        const { status } = req.body

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        const allowedStatuses = [
            "unread",
            "read",
            "resolved",
            "archived",
        ]

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid contact message status",
            })
        }

        // --------------------------------------------------------
        // UPDATE
        // --------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("contact_messages")
            .update({
                status,
                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", messageId)
            .select()
            .single()

        if (error || !data) {
            console.error(
                "Update contact message status error:",
                error,
            )

            return res.status(404).json({
                success: false,
                message:
                    "Contact message not found or could not be updated",
                error: error?.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Contact message status updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update contact message status controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to update contact message status",
        })
    }
}


// ============================================================
// ADMIN — DELETE CONTACT MESSAGE
// ============================================================

const deleteContactMessage = async (
    req,
    res,
) => {
    try {
        const messageId = req.params.id

        const {
            data,
            error,
        } = await supabase
            .from("contact_messages")
            .delete()
            .eq("id", messageId)
            .select()
            .single()

        if (error || !data) {
            console.error(
                "Delete contact message error:",
                error,
            )

            return res.status(404).json({
                success: false,
                message:
                    "Contact message not found",
                error: error?.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Contact message deleted successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Delete contact message controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete contact message",
        })
    }
}


// ============================================================
// ADMIN — GET MESSAGE STATISTICS
// ============================================================

const getAdminContactMessageStats = async (
    req,
    res,
) => {
    try {
        const {
            data,
            error,
        } = await supabase
            .from("contact_messages")
            .select("status")

        if (error) {
            console.error(
                "Contact message stats error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch contact message statistics",
                error: error.message,
            })
        }

        const messages = data || []

        const stats = {
            total: messages.length,

            unread: messages.filter(
                (item) =>
                    item.status === "unread",
            ).length,

            read: messages.filter(
                (item) =>
                    item.status === "read",
            ).length,

            resolved: messages.filter(
                (item) =>
                    item.status === "resolved",
            ).length,

            archived: messages.filter(
                (item) =>
                    item.status === "archived",
            ).length,
        }

        return res.status(200).json({
            success: true,
            data: stats,
        })
    } catch (error) {
        console.error(
            "Contact message stats controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch contact message statistics",
        })
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createContactMessage,

    getAdminContactMessages,
    getAdminContactMessageById,
    updateContactMessageStatus,
    deleteContactMessage,
    getAdminContactMessageStats,
}