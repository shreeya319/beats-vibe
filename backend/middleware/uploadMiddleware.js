const multer = require("multer")

// ============================================================
// STORE FILE IN MEMORY
// ============================================================
//
// We keep the uploaded image in memory temporarily.
// The actual file will be uploaded to Supabase Storage
// by the product controller.
//

const storage = multer.memoryStorage()

// ============================================================
// ALLOWED IMAGE TYPES
// ============================================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed",
            ),
            false,
        )
    }
}

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const upload = multer({
    storage,
    fileFilter,

    limits: {
        // 5 MB maximum
        fileSize: 5 * 1024 * 1024,
    },
})

module.exports = upload