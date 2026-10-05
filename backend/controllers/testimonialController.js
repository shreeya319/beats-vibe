const supabase = require("../config/supabase")

// ============================================================
// CUSTOMER — GET ACTIVE TESTIMONIALS
// ============================================================

const getTestimonials = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select(`
                id,
                customer_name,
                customer_role,
                review,
                rating,
                display_order
            `)
            .eq("is_active", true)
            .order("display_order", {
                ascending: true,
            })
            .order("created_at", {
                ascending: false,
            })

        if (error) {
            console.error(
                "Testimonials fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch testimonials",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Testimonials controller error:",
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
// ADMIN — GET ALL TESTIMONIALS
// ============================================================

const getAdminTestimonials = async (req, res) => {
    try {
        const {
            search = "",
            status = "all",
        } = req.query

        let query = supabase
            .from("testimonials")
            .select("*")
            .order("display_order", {
                ascending: true,
            })
            .order("created_at", {
                ascending: false,
            })

        // --------------------------------------------------------
        // STATUS FILTER
        // --------------------------------------------------------

        if (status === "active") {
            query = query.eq(
                "is_active",
                true,
            )
        }

        if (status === "inactive") {
            query = query.eq(
                "is_active",
                false,
            )
        }

        // --------------------------------------------------------
        // SEARCH
        // --------------------------------------------------------

        const searchValue =
            String(search || "").trim()

        if (searchValue) {
            query = query.or(
                `customer_name.ilike.%${searchValue}%,customer_role.ilike.%${searchValue}%,review.ilike.%${searchValue}%`,
            )
        }

        const {
            data,
            error,
        } = await query

        if (error) {
            console.error(
                "Admin testimonials fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch testimonials",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Admin testimonials controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch testimonials",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — GET SINGLE TESTIMONIAL
// ============================================================

const getAdminTestimonialById = async (
    req,
    res,
) => {
    try {
        const testimonialId =
            req.params.id

        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message:
                    "Testimonial ID is required",
            })
        }

        const {
            data,
            error,
        } = await supabase
            .from("testimonials")
            .select("*")
            .eq("id", testimonialId)
            .single()

        if (error || !data) {
            console.error(
                "Get testimonial error:",
                error,
            )

            return res.status(404).json({
                success: false,
                message:
                    "Testimonial not found",
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get testimonial controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch testimonial",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — CREATE TESTIMONIAL
// ============================================================

const createTestimonial = async (
    req,
    res,
) => {
    try {
        const {
            customer_name,
            customer_role,
            review,
            rating = 5,
            display_order = 0,
            is_active = true,
        } = req.body

        // --------------------------------------------------------
        // VALIDATE CUSTOMER NAME
        // --------------------------------------------------------

        const customerName =
            String(
                customer_name || "",
            ).trim()

        if (!customerName) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer name is required",
            })
        }

        // --------------------------------------------------------
        // VALIDATE REVIEW
        // --------------------------------------------------------

        const reviewText =
            String(
                review || "",
            ).trim()

        if (!reviewText) {
            return res.status(400).json({
                success: false,
                message:
                    "Review is required",
            })
        }

        // --------------------------------------------------------
        // VALIDATE RATING
        // --------------------------------------------------------

        const numericRating =
            Number(rating)

        if (
            !Number.isInteger(
                numericRating,
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be a whole number between 1 and 5",
            })
        }

        // --------------------------------------------------------
        // VALIDATE DISPLAY ORDER
        // --------------------------------------------------------

        const numericDisplayOrder =
            Number(display_order)

        if (
            !Number.isInteger(
                numericDisplayOrder,
            ) ||
            numericDisplayOrder < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Display order must be a non-negative whole number",
            })
        }

        // --------------------------------------------------------
        // CUSTOMER ROLE
        // --------------------------------------------------------

        const customerRole =
            String(
                customer_role || "",
            ).trim()

        // --------------------------------------------------------
        // ACTIVE STATUS
        // --------------------------------------------------------

        const activeStatus =
            is_active === false ||
                is_active === "false"
                ? false
                : true

        // --------------------------------------------------------
        // INSERT
        // --------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("testimonials")
            .insert([
                {
                    customer_name:
                        customerName,

                    customer_role:
                        customerRole ||
                        null,

                    review:
                        reviewText,

                    rating:
                        numericRating,

                    display_order:
                        numericDisplayOrder,

                    is_active:
                        activeStatus,
                },
            ])
            .select()
            .single()

        if (error) {
            console.error(
                "Create testimonial Supabase error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create testimonial",
                error: error.message,
                details:
                    error.details || null,
                hint:
                    error.hint || null,
                code:
                    error.code || null,
            })
        }

        return res.status(201).json({
            success: true,
            message:
                "Testimonial created successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Create testimonial controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to create testimonial",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — UPDATE TESTIMONIAL
// ============================================================

const updateTestimonial = async (
    req,
    res,
) => {
    try {
        const testimonialId =
            req.params.id

        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message:
                    "Testimonial ID is required",
            })
        }

        const {
            customer_name,
            customer_role,
            review,
            rating,
            display_order,
            is_active,
        } = req.body

        // --------------------------------------------------------
        // VALIDATE CUSTOMER NAME
        // --------------------------------------------------------

        const customerName =
            String(
                customer_name || "",
            ).trim()

        if (!customerName) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer name is required",
            })
        }

        // --------------------------------------------------------
        // VALIDATE REVIEW
        // --------------------------------------------------------

        const reviewText =
            String(
                review || "",
            ).trim()

        if (!reviewText) {
            return res.status(400).json({
                success: false,
                message:
                    "Review is required",
            })
        }

        // --------------------------------------------------------
        // VALIDATE RATING
        // --------------------------------------------------------

        const numericRating =
            Number(rating)

        if (
            !Number.isInteger(
                numericRating,
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be a whole number between 1 and 5",
            })
        }

        // --------------------------------------------------------
        // VALIDATE DISPLAY ORDER
        // --------------------------------------------------------

        const numericDisplayOrder =
            Number(display_order)

        if (
            !Number.isInteger(
                numericDisplayOrder,
            ) ||
            numericDisplayOrder < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Display order must be a non-negative whole number",
            })
        }

        // --------------------------------------------------------
        // CUSTOMER ROLE
        // --------------------------------------------------------

        const customerRole =
            String(
                customer_role || "",
            ).trim()

        // --------------------------------------------------------
        // ACTIVE STATUS
        // --------------------------------------------------------

        const activeStatus =
            is_active === false ||
                is_active === "false"
                ? false
                : true

        // --------------------------------------------------------
        // UPDATE
        // --------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("testimonials")
            .update({
                customer_name:
                    customerName,

                customer_role:
                    customerRole ||
                    null,

                review:
                    reviewText,

                rating:
                    numericRating,

                display_order:
                    numericDisplayOrder,

                is_active:
                    activeStatus,

                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", testimonialId)
            .select()
            .single()

        if (error) {
            console.error(
                "Update testimonial Supabase error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update testimonial",
                error: error.message,
                details:
                    error.details || null,
                hint:
                    error.hint || null,
                code:
                    error.code || null,
            })
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                message:
                    "Testimonial not found",
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Testimonial updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update testimonial controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to update testimonial",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — TOGGLE ACTIVE STATUS
// ============================================================

const toggleTestimonialStatus = async (
    req,
    res,
) => {
    try {
        const testimonialId =
            req.params.id

        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message:
                    "Testimonial ID is required",
            })
        }

        // --------------------------------------------------------
        // GET CURRENT STATUS
        // --------------------------------------------------------

        const {
            data: testimonial,
            error: fetchError,
        } = await supabase
            .from("testimonials")
            .select(
                "id, is_active",
            )
            .eq("id", testimonialId)
            .single()

        if (
            fetchError ||
            !testimonial
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Testimonial not found",
            })
        }

        // --------------------------------------------------------
        // TOGGLE
        // --------------------------------------------------------

        const newStatus =
            !testimonial.is_active

        const {
            data,
            error,
        } = await supabase
            .from("testimonials")
            .update({
                is_active:
                    newStatus,

                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", testimonialId)
            .select()
            .single()

        if (error) {
            console.error(
                "Toggle testimonial status error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update testimonial status",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: data.is_active
                ? "Testimonial activated successfully"
                : "Testimonial deactivated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Toggle testimonial status controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to update testimonial status",
            error: error.message,
        })
    }
}


// ============================================================
// ADMIN — DELETE TESTIMONIAL
// ============================================================

const deleteTestimonial = async (
    req,
    res,
) => {
    try {
        const testimonialId =
            req.params.id

        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message:
                    "Testimonial ID is required",
            })
        }

        const {
            data,
            error,
        } = await supabase
            .from("testimonials")
            .delete()
            .eq("id", testimonialId)
            .select()
            .single()

        if (error) {
            console.error(
                "Delete testimonial Supabase error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete testimonial",
                error: error.message,
                details:
                    error.details || null,
                hint:
                    error.hint || null,
                code:
                    error.code || null,
            })
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                message:
                    "Testimonial not found",
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Testimonial deleted successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Delete testimonial controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete testimonial",
            error: error.message,
        })
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getTestimonials,
    getAdminTestimonials,
    getAdminTestimonialById,
    createTestimonial,
    updateTestimonial,
    toggleTestimonialStatus,
    deleteTestimonial,
}