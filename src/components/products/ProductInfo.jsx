import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { useState } from "react"
import { addToCart } from "../../services/productService"
import { addToWishlist } from "../../services/wishlistService"

function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)

  const [addingToCart, setAddingToCart] =
    useState(false)

  const [cartMessage, setCartMessage] =
    useState("")

  const [cartError, setCartError] =
    useState("")

  const [addingToWishlist, setAddingToWishlist] =
    useState(false)

  const [wishlistMessage, setWishlistMessage] =
    useState("")

  const [wishlistError, setWishlistError] =
    useState("")

  const hasDiscount =
    product.discount_price !== null &&
    Number(product.discount_price) <
      Number(product.price)

  const currentPrice = hasDiscount
    ? Number(product.discount_price)
    : Number(product.price)

  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number(product.price) -
          Number(product.discount_price)) /
          Number(product.price)) *
          100,
      )
    : 0

  const isOutOfStock =
    product.stock_quantity <= 0

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        current + 1,
        product.stock_quantity,
      ),
    )
  }

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1),
    )
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      setCartMessage("")
      setCartError("")

      const result = await addToCart(
        product.id,
        quantity,
      )

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to add product to cart",
        )
      }

      setCartMessage(
        "Product added to your cart successfully.",
      )

      window.dispatchEvent(
        new Event("cartUpdated"),
      )
    } catch (error) {
      console.error(
        "Add to cart error:",
        error,
      )

      setCartError(
        error.message ||
          "Unable to add product to cart.",
      )
    } finally {
      setAddingToCart(false)
    }
  }

  // ============================================================
  // ADD TO WISHLIST
  // ============================================================

  const handleAddToWishlist = async () => {
    try {
      setAddingToWishlist(true)
      setWishlistMessage("")
      setWishlistError("")

      const result = await addToWishlist(
        product.id,
      )

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to add product to wishlist",
        )
      }

      setWishlistMessage(
        result.message ||
          "Product added to wishlist.",
      )

      window.dispatchEvent(
        new Event("wishlistUpdated"),
      )
    } catch (error) {
      console.error(
        "Add to wishlist error:",
        error,
      )

      setWishlistError(
        error.message ||
          "Unable to add product to wishlist.",
      )
    } finally {
      setAddingToWishlist(false)
    }
  }

  return (
    <div>
      {/* Category */}
      {product.categories?.name && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          {product.categories.name}
        </p>
      )}

      {/* Product Name */}
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
        {product.name}
      </h1>

      {/* Brand */}
      {product.brand && (
        <p className="mt-2 text-lg text-stone-500">
          by {product.brand}
        </p>
      )}

      {/* Price */}
      <div className="mt-6 flex items-end gap-3">
        <span className="text-3xl font-bold text-stone-950">
          ₹{currentPrice.toLocaleString("en-IN")}
        </span>

        {hasDiscount && (
          <>
            <span className="text-lg text-stone-400 line-through">
              ₹
              {Number(
                product.price,
              ).toLocaleString("en-IN")}
            </span>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="mt-5">
        {isOutOfStock ? (
          <span className="font-semibold text-red-600">
            Out of stock
          </span>
        ) : product.stock_quantity <= 5 ? (
          <span className="font-semibold text-orange-600">
            Only {product.stock_quantity} left in
            stock
          </span>
        ) : (
          <span className="font-semibold text-green-600">
            In stock
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-6 border-t border-stone-200 pt-6">
          <h2 className="text-lg font-bold text-stone-900">
            Description
          </h2>

          <p className="mt-3 leading-7 text-stone-600">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Actions */}
      {!isOutOfStock && (
        <>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Quantity */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-white">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="p-3 text-stone-600 transition hover:text-stone-950 disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-10 text-center font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  quantity >=
                  product.stock_quantity
                }
                className="p-3 text-stone-600 transition hover:text-stone-950 disabled:opacity-40"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add To Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart
                size={19}
                className={
                  addingToCart
                    ? "animate-pulse"
                    : ""
                }
              />

              {addingToCart
                ? "Adding..."
                : "Add to Cart"}
            </button>

            {/* Add To Wishlist */}
            <button
              type="button"
              onClick={handleAddToWishlist}
              disabled={addingToWishlist}
              aria-label="Add to wishlist"
              className="group flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-stone-700 transition duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Heart
                size={20}
                className={`transition-transform duration-300 ${
                  addingToWishlist
                    ? "animate-pulse"
                    : "group-hover:scale-110"
                }`}
              />
            </button>
          </div>

          {/* Cart Success */}
          {cartMessage && (
            <p className="mt-3 animate-pulse text-sm font-medium text-green-600">
              {cartMessage}
            </p>
          )}

          {/* Cart Error */}
          {cartError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {cartError}
            </p>
          )}

          {/* Wishlist Success */}
          {wishlistMessage && (
            <p className="mt-3 animate-pulse text-sm font-medium text-green-600">
              {wishlistMessage}
            </p>
          )}

          {/* Wishlist Error */}
          {wishlistError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {wishlistError}
            </p>
          )}
        </>
      )}

      {/* Product Basic Information */}
      <div className="mt-8 rounded-2xl bg-stone-100 p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* SKU */}
          <div>
            <p className="text-stone-400">
              SKU
            </p>

            <p className="mt-1 font-semibold text-stone-800">
              {product.sku}
            </p>
          </div>

          {/* Brand */}
          <div>
            <p className="text-stone-400">
              Brand
            </p>

            <p className="mt-1 font-semibold text-stone-800">
              {product.brand || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo