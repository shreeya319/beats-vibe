const supabase = require("../config/supabase")

// ============================================================
// GET CART
// ============================================================

const getCart = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabase
            .from("cart_items")
            .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        updated_at,
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
          is_featured,
          product_images (
            id,
            image_url,
            alt_text,
            is_primary,
            display_order
          )
        )
      `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Get cart error:", error)

            return res.status(500).json({
                success: false,
                message: "Failed to fetch cart",
                error: error.message,
            })
        }

        const cartItems = data || []

        cartItems.forEach((item) => {
            if (item.products?.product_images) {
                item.products.product_images.sort(
                    (a, b) => a.display_order - b.display_order,
                )
            }
        })

        const subtotal = cartItems.reduce((total, item) => {
            const product = item.products

            if (!product) {
                return total
            }

            const price =
                product.discount_price !== null &&
                    Number(product.discount_price) < Number(product.price)
                    ? Number(product.discount_price)
                    : Number(product.price)

            return total + price * item.quantity
        }, 0)

        return res.status(200).json({
            success: true,
            data: cartItems,
            summary: {
                itemCount: cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0,
                ),
                uniqueItems: cartItems.length,
                subtotal,
            },
        })
    } catch (error) {
        console.error("Cart controller error:", error)

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}


// ============================================================
// ADD TO CART
// ============================================================

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id

        const { product_id, quantity = 1 } = req.body

        const productId = Number(product_id)
        const requestedQuantity = Number(quantity)

        if (!productId || !Number.isInteger(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid product_id is required",
            })
        }

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer",
            })
        }

        // --------------------------------------------------------
        // Check product
        // --------------------------------------------------------

        const { data: product, error: productError } = await supabase
            .from("products")
            .select("id, name, stock_quantity, is_active")
            .eq("id", productId)
            .single()

        if (productError || !product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        if (!product.is_active) {
            return res.status(400).json({
                success: false,
                message: "This product is currently unavailable",
            })
        }

        if (product.stock_quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "This product is out of stock",
            })
        }

        // --------------------------------------------------------
        // Check existing cart item
        // --------------------------------------------------------

        const { data: existingItem, error: existingError } =
            await supabase
                .from("cart_items")
                .select("id, quantity")
                .eq("user_id", userId)
                .eq("product_id", productId)
                .maybeSingle()

        if (existingError) {
            console.error(
                "Existing cart item error:",
                existingError,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to check cart",
                error: existingError.message,
            })
        }

        let cartItem

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + requestedQuantity

            if (newQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock_quantity} item(s) available in stock`,
                })
            }

            const { data, error } = await supabase
                .from("cart_items")
                .update({
                    quantity: newQuantity,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingItem.id)
                .eq("user_id", userId)
                .select()
                .single()

            if (error) {
                console.error("Update cart error:", error)

                return res.status(500).json({
                    success: false,
                    message: "Failed to update cart",
                    error: error.message,
                })
            }

            cartItem = data
        } else {
            if (requestedQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock_quantity} item(s) available in stock`,
                })
            }

            const { data, error } = await supabase
                .from("cart_items")
                .insert({
                    user_id: userId,
                    product_id: productId,
                    quantity: requestedQuantity,
                })
                .select()
                .single()

            if (error) {
                console.error("Add cart error:", error)

                return res.status(500).json({
                    success: false,
                    message: "Failed to add product to cart",
                    error: error.message,
                })
            }

            cartItem = data
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cartItem,
        })
    } catch (error) {
        console.error("Add to cart controller error:", error)

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}


// ============================================================
// UPDATE CART ITEM
// ============================================================

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id
        const cartItemId = Number(req.params.id)

        const { quantity } = req.body

        const newQuantity = Number(quantity)

        if (!cartItemId || !Number.isInteger(cartItemId)) {
            return res.status(400).json({
                success: false,
                message: "Valid cart item ID is required",
            })
        }

        if (
            !Number.isInteger(newQuantity) ||
            newQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer",
            })
        }

        // --------------------------------------------------------
        // Find cart item with product stock
        // --------------------------------------------------------

        const { data: cartItem, error: cartError } = await supabase
            .from("cart_items")
            .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          stock_quantity,
          is_active
        )
      `)
            .eq("id", cartItemId)
            .eq("user_id", userId)
            .single()

        if (cartError || !cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            })
        }

        if (!cartItem.products?.is_active) {
            return res.status(400).json({
                success: false,
                message: "This product is no longer available",
            })
        }

        if (
            newQuantity >
            cartItem.products.stock_quantity
        ) {
            return res.status(400).json({
                success: false,
                message: `Only ${cartItem.products.stock_quantity} item(s) available in stock`,
            })
        }

        const { data, error } = await supabase
            .from("cart_items")
            .update({
                quantity: newQuantity,
                updated_at: new Date().toISOString(),
            })
            .eq("id", cartItemId)
            .eq("user_id", userId)
            .select()
            .single()

        if (error) {
            console.error("Update cart item error:", error)

            return res.status(500).json({
                success: false,
                message: "Failed to update cart item",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update cart controller error:",
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
// REMOVE CART ITEM
// ============================================================

const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id
        const cartItemId = Number(req.params.id)

        if (!cartItemId || !Number.isInteger(cartItemId)) {
            return res.status(400).json({
                success: false,
                message: "Valid cart item ID is required",
            })
        }

        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("id", cartItemId)
            .eq("user_id", userId)

        if (error) {
            console.error("Remove cart item error:", error)

            return res.status(500).json({
                success: false,
                message: "Failed to remove cart item",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
        })
    } catch (error) {
        console.error(
            "Remove cart controller error:",
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
// CLEAR CART
// ============================================================

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id

        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", userId)

        if (error) {
            console.error("Clear cart error:", error)

            return res.status(500).json({
                success: false,
                message: "Failed to clear cart",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        })
    } catch (error) {
        console.error("Clear cart controller error:", error)

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
}