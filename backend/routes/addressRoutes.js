const express = require("express")

const {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
} = require("../controllers/addressController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()


// Get all addresses
router.get(
    "/",
    authMiddleware,
    getAddresses,
)


// Get single address
router.get(
    "/:id",
    authMiddleware,
    getAddressById,
)


// Create address
router.post(
    "/",
    authMiddleware,
    createAddress,
)


// Update address
router.put(
    "/:id",
    authMiddleware,
    updateAddress,
)


// Delete address
router.delete(
    "/:id",
    authMiddleware,
    deleteAddress,
)


module.exports = router