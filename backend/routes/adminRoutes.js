const express = require("express")

const {
    getDashboardStats,
} = require("../controllers/adminController")

const {
    createProduct,
    getAdminProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/adminProductController")

const {
    getAdminCategories,
    getAdminCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController")

const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

// ============================================================
// ADMIN DASHBOARD
// ============================================================

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats,
)

// ============================================================
// ADMIN PRODUCTS
// ============================================================

// CREATE PRODUCT

router.post(
    "/products",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    createProduct,
)

// GET SINGLE PRODUCT

router.get(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    getAdminProductById,
)

// UPDATE PRODUCT

router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateProduct,
)

// DELETE PRODUCT

router.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct,
)

// ============================================================
// ADMIN CATEGORIES
// ============================================================

// GET ALL CATEGORIES

router.get(
    "/categories",
    authMiddleware,
    adminMiddleware,
    getAdminCategories,
)

// GET SINGLE CATEGORY

router.get(
    "/categories/:id",
    authMiddleware,
    adminMiddleware,
    getAdminCategoryById,
)

// CREATE CATEGORY

router.post(
    "/categories",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    createCategory,
)

// UPDATE CATEGORY

router.put(
    "/categories/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    updateCategory,
)

// DELETE CATEGORY

router.delete(
    "/categories/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory,
)

module.exports = router