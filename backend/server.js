const express = require("express")
const cors = require("cors")
const path = require("path")

require("dotenv").config({
    path: path.join(__dirname, ".env"),
})

const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productDetailsRoutes = require("./routes/productDetailsRoutes")
const cartRoutes = require("./routes/cartRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const addressRoutes = require("./routes/addressRoutes")
const orderRoutes = require("./routes/orderRoutes")
const contactRoutes = require("./routes/contactRoutes")
const homeRoutes = require("./routes/homeRoutes")
const aboutRoutes = require("./routes/aboutRoutes")
const testimonialRoutes = require("./routes/testimonialRoutes")
const adminRoutes = require("./routes/adminRoutes")
const adminOrderRoutes = require("./routes/adminOrderRoutes")
const customerRoutes = require("./routes/customerRoutes")
const adminTestimonialRoutes = require("./routes/adminTestimonialRoutes")
const settingsRoutes = require("./routes/settingsRoutes")

// Contact Information routes
const contactInformationRoutes = require("./routes/contactInformationRoutes")

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Musical Instruments Store API is running",
    })
})

app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products/details", productDetailsRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/addresses", addressRoutes)
app.use("/api/orders", orderRoutes)

// Existing contact messages table
app.use("/api/contact", contactRoutes)

// Other existing routes
app.use("/api/home", homeRoutes)
app.use("/api/about", aboutRoutes)
app.use("/api/testimonials", testimonialRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/admin/orders", adminOrderRoutes)
app.use("/api/admin/customers", customerRoutes)
app.use("/api/admin/testimonials", adminTestimonialRoutes)
app.use("/api/settings", settingsRoutes)

// New contact information table
app.use(
    "/api/contact-information",
    contactInformationRoutes,
)

app.listen(PORT, () => {
    console.log(
        `Backend server running on http://localhost:${PORT}`,
    )
})