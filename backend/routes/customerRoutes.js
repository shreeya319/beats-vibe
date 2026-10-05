const express = require("express")

const {
    getAdminCustomers,
    getAdminCustomerById,
} = require("../controllers/customerController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router()

// ============================================================
// ADMIN CUSTOMERS
// ============================================================

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAdminCustomers,
)

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getAdminCustomerById,
)

module.exports = router