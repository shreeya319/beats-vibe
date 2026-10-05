const express = require("express")

const {
    getAdminTestimonials,
    getAdminTestimonialById,
    createTestimonial,
    updateTestimonial,
    toggleTestimonialStatus,
    deleteTestimonial,
} = require("../controllers/testimonialController")

const router = express.Router()


// ============================================================
// ADMIN — GET ALL TESTIMONIALS
// GET /api/admin/testimonials
// ============================================================

router.get(
    "/",
    getAdminTestimonials,
)


// ============================================================
// ADMIN — GET SINGLE TESTIMONIAL
// GET /api/admin/testimonials/:id
// ============================================================

router.get(
    "/:id",
    getAdminTestimonialById,
)


// ============================================================
// ADMIN — CREATE TESTIMONIAL
// POST /api/admin/testimonials
// ============================================================

router.post(
    "/",
    createTestimonial,
)


// ============================================================
// ADMIN — UPDATE TESTIMONIAL
// PUT /api/admin/testimonials/:id
// ============================================================

router.put(
    "/:id",
    updateTestimonial,
)


// ============================================================
// ADMIN — TOGGLE ACTIVE / INACTIVE
// PATCH /api/admin/testimonials/:id/status
// ============================================================

router.patch(
    "/:id/status",
    toggleTestimonialStatus,
)


// ============================================================
// ADMIN — DELETE TESTIMONIAL
// DELETE /api/admin/testimonials/:id
// ============================================================

router.delete(
    "/:id",
    deleteTestimonial,
)


module.exports = router