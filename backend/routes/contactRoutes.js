const express = require("express")

const {
    createContactMessage,

    getAdminContactMessages,
    getAdminContactMessageById,
    updateContactMessageStatus,
    deleteContactMessage,
    getAdminContactMessageStats,
} = require("../controllers/contactController")

const router = express.Router()

// ============================================================
// PUBLIC — SUBMIT CONTACT MESSAGE
// POST /api/contact
// ============================================================

router.post(
    "/",
    createContactMessage,
)


// ============================================================
// ADMIN — GET ALL CONTACT MESSAGES
// GET /api/contact/admin
// ============================================================

router.get(
    "/admin",
    getAdminContactMessages,
)


// ============================================================
// ADMIN — GET MESSAGE STATISTICS
// GET /api/contact/admin/stats
// ============================================================

router.get(
    "/admin/stats",
    getAdminContactMessageStats,
)


// ============================================================
// ADMIN — GET SINGLE CONTACT MESSAGE
// GET /api/contact/admin/:id
// ============================================================

router.get(
    "/admin/:id",
    getAdminContactMessageById,
)


// ============================================================
// ADMIN — UPDATE MESSAGE STATUS
// PATCH /api/contact/admin/:id/status
// ============================================================

router.patch(
    "/admin/:id/status",
    updateContactMessageStatus,
)


// ============================================================
// ADMIN — DELETE CONTACT MESSAGE
// DELETE /api/contact/admin/:id
// ============================================================

router.delete(
    "/admin/:id",
    deleteContactMessage,
)


// ============================================================
// EXPORT
// ============================================================

module.exports = router