const express = require("express")

const {
    getSettings,
    getAdminSettings,
    updateSettings,
} = require("../controllers/settingsController")

const router = express.Router()

// ============================================================
// CUSTOMER SETTINGS
// GET /api/settings
// ============================================================

router.get(
    "/",
    getSettings,
)

// ============================================================
// ADMIN SETTINGS
// GET /api/settings/admin
// ============================================================

router.get(
    "/admin",
    getAdminSettings,
)

// ============================================================
// UPDATE SETTINGS
// PUT /api/settings/:id
//
// Updates:
// store_settings
// +
// contact_information
// ============================================================

router.put(
    "/:id",
    updateSettings,
)

module.exports = router