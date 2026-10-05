import {
  Mail,
  MapPin,
  Music2,
  Phone,
} from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-stone-950 text-stone-300">
      {/* ==========================================================
          MAIN FOOTER
      ========================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ======================================================
              BRAND
          ====================================================== */}

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-2xl font-bold text-stone-950">
                ♪
              </div>

              <div>
                <p className="text-lg font-bold leading-none text-white">
                  Musical
                </p>

                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-amber-400">
                  INSTRUMENTS
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-stone-400">
              Discover quality musical instruments for beginners,
              performers, and passionate musicians. Find the sound
              that inspires you.
            </p>

            {/* Social Links */}

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-800 text-xs font-bold text-stone-400 transition hover:border-amber-500 hover:bg-amber-500 hover:text-stone-950"
              >
                FB
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-800 text-xs font-bold text-stone-400 transition hover:border-amber-500 hover:bg-amber-500 hover:text-stone-950"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-800 text-xs font-bold text-stone-400 transition hover:border-amber-500 hover:bg-amber-500 hover:text-stone-950"
              >
                X
              </a>
            </div>
          </div>

          {/* ======================================================
              QUICK LINKS
          ====================================================== */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Search
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================
              CUSTOMER ACCOUNT
          ====================================================== */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              My Account
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/addresses"
                  className="text-sm text-stone-400 transition hover:text-amber-400"
                >
                  My Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* ======================================================
              CONTACT
          ====================================================== */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              {/* Address */}

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <p className="text-sm leading-6 text-stone-400">
                  Pune, Maharashtra
                  <br />
                  India
                </p>
              </div>

              {/* Phone */}

              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-stone-400 transition hover:text-amber-400"
              >
                <Phone
                  size={18}
                  className="shrink-0 text-amber-500"
                />

                +91 98765 43210
              </a>

              {/* Email */}

              <a
                href="mailto:support@musicalinstruments.com"
                className="flex items-start gap-3 text-sm text-stone-400 transition hover:text-amber-400"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <span className="break-all">
                  support@musicalinstruments.com
                </span>
              </a>

              {/* Music */}

              <div className="flex items-start gap-3 pt-2">
                <Music2
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <p className="text-sm leading-6 text-stone-400">
                  Making music accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          BOTTOM FOOTER
      ========================================================== */}

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-center text-sm text-stone-500 md:text-left">
            © {currentYear} Musical Instruments. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5">
            <Link
              to="/privacy-policy"
              className="text-xs text-stone-500 transition hover:text-amber-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-stone-500 transition hover:text-amber-400"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer