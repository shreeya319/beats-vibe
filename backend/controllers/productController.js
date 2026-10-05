const supabase = require("../config/supabase")

const getProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            sort = "newest",
            page = 1,
            limit = 12,
            featured = "",
        } = req.query

        const pageNumber = Math.max(
            Number.parseInt(page, 10) || 1,
            1,
        )

        const limitNumber = Math.min(
            Math.max(
                Number.parseInt(limit, 10) || 12,
                1,
            ),
            50,
        )

        const from = (pageNumber - 1) * limitNumber
        const to = from + limitNumber - 1

        let query = supabase
            .from("products")
            .select(
                `
                id,
                category_id,
                name,
                slug,
                sku,
                brand,
                description,
                price,
                discount_price,
                stock_quantity,
                is_featured,
                is_active,
                created_at,
                updated_at,
                categories (
                    id,
                    name,
                    slug
                ),
                product_images (
                    id,
                    image_url,
                    alt_text,
                    is_primary,
                    display_order
                )
                `,
                { count: "exact" },
            )
            .eq("is_active", true)

        // ==========================================================
        // FEATURED PRODUCTS
        // ==========================================================

        if (featured === "true") {
            query = query.eq("is_featured", true)
        }

        // ==========================================================
        // SEARCH
        // ==========================================================

        if (search.trim()) {
            const searchTerm = search.trim()

            query = query.or(
                `name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`,
            )
        }

        // ==========================================================
        // CATEGORY
        // ==========================================================

        if (category.trim()) {
            query = query.eq("category_id", category)
        }

        // ==========================================================
        // SORTING
        // ==========================================================

        switch (sort) {
            case "price-low":
                query = query.order("price", {
                    ascending: true,
                })
                break

            case "price-high":
                query = query.order("price", {
                    ascending: false,
                })
                break

            case "name":
                query = query.order("name", {
                    ascending: true,
                })
                break

            case "oldest":
                query = query.order("created_at", {
                    ascending: true,
                })
                break

            case "newest":
            default:
                query = query.order("created_at", {
                    ascending: false,
                })
                break
        }

        // ==========================================================
        // PAGINATION
        // ==========================================================

        const {
            data,
            error,
            count,
        } = await query.range(from, to)

        if (error) {
            console.error(
                "Product fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products",
                error: error.message,
            })
        }

        const totalPages = Math.ceil(
            (count || 0) / limitNumber,
        )

        return res.status(200).json({
            success: true,
            data: data || [],
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total: count || 0,
                totalPages,
            },
        })
    } catch (error) {
        console.error(
            "Product controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

module.exports = {
    getProducts,
}