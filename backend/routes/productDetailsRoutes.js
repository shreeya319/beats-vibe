const express = require("express")
const {
    getProductBySlug,
} = require("../controllers/productDetailsController")

const router = express.Router()

router.get("/:slug", getProductBySlug)

module.exports = router