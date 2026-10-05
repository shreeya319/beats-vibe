const express = require("express")
const multer = require("multer")

const {
    getHeroSlides,
    getAllHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    uploadHeroImage,
} = require("../controllers/homeController")

const router = express.Router()

// Store uploaded file in memory temporarily
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

// ============================================================
// CUSTOMER HOME
// ============================================================

router.get(
    "/hero-slides",
    getHeroSlides,
)

// ============================================================
// ADMIN HOME
// ============================================================

router.get(
    "/hero-slides/all",
    getAllHeroSlides,
)

router.post(
    "/hero-slides",
    createHeroSlide,
)

router.put(
    "/hero-slides/:id",
    updateHeroSlide,
)

router.delete(
    "/hero-slides/:id",
    deleteHeroSlide,
)

// ============================================================
// HERO IMAGE UPLOAD
// ============================================================

router.post(
    "/hero-slides/upload",
    upload.single("image"),
    uploadHeroImage,
)

module.exports = router