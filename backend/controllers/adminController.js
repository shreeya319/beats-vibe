const supabase = require("../config/supabase")

// ============================================================
// GET ADMIN DASHBOARD STATISTICS
// ============================================================

const getDashboardStats = async (req, res) => {
    try {
        // --------------------------------------------------------
        // 1. Count all products
        // --------------------------------------------------------

        const {
            count: productsCount,
            error: productsError,
        } = await supabase
            .from("products")
            .select("id", {
                count: "exact",
                head: true,
            })

        if (productsError) {
            throw productsError
        }

        // --------------------------------------------------------
        // 2. Count all categories
        // --------------------------------------------------------

        const {
            count: categoriesCount,
            error: categoriesError,
        } = await supabase
            .from("categories")
            .select("id", {
                count: "exact",
                head: true,
            })

        if (categoriesError) {
            throw categoriesError
        }

        // --------------------------------------------------------
        // 3. Count all orders
        // --------------------------------------------------------

        const {
            count: ordersCount,
            error: ordersError,
        } = await supabase
            .from("orders")
            .select("id", {
                count: "exact",
                head: true,
            })

        if (ordersError) {
            throw ordersError
        }

        // --------------------------------------------------------
        // 4. Count customers
        // --------------------------------------------------------

        const {
            count: customersCount,
            error: customersError,
        } = await supabase
            .from("profiles")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("role", "customer")

        if (customersError) {
            throw customersError
        }

        // --------------------------------------------------------
        // 5. Response
        // --------------------------------------------------------

        return res.status(200).json({
            success: true,

            data: {
                products: productsCount || 0,
                categories: categoriesCount || 0,
                orders: ordersCount || 0,
                customers: customersCount || 0,
            },
        })
    } catch (error) {
        console.error(
            "Admin dashboard stats error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics",
            error: error.message,
        })
    }
}

module.exports = {
    getDashboardStats,
}