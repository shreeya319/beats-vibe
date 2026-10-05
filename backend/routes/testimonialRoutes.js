const express = require("express")

const {
    getTestimonials,
} = require("../controllers/testimonialController")

const router = express.Router()

// ============================================================
// CUSTOMER — GET ACTIVE TESTIMONIALS
// ============================================================

router.get("/", getTestimonials)

module.exports = router