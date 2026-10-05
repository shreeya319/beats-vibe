import {
  Heart,
  ShoppingCart,
} from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService"
import { addToCart } from "../../services/productService"

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const primaryImage =
    product.product_images?.find(
      (image) => image.is_primary,
    ) || product.product_images?.[0]

  const hasDiscount =
    product.discount_price !== null &&
    Number(product.discount_price) <
      Number(product.price)

  const displayPrice = hasDiscount
    ? product.discount_price
    : product.price

  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.price) -
          Number(product.discount_price)) /
          Number(product.price)) *
          100,
      )
    : 0

  const isOutOfStock =
    Number(product.stock_quantity) <= 0

  // ============================================================
  // CHECK WISHLIST STATUS
  // ============================================================

  useEffect(() => {
    let mounted = true

    const checkWishlist = async () => {
      try {
        const result = await getWishlist()

        if (!result?.success || !mounted) {
          return
        }

        const wishlistItems = result.data || []

        const exists = wishlistItems.some(
          (item) => {
            const wishlistProduct =
              item.products || item.product

            return (
              Number(
                wishlistProduct?.id ||
                  item.product_id,
              ) === Number(product.id)
            )
          },
        )

        if (mounted) {
          setIsWishlisted(exists)
        }
      } catch (err) {
        // User may simply not be logged in.
        // Do not show an error while browsing products.
        console.log(
          "Wishlist status unavailable:",
          err.message,
        )
      }
    }

    checkWishlist()

    return () => {
      mounted = false
    }
  }, [product.id])

  // ============================================================
  // WISHLIST
  // ============================================================

  const handleWishlist = async () => {
    try {
      setWishlistLoading(true)
      setMessage("")
      setError("")

      if (isWishlisted) {
        const result =
          await removeFromWishlist(product.id)

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to remove from wishlist",
          )
        }

        setIsWishlisted(false)
        setMessage("Removed from wishlist.")
      } else {
        const result =
          await addToWishlist(product.id)

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to add to wishlist",
          )
        }

        setIsWishlisted(true)
        setMessage("Added to wishlist.")
      }

      window.dispatchEvent(
        new Event("wishlistUpdated"),
      )
    } catch (err) {
      console.error(
        "Wishlist error:",
        err,
      )

      setError(
        err.message ||
          "Unable to update wishlist.",
      )
    } finally {
      setWishlistLoading(false)

      setTimeout(() => {
        setMessage("")
        setError("")
      }, 2500)
    }
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = async () => {
    try {
      setCartLoading(true)
      setMessage("")
      setError("")

      const result = await addToCart(
        product.id,
        1,
      )

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to add product to cart",
        )
      }

      setMessage("Added to cart.")

      // Notify Navbar / Cart components
      window.dispatchEvent(
        new Event("cartUpdated"),
      )
    } catch (err) {
      console.error(
        "Add to cart error:",
        err,
      )

      setError(
        err.message ||
          "Unable to add product to cart.",
      )
    } finally {
      setCartLoading(false)

      setTimeout(() => {
        setMessage("")
        setError("")
      }, 2500)
    }
  }

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.45,
      }}
      whileHover={{
        y: -5,
      }}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* ========================================================
          PRODUCT IMAGE
      ======================================================== */}

      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={
              primaryImage.alt_text ||
              product.name
            }
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            No image available
          </div>
        )}

        {/* Discount */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-stone-950">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Featured */}
        {product.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
            isWishlisted
              ? "bg-red-50 text-red-500 opacity-100"
              : "bg-white/90 text-stone-700 hover:bg-white hover:text-red-500 group-hover:opacity-100"
          }`}
        >
          <Heart
            size={18}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* ========================================================
          PRODUCT INFORMATION
      ======================================================== */}

      <div className="p-5">
        {/* Category */}
        {product.categories?.name && (
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            {product.categories.name}
          </p>
        )}

        {/* Product Name */}
        <Link
          to={`/products/${product.slug}`}
        >
          <h2 className="mt-2 line-clamp-2 text-lg font-bold text-stone-900 transition-colors hover:text-amber-600">
            {product.name}
          </h2>
        </Link>

        {/* Brand */}
        {product.brand && (
          <p className="mt-1 text-sm text-stone-500">
            {product.brand}
          </p>
        )}

        {/* Price */}
        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-bold text-stone-950">
            ₹
            {Number(
              displayPrice,
            ).toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="text-sm text-stone-400 line-through">
              ₹
              {Number(
                product.price,
              ).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mt-3">
          {isOutOfStock ? (
            <p className="text-sm font-medium text-red-600">
              Out of stock
            </p>
          ) : Number(
              product.stock_quantity,
            ) <= 5 ? (
            <p className="text-sm font-medium text-orange-600">
              Only{" "}
              {product.stock_quantity} left
            </p>
          ) : (
            <p className="text-sm font-medium text-green-600">
              In stock
            </p>
          )}
        </div>

        {/* ======================================================
            FEEDBACK
        ====================================================== */}

        {message && (
          <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        {/* ======================================================
            ADD TO CART
        ====================================================== */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            isOutOfStock || cartLoading
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
        >
          <ShoppingCart size={17} />

          {isOutOfStock
            ? "Out of stock"
            : cartLoading
              ? "Adding..."
              : "Add to cart"}
        </button>
      </div>
    </motion.article>
  )
}

export default ProductCard