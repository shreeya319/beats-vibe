const express = require("express")

const {
    createOrder,
    getOrders,
    getOrderById,
} = require("../controllers/orderController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()


// Create order from cart
router.post(
    "/",
    authMiddleware,
    createOrder,
)


// Get logged-in user's orders
router.get(
    "/",
    authMiddleware,
    getOrders,
)


// Get single order
router.get(
    "/:id",
    authMiddleware,
    getOrderById,
)


module.exports = router