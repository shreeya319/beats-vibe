const express = require("express")
const multer = require("multer")

const {
    getAbout,
    getAdminAbout,
    updateAbout,
    uploadAboutImage,
} = require("../controllers/aboutController")

const router = express.Router()

// ============================================================
// MULTER CONFIGURATION
// Store uploaded images in memory before sending them
// to Supabase Storage.
// ============================================================

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(
                new Error(
                    "Only image files are allowed",
                ),
                false,
            )
        }
    },
})

// ============================================================
// GET ABOUT US
// Used by customer About page
// GET /api/about
// ============================================================

router.get(
    "/",
    getAbout,
)

// ============================================================
// GET ABOUT US FOR ADMIN
// Used by Admin About page
// GET /api/about/admin
// ============================================================

router.get(
    "/admin",
    getAdminAbout,
)

// ============================================================
// UPDATE ABOUT US
// Used by Admin About page
// PUT /api/about/:id
// ============================================================

router.put(
    "/:id",
    updateAbout,
)

// ============================================================
// UPLOAD ABOUT US IMAGE
// Used by Admin About page
// POST /api/about/upload
// ============================================================

router.post(
    "/upload",
    upload.single("image"),
    uploadAboutImage,
)

// ============================================================
// MULTER ERROR HANDLER
// ============================================================

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message:
                    "Image size must be less than 10 MB",
            })
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }

    next()
})

module.exports = router