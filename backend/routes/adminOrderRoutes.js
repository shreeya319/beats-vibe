const express = require("express")

const {
    getAdminOrders,
    getAdminOrderById,
    updateOrderStatus,
    getAdminOrderStats,
} = require("../controllers/adminOrderController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router()


// ============================================================
// ADMIN ORDERS
// ============================================================

// GET ALL ORDERS
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAdminOrders,
)


// GET ORDER STATISTICS
router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getAdminOrderStats,
)


// GET SINGLE ORDER
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrderById,
)


// UPDATE ORDER STATUS
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus,
)


module.exports = router