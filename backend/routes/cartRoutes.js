const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../controllers/cartController")

const router = express.Router()

// All cart routes require authentication
router.use(authMiddleware)

router.get("/", getCart)

router.post("/", addToCart)

router.patch("/:id", updateCartItem)

router.delete("/:id", removeCartItem)

router.delete("/", clearCart)

module.exports = router