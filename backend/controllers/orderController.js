const supabase = require("../config/supabase")

// ============================================================
// CREATE ORDER FROM CART
// ============================================================

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id

        const {
            address_id,
            payment_method = "Cash on Delivery",
        } = req.body

        // ----------------------------------------------------------
        // 1. Validate address
        // ----------------------------------------------------------

        if (!address_id) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            })
        }

        // ----------------------------------------------------------
        // 2. Get user's address
        // ----------------------------------------------------------

        const { data: address, error: addressError } =
            await supabase
                .from("addresses")
                .select("*")
                .eq("id", address_id)
                .eq("user_id", userId)
                .single()

        if (addressError || !address) {
            return res.status(404).json({
                success: false,
                message: "Shipping address not found",
            })
        }

        // ----------------------------------------------------------
        // 3. Get user's cart
        // ----------------------------------------------------------

        const { data: cartItems, error: cartError } =
            await supabase
                .from("cart_items")
                .select(`
          id,
          product_id,
          quantity,
          products (
            id,
            name,
            price,
            discount_price,
            stock_quantity,
            is_active
          )
        `)
                .eq("user_id", userId)

        if (cartError) {
            console.error(
                "Get cart for order error:",
                cartError,
            )

            return res.status(500).json({
                success: false,
                message: cartError.message,
            })
        }

        // ----------------------------------------------------------
        // 4. Validate cart
        // ----------------------------------------------------------

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty",
            })
        }

        // ----------------------------------------------------------
        // 5. Validate products and calculate subtotal
        // ----------------------------------------------------------

        let subtotal = 0

        const orderItems = []

        for (const cartItem of cartItems) {
            const product = cartItem.products

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message:
                        "One of the products in your cart is no longer available",
                })
            }

            if (!product.is_active) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} is no longer available`,
                })
            }

            if (
                product.stock_quantity <
                cartItem.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.`,
                })
            }

            const unitPrice =
                product.discount_price !== null &&
                    Number(product.discount_price) <
                    Number(product.price)
                    ? Number(product.discount_price)
                    : Number(product.price)

            const itemSubtotal =
                unitPrice * cartItem.quantity

            subtotal += itemSubtotal

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity: cartItem.quantity,
                unit_price: unitPrice,
                subtotal: itemSubtotal,
            })
        }

        // ----------------------------------------------------------
        // 6. Calculate shipping
        // ----------------------------------------------------------

        // Free shipping for orders of ₹5,000 or more.
        // Otherwise ₹100 shipping fee.
        const shippingFee =
            subtotal >= 5000 ? 0 : 100

        const totalAmount =
            subtotal + shippingFee

        // ----------------------------------------------------------
        // 7. Generate order number
        // ----------------------------------------------------------

        const orderNumber = `MIS-${Date.now()}-${Math.floor(
            Math.random() * 1000,
        )
            .toString()
            .padStart(3, "0")}`

        // ----------------------------------------------------------
        // 8. Create order
        // ----------------------------------------------------------

        const { data: order, error: orderError } =
            await supabase
                .from("orders")
                .insert([
                    {
                        user_id: userId,
                        order_number: orderNumber,
                        status: "Pending",

                        subtotal,
                        shipping_fee: shippingFee,
                        total_amount: totalAmount,

                        shipping_name: address.name,
                        shipping_phone: address.phone,
                        shipping_address: address.address,
                        shipping_city: address.city,
                        shipping_state: address.state,
                        shipping_postal_code:
                            address.postal_code,
                        shipping_country: address.country,

                        payment_method,
                        payment_status:
                            payment_method === "Cash on Delivery"
                                ? "Pending"
                                : "Pending",
                    },
                ])
                .select()
                .single()

        if (orderError) {
            console.error(
                "Create order error:",
                orderError,
            )

            return res.status(500).json({
                success: false,
                message: orderError.message,
            })
        }

        // ----------------------------------------------------------
        // 9. Create order items
        // ----------------------------------------------------------

        const orderItemsToInsert =
            orderItems.map((item) => ({
                order_id: order.id,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal,
            }))

        const {
            data: createdOrderItems,
            error: orderItemsError,
        } = await supabase
            .from("order_items")
            .insert(orderItemsToInsert)
            .select()

        if (orderItemsError) {
            console.error(
                "Create order items error:",
                orderItemsError,
            )

            // Remove order if order items failed
            await supabase
                .from("orders")
                .delete()
                .eq("id", order.id)

            return res.status(500).json({
                success: false,
                message: orderItemsError.message,
            })
        }

        // ----------------------------------------------------------
        // 10. Update product stock
        // ----------------------------------------------------------

        for (const cartItem of cartItems) {
            const product = cartItem.products

            const newStock =
                product.stock_quantity -
                cartItem.quantity

            const { error: stockError } =
                await supabase
                    .from("products")
                    .update({
                        stock_quantity: newStock,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", product.id)

            if (stockError) {
                console.error(
                    "Update product stock error:",
                    stockError,
                )

                return res.status(500).json({
                    success: false,
                    message:
                        "Order was created, but stock update failed",
                    order: {
                        id: order.id,
                        order_number:
                            order.order_number,
                    },
                })
            }
        }

        // ----------------------------------------------------------
        // 11. Clear user's cart
        // ----------------------------------------------------------

        const { error: clearCartError } =
            await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", userId)

        if (clearCartError) {
            console.error(
                "Clear cart error:",
                clearCartError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Order was created, but cart could not be cleared",
                order: {
                    id: order.id,
                    order_number:
                        order.order_number,
                },
            })
        }

        // ----------------------------------------------------------
        // 12. Success response
        // ----------------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: {
                order,
                items: createdOrderItems || [],
            },
        })
    } catch (error) {
        console.error(
            "Create order controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to place order",
        })
    }
}


// ============================================================
// GET USER ORDERS
// ============================================================

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabase
            .from("orders")
            .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          subtotal,
          created_at
        )
      `)
            .eq("user_id", userId)
            .order("created_at", {
                ascending: false,
            })

        if (error) {
            console.error(
                "Get orders error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Get orders controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        })
    }
}


// ============================================================
// GET SINGLE USER ORDER
// ============================================================

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id
        const orderId = req.params.id

        const { data, error } = await supabase
            .from("orders")
            .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          subtotal,
          created_at
        )
      `)
            .eq("id", orderId)
            .eq("user_id", userId)
            .single()

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get order controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        })
    }
}


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
}