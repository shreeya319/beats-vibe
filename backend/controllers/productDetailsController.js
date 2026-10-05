const supabase = require("../config/supabase")

const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Product slug is required",
            })
        }

        const { data, error } = await supabase
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
          ),

          product_specifications (
            id,
            specification_name,
            specification_value,
            created_at
          )
        `,
            )
            .eq("slug", slug)
            .eq("is_active", true)
            .single()

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                })
            }

            console.error("Product details fetch error:", error)

            return res.status(500).json({
                success: false,
                message: "Failed to fetch product details",
                error: error.message,
            })
        }

        if (data.product_images) {
            data.product_images.sort(
                (a, b) => a.display_order - b.display_order,
            )
        }

        if (data.product_specifications) {
            data.product_specifications.sort((a, b) =>
                a.specification_name.localeCompare(b.specification_name),
            )
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error("Product details controller error:", error)

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

module.exports = {
    getProductBySlug,
}