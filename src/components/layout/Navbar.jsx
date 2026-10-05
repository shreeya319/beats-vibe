import { Link, NavLink } from "react-router-dom"
import {
  ClipboardList,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  ShieldCheck,
  User,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"

import { useAuth } from "../../hooks/useAuth"
import { getCart } from "../../services/cartService"

function Navbar() {
  const {
    user,
    profile,
    logout,
    isAdmin,
  } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Categories", path: "/categories" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ]

  // ============================================================
  // LOAD CART COUNT
  // ============================================================

  const loadCartCount = async () => {
    if (!user) {
      setCartCount(0)
      return
    }

    try {
      const result = await getCart()

      if (!result?.success) {
        setCartCount(0)
        return
      }

      const itemCount = Number(
        result.summary?.itemCount || 0,
      )

      setCartCount(itemCount)
    } catch (error) {
      console.error(
        "Navbar cart count error:",
        error,
      )

      setCartCount(0)
    }
  }

  // ============================================================
  // LOAD CART WHEN USER CHANGES
  // ============================================================

  useEffect(() => {
    loadCartCount()
  }, [user])

  // ============================================================
  // LISTEN FOR CART UPDATES
  // ============================================================

  useEffect(() => {
    const handleCartUpdated = () => {
      loadCartCount()
    }

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated,
    )

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated,
      )
    }
  }, [user])

  // ============================================================
  // CLOSE MOBILE MENU
  // ============================================================

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await logout()

      setCartCount(0)
      closeMobileMenu()
    } catch (error) {
      console.error(
        "Logout failed:",
        error.message,
      )
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">

      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ============================================================
            LOGO
        ============================================================ */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-amber-400 transition-transform duration-300 group-hover:scale-105">
            ♪
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-bold leading-none text-stone-950">
              Beats
            </p>

            <p className="text-xs font-medium tracking-[0.2em] text-amber-600">
               Vibe
            </p>
          </div>
        </Link>

        {/* ============================================================
            DESKTOP NAVIGATION
        ============================================================ */}

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-amber-600"
                    : "text-stone-600 hover:text-stone-950"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-5 rounded-full bg-amber-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* ============================================================
            DESKTOP ACTIONS
        ============================================================ */}

        <div className="hidden items-center gap-2 lg:flex">

          {/* Search */}

          <Link
            to="/search"
            className="rounded-xl p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          {user && (
            <>
              {/* Orders */}

              <Link
                to="/orders"
                className="rounded-xl p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                aria-label="Orders"
              >
                <ClipboardList size={20} />
              </Link>

              {/* Wishlist */}

              <Link
                to="/wishlist"
                className="rounded-xl p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* ======================================================
                  CART
              ====================================================== */}

              <Link
                to="/cart"
                className="relative rounded-xl p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                aria-label={`Cart${
                  cartCount > 0
                    ? ` with ${cartCount} items`
                    : ""
                }`}
              >
                <ShoppingCart size={20} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold leading-none text-stone-950 shadow-sm">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {/* ======================================================
                  PROFILE
              ====================================================== */}

              <Link
                to="/profile"
                className="ml-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                <User size={18} />

                <span>
                  {profile?.full_name ||
                    "Account"}
                </span>
              </Link>

              {/* ======================================================
                  ADMIN PANEL
                  ONLY VISIBLE TO ADMIN
              ====================================================== */}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                  title="Open Admin Panel"
                >
                  <ShieldCheck size={18} />
                  Admin Panel
                </Link>
              )}

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* ============================================================
              LOGGED OUT
          ============================================================ */}

          {!user && (
            <>
              <Link
                to="/login"
                className="ml-2 rounded-xl px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ============================================================
            MOBILE MENU BUTTON
        ============================================================ */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (current) => !current,
            )
          }
          className="rounded-xl p-2 text-stone-700 transition hover:bg-stone-100 lg:hidden"
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </nav>

      {/* ============================================================
          MOBILE NAVIGATION
      ============================================================ */}

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-5 shadow-lg lg:hidden">

          <div className="mx-auto max-w-7xl space-y-1">

            {/* ========================================================
                MAIN NAVIGATION
            ======================================================== */}

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-stone-700 hover:bg-stone-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* ========================================================
                SEARCH
            ======================================================== */}

            <NavLink
              to="/search"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <Search size={18} />
              Search
            </NavLink>

            {user ? (
              <>
                {/* ====================================================
                    ORDERS
                ==================================================== */}

                <NavLink
                  to="/orders"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-amber-50 text-amber-700"
                        : "text-stone-700 hover:bg-stone-50"
                    }`
                  }
                >
                  <ClipboardList size={18} />
                  Orders
                </NavLink>

                {/* ====================================================
                    WISHLIST
                ==================================================== */}

                <NavLink
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  <Heart size={18} />
                  Wishlist
                </NavLink>

                {/* ====================================================
                    CART
                ==================================================== */}

                <NavLink
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart size={18} />
                    Cart
                  </span>

                  {cartCount > 0 && (
                    <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-stone-950">
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </NavLink>

                {/* ====================================================
                    PROFILE
                ==================================================== */}

                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-amber-50 text-amber-700"
                        : "text-stone-700 hover:bg-stone-50"
                    }`
                  }
                >
                  <User size={18} />

                  {profile?.full_name ||
                    "Profile"}
                </NavLink>

                {/* ====================================================
                    ADMIN PANEL
                    ONLY VISIBLE TO ADMIN
                ==================================================== */}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-950 text-white hover:bg-amber-500 hover:text-stone-950"
                      }`
                    }
                  >
                    <ShieldCheck size={18} />
                    Admin Panel
                  </NavLink>
                )}

                {/* ====================================================
                    LOGOUT
                ==================================================== */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              /* ======================================================
                 AUTH BUTTONS
              ====================================================== */

              <div className="grid grid-cols-2 gap-3 pt-3">

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-stone-200 px-4 py-3 text-center text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                >
                  Register
                </Link>

              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar