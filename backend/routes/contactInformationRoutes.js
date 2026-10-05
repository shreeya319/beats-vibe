const express = require("express")

const {
    getContactInformation,
    updateContactInformation,
} = require("../controllers/contactInformationController")

const router = express.Router()

// ============================================================
// GET CONTACT INFORMATION
// GET /api/contact-information
// ============================================================

router.get(
    "/",
    getContactInformation,
)

// ============================================================
// UPDATE CONTACT INFORMATION
// PUT /api/contact-information/:id
// ============================================================

router.put(
    "/:id",
    updateContactInformation,
)

module.exports = router