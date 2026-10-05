const supabase = require("../config/supabase")

// ============================================================
// GET ALL ORDERS FOR ADMIN
// ============================================================

const getAdminOrders = async (req, res) => {
    try {
        const {
            search = "",
            status = "",
        } = req.query

        // ----------------------------------------------------------
        // Fetch orders with customer profile and order items
        // ----------------------------------------------------------

        let query = supabase
            .from("orders")
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    email,
                    phone
                ),
                order_items (
                    id,
                    product_id,
                    product_name,
                    quantity,
                    unit_price,
                    subtotal
                )
            `)
            .order("created_at", {
                ascending: false,
            })

        // ----------------------------------------------------------
        // Filter by status
        // ----------------------------------------------------------

        if (status && status.trim() !== "") {
            query = query.eq(
                "status",
                status.trim(),
            )
        }

        const {
            data,
            error,
        } = await query

        if (error) {
            console.error(
                "Admin orders fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch orders",
                error: error.message,
            })
        }

        let orders = data || []

        // ----------------------------------------------------------
        // Search
        // ----------------------------------------------------------

        if (search.trim() !== "") {
            const searchValue =
                search.trim().toLowerCase()

            orders = orders.filter(
                (order) => {
                    const orderNumber =
                        String(
                            order.order_number ||
                            "",
                        ).toLowerCase()

                    const customerName =
                        String(
                            order.profiles
                                ?.full_name ||
                            "",
                        ).toLowerCase()

                    const customerEmail =
                        String(
                            order.profiles
                                ?.email ||
                            "",
                        ).toLowerCase()

                    const customerPhone =
                        String(
                            order.profiles
                                ?.phone ||
                            "",
                        ).toLowerCase()

                    return (
                        orderNumber.includes(
                            searchValue,
                        ) ||
                        customerName.includes(
                            searchValue,
                        ) ||
                        customerEmail.includes(
                            searchValue,
                        ) ||
                        customerPhone.includes(
                            searchValue,
                        )
                    )
                },
            )
        }

        // ----------------------------------------------------------
        // Add useful calculated information
        // ----------------------------------------------------------

        orders = orders.map(
            (order) => ({
                ...order,

                item_count:
                    order.order_items?.reduce(
                        (
                            total,
                            item,
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                0,
                            ),
                        0,
                    ) || 0,

                unique_item_count:
                    order.order_items
                        ?.length || 0,
            }),
        )

        return res.status(200).json({
            success: true,
            data: orders,
        })
    } catch (error) {
        console.error(
            "Admin orders controller error:",
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
// GET SINGLE ORDER FOR ADMIN
// ============================================================

const getAdminOrderById = async (
    req,
    res,
) => {
    try {
        const orderId = req.params.id

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            })
        }

        const {
            data,
            error,
        } = await supabase
            .from("orders")
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    email,
                    phone,
                    avatar_url
                ),
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
            .single()

        if (error || !data) {
            console.error(
                "Admin order fetch error:",
                error,
            )

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
            "Get admin order controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message,
        })
    }
}


// ============================================================
// UPDATE ORDER STATUS
// ============================================================

const updateOrderStatus = async (
    req,
    res,
) => {
    try {
        const orderId = req.params.id

        const {
            status,
        } = req.body

        // ----------------------------------------------------------
        // Validate status
        // ----------------------------------------------------------

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ]

        if (!status) {
            return res.status(400).json({
                success: false,
                message:
                    "Order status is required",
            })
        }

        if (
            !allowedStatuses.includes(
                status,
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid order status",
            })
        }

        // ----------------------------------------------------------
        // Check order exists
        // ----------------------------------------------------------

        const {
            data: existingOrder,
            error: existingOrderError,
        } = await supabase
            .from("orders")
            .select(
                "id, order_number, status",
            )
            .eq("id", orderId)
            .single()

        if (
            existingOrderError ||
            !existingOrder
        ) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }

        // ----------------------------------------------------------
        // Update status
        // ----------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("orders")
            .update({
                status,
                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", orderId)
            .select()
            .single()

        if (error) {
            console.error(
                "Update order status error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update order status",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update order status controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to update order status",
            error: error.message,
        })
    }
}


// ============================================================
// GET ADMIN ORDER STATISTICS
// ============================================================

const getAdminOrderStats = async (
    req,
    res,
) => {
    try {
        const {
            data: orders,
            error,
        } = await supabase
            .from("orders")
            .select(
                "id, status, total_amount",
            )

        if (error) {
            console.error(
                "Admin order stats error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch order statistics",
                error: error.message,
            })
        }

        const allOrders =
            orders || []

        const stats = {
            total: allOrders.length,

            pending:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Pending",
                ).length,

            confirmed:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Confirmed",
                ).length,

            processing:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Processing",
                ).length,

            shipped:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Shipped",
                ).length,

            delivered:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Delivered",
                ).length,

            cancelled:
                allOrders.filter(
                    (order) =>
                        order.status ===
                        "Cancelled",
                ).length,

            total_revenue:
                allOrders
                    .filter(
                        (order) =>
                            order.status !==
                            "Cancelled",
                    )
                    .reduce(
                        (
                            total,
                            order,
                        ) =>
                            total +
                            Number(
                                order.total_amount ||
                                0,
                            ),
                        0,
                    ),
        }

        return res.status(200).json({
            success: true,
            data: stats,
        })
    } catch (error) {
        console.error(
            "Admin order stats controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch order statistics",
            error: error.message,
        })
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getAdminOrders,
    getAdminOrderById,
    updateOrderStatus,
    getAdminOrderStats,
}