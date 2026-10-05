const supabase = require("../config/supabase")

// ============================================================
// GET ALL CUSTOMERS
// ============================================================

const getAdminCustomers = async (req, res) => {
    try {
        const search =
            req.query.search?.trim() || ""

        let query = supabase
            .from("profiles")
            .select(`
                id,
                full_name,
                email,
                phone,
                role,
                avatar_url,
                created_at,
                updated_at
            `)
            .eq("role", "customer")
            .order("created_at", {
                ascending: false,
            })

        // --------------------------------------------------------
        // SEARCH
        // --------------------------------------------------------

        if (search) {
            query = query.or(
                `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
            )
        }

        const { data, error } = await query

        if (error) {
            console.error(
                "Admin customers fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customers",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Admin customers controller error:",
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
// GET SINGLE CUSTOMER
// ============================================================

const getAdminCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id

        const { data: customer, error } =
            await supabase
                .from("profiles")
                .select(`
                    id,
                    full_name,
                    email,
                    phone,
                    role,
                    avatar_url,
                    created_at,
                    updated_at
                `)
                .eq("id", customerId)
                .eq("role", "customer")
                .single()

        if (error || !customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            })
        }

        // --------------------------------------------------------
        // GET CUSTOMER ORDERS
        // --------------------------------------------------------

        const { data: orders, error: ordersError } =
            await supabase
                .from("orders")
                .select(`
                    id,
                    order_number,
                    status,
                    subtotal,
                    shipping_fee,
                    total_amount,
                    payment_method,
                    payment_status,
                    created_at,
                    updated_at
                `)
                .eq("user_id", customerId)
                .order("created_at", {
                    ascending: false,
                })

        if (ordersError) {
            console.error(
                "Customer orders fetch error:",
                ordersError,
            )
        }

        const customerOrders = orders || []

        // --------------------------------------------------------
        // CUSTOMER STATISTICS
        // --------------------------------------------------------

        const totalOrders =
            customerOrders.length

        const totalSpent =
            customerOrders
                .filter(
                    (order) =>
                        order.status !==
                        "Cancelled",
                )
                .reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.total_amount ||
                            0,
                        ),
                    0,
                )

        return res.status(200).json({
            success: true,
            data: {
                customer,
                orders: customerOrders,
                stats: {
                    totalOrders,
                    totalSpent,
                },
            },
        })
    } catch (error) {
        console.error(
            "Admin customer details error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch customer details",
            error: error.message,
        })
    }
}


module.exports = {
    getAdminCustomers,
    getAdminCustomerById,
}