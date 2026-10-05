const supabase = require("../config/supabase")

// ============================================================
// GET OR CREATE USER WISHLIST
// ============================================================

const getOrCreateWishlist = async (userId) => {
    // Find existing wishlist for the logged-in user
    const {
        data: existingWishlist,
        error: findError,
    } = await supabase
        .from("wishlists")
        .select("id, user_id")
        .eq("user_id", userId)
        .maybeSingle()

    if (findError) {
        throw findError
    }

    // Return existing wishlist
    if (existingWishlist) {
        return existingWishlist
    }

    // Create wishlist if it does not exist
    const {
        data: newWishlist,
        error: createError,
    } = await supabase
        .from("wishlists")
        .insert({
            user_id: userId,
        })
        .select("id, user_id")
        .single()

    if (createError) {
        throw createError
    }

    return newWishlist
}

// ============================================================
// GET USER WISHLIST
// ============================================================

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id

        const wishlist =
            await getOrCreateWishlist(userId)

        const {
            data,
            error,
        } = await supabase
            .from("wishlist_items")
            .select(`
        id,
        wishlist_id,
        product_id,
        created_at,
        products (
          id,
          name,
          slug,
          sku,
          brand,
          description,
          price,
          discount_price,
          stock_quantity,
          is_active,
          product_images (
            id,
            image_url,
            alt_text,
            is_primary,
            display_order
          )
        )
      `)
            .eq("wishlist_id", wishlist.id)
            .order("created_at", {
                ascending: false,
            })

        if (error) {
            console.error(
                "Get wishlist error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch wishlist",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
            total: data?.length || 0,
        })
    } catch (error) {
        console.error(
            "Wishlist controller error:",
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
// ADD PRODUCT TO WISHLIST
// ============================================================

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id
        const { product_id } = req.body

        // Validate product ID
        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            })
        }

        // Check whether product exists
        const {
            data: product,
            error: productError,
        } = await supabase
            .from("products")
            .select("id, is_active")
            .eq("id", product_id)
            .single()

        if (productError || !product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        // Do not allow inactive products
        if (!product.is_active) {
            return res.status(400).json({
                success: false,
                message:
                    "This product is not available",
            })
        }

        // Get or create user's wishlist
        const wishlist =
            await getOrCreateWishlist(userId)

        // Check whether product is already in wishlist
        const {
            data: existingItem,
            error: existingError,
        } = await supabase
            .from("wishlist_items")
            .select("id")
            .eq("wishlist_id", wishlist.id)
            .eq("product_id", product_id)
            .maybeSingle()

        if (existingError) {
            throw existingError
        }

        // Prevent duplicate wishlist items
        if (existingItem) {
            return res.status(200).json({
                success: true,
                message:
                    "Product is already in your wishlist",
                data: existingItem,
            })
        }

        // Add product to wishlist
        const {
            data,
            error,
        } = await supabase
            .from("wishlist_items")
            .insert({
                wishlist_id: wishlist.id,
                product_id,
            })
            .select()
            .single()

        if (error) {
            console.error(
                "Insert wishlist item error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to add product to wishlist",
                error: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message:
                "Product added to wishlist",
            data,
        })
    } catch (error) {
        console.error(
            "Add wishlist controller error:",
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
// REMOVE PRODUCT FROM WISHLIST
// ============================================================

const removeFromWishlist = async (
    req,
    res,
) => {
    try {
        const userId = req.user.id
        const { productId } = req.params

        // Get user's wishlist
        const wishlist =
            await getOrCreateWishlist(userId)

        // Remove product
        const {
            error,
        } = await supabase
            .from("wishlist_items")
            .delete()
            .eq("wishlist_id", wishlist.id)
            .eq("product_id", productId)

        if (error) {
            console.error(
                "Remove wishlist error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to remove product from wishlist",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Product removed from wishlist",
        })
    } catch (error) {
        console.error(
            "Remove wishlist controller error:",
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
// EXPORT CONTROLLERS
// ============================================================

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
}