import { useEffect } from "react"
import {
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom"

// ============================================================
// CUSTOMER LAYOUT
// ============================================================

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"


// ============================================================
// ADMIN LAYOUT
// ============================================================

import AdminLayout from "./components/admin/AdminLayout"
import AdminRoute from "./components/auth/AdminRoute"

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminHome from "./pages/admin/AdminHome"

import AdminProducts from "./pages/admin/AdminProducts"
import AdminAddProduct from "./pages/admin/AdminAddProduct"

import AdminCategories from "./pages/admin/AdminCategories"
import AdminCategoryForm from "./pages/admin/AdminCategoryForm"

import AdminOrders from "./pages/admin/AdminOrders"
import AdminOrderDetails from "./pages/admin/AdminOrderDetails"

import AdminCustomers from "./pages/admin/AdminCustomers"
import AdminCustomerDetails from "./pages/admin/AdminCustomerDetails"

import AdminTestimonials from "./pages/admin/AdminTestimonials"
import AdminTestimonialForm from "./pages/admin/AdminTestimonialForm"

import AdminContactMessages from "./pages/admin/AdminContactMessages"
import AdminContactMessageDetails from "./pages/admin/AdminContactMessageDetails"

import AdminAboutUs from "./pages/admin/AdminAboutUs"
import AdminSettings from "./pages/admin/AdminSettings"

// ============================================================
// CUSTOMER PAGES
// ============================================================

import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import Shop from "./pages/Shop"
import ProductDetails from "./pages/ProductDetails"

import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"

import Addresses from "./pages/Addresses"
import Checkout from "./pages/Checkout"

import OrderSuccess from "./pages/OrderSuccess"
import Orders from "./pages/Orders"
import OrderDetails from "./pages/OrderDetails"

import Profile from "./pages/Profile"
import Search from "./pages/Search"

import About from "./pages/About"
import Contact from "./pages/Contact"
import Categories from "./pages/Categories"

// ============================================================
// SCROLL TO TOP
// ============================================================

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        })
    }, [pathname])

    return null
}

// ============================================================
// APP
// ============================================================

function App() {
    return (
        <>
            {/* Automatically move every new page to the top */}
            <ScrollToTop />

            <Routes>

                {/* ======================================================
                    CUSTOMER WEBSITE
                ====================================================== */}

                {/* HOME */}

                <Route
                    path="/"
                    element={
                        <CustomerLayout>
                            <Home />
                        </CustomerLayout>
                    }
                />

                {/* ABOUT */}

                <Route
                    path="/about"
                    element={
                        <CustomerLayout>
                            <About />
                        </CustomerLayout>
                    }
                />

                {/* CONTACT */}

                <Route
                    path="/contact"
                    element={
                        <CustomerLayout>
                            <Contact />
                        </CustomerLayout>
                    }
                />

                {/* CATEGORIES */}

                <Route
                    path="/categories"
                    element={
                        <CustomerLayout>
                            <Categories />
                        </CustomerLayout>
                    }
                />

                {/* SHOP */}

                <Route
                    path="/shop"
                    element={
                        <CustomerLayout>
                            <Shop />
                        </CustomerLayout>
                    }
                />

                {/* SEARCH */}

                <Route
                    path="/search"
                    element={
                        <CustomerLayout>
                            <Search />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    PRODUCTS
                ====================================================== */}

                <Route
                    path="/products/:slug"
                    element={
                        <CustomerLayout>
                            <ProductDetails />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    SHOPPING
                ====================================================== */}

                <Route
                    path="/cart"
                    element={
                        <CustomerLayout>
                            <Cart />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/wishlist"
                    element={
                        <CustomerLayout>
                            <Wishlist />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    ADDRESSES
                ====================================================== */}

                <Route
                    path="/addresses"
                    element={
                        <CustomerLayout>
                            <Addresses />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    CHECKOUT
                ====================================================== */}

                <Route
                    path="/checkout"
                    element={
                        <CustomerLayout>
                            <Checkout />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    ORDER SUCCESS
                ====================================================== */}

                <Route
                    path="/order-success/:id"
                    element={
                        <CustomerLayout>
                            <OrderSuccess />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    CUSTOMER ORDERS
                ====================================================== */}

                <Route
                    path="/orders"
                    element={
                        <CustomerLayout>
                            <Orders />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/orders/:id"
                    element={
                        <CustomerLayout>
                            <OrderDetails />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    PROFILE
                ====================================================== */}

                <Route
                    path="/profile"
                    element={
                        <CustomerLayout>
                            <Profile />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    AUTHENTICATION
                ====================================================== */}

                <Route
                    path="/login"
                    element={
                        <CustomerLayout>
                            <Login />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <CustomerLayout>
                            <Register />
                        </CustomerLayout>
                    }
                />

                {/* ======================================================
                    ADMIN SECTION
                ====================================================== */}

                {/* ======================================================
                    ADMIN DASHBOARD
                ====================================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN HOME
                ====================================================== */}

                <Route
                    path="/admin/home"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminHome />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN ABOUT
                ====================================================== */}

                <Route
                    path="/admin/about"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminAboutUs />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN PRODUCTS
                ====================================================== */}

                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminProducts />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ADD PRODUCT */}

                <Route
                    path="/admin/products/new"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminAddProduct />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* EDIT PRODUCT */}

                <Route
                    path="/admin/products/edit/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminAddProduct />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN CATEGORIES
                ====================================================== */}

                <Route
                    path="/admin/categories"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCategories />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ADD CATEGORY */}

                <Route
                    path="/admin/categories/new"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCategoryForm />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* EDIT CATEGORY */}

                <Route
                    path="/admin/categories/edit/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCategoryForm />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN ORDERS
                ====================================================== */}

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminOrders />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ORDER DETAILS */}

                <Route
                    path="/admin/orders/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminOrderDetails />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN CUSTOMERS
                ====================================================== */}

                <Route
                    path="/admin/customers"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCustomers />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* CUSTOMER DETAILS */}

                <Route
                    path="/admin/customers/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCustomerDetails />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN TESTIMONIALS
                ====================================================== */}

                <Route
                    path="/admin/testimonials"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminTestimonials />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ADD TESTIMONIAL */}

                <Route
                    path="/admin/testimonials/new"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminTestimonialForm />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* EDIT TESTIMONIAL */}

                <Route
                    path="/admin/testimonials/edit/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminTestimonialForm />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN CONTACT MESSAGES
                ====================================================== */}

                <Route
                    path="/admin/contact-messages"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminContactMessages />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* CONTACT MESSAGE DETAILS */}

                <Route
                    path="/admin/contact-messages/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminContactMessageDetails />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    ADMIN SETTINGS
                ====================================================== */}

                <Route
                    path="/admin/settings"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ======================================================
                    INVALID ROUTE
                ====================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    )
}

// ============================================================
// CUSTOMER LAYOUT
// ============================================================

function CustomerLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">

            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />

        </div>
    )
}

export default App