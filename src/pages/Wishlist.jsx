import {
  ArrowRight,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react"
import { motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService"
import { addToCart } from "../services/productService"

function Wishlist() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [removingId, setRemovingId] = useState(null)
  const [cartId, setCartId] = useState(null)
  const [message, setMessage] = useState("")
  const [actionError, setActionError] = useState("")

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getWishlist()

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load wishlist",
        )
      }

      setItems(result.data || [])
    } catch (err) {
      console.error(
        "Wishlist loading error:",
        err,
      )

      setError(
        err.message ||
          "Unable to load your wishlist.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWishlist()

    const handleWishlistUpdated = () => {
      loadWishlist()
    }

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdated,
    )

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdated,
      )
    }
  }, [loadWishlist])

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId)
      setMessage("")
      setActionError("")

      const result =
        await removeFromWishlist(productId)

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to remove product",
        )
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.product_id !== productId,
        ),
      )

      setMessage(
        "Product removed from wishlist.",
      )

      window.dispatchEvent(
        new Event("wishlistUpdated"),
      )
    } catch (err) {
      console.error(
        "Remove wishlist error:",
        err,
      )

      setActionError(
        err.message ||
          "Unable to remove product.",
      )
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (product) => {
    try {
      setCartId(product.id)
      setMessage("")
      setActionError("")

      if (product.stock_quantity <= 0) {
        throw new Error(
          "This product is currently out of stock.",
        )
      }

      const result = await addToCart(
        product.id,
        1,
      )

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to add product to cart",
        )
      }

      setMessage(
        `${product.name} added to your cart.`,
      )

      window.dispatchEvent(
        new Event("cartUpdated"),
      )
    } catch (err) {
      console.error(
        "Wishlist cart error:",
        err,
      )

      setActionError(
        err.message ||
          "Unable to add product to cart.",
      )
    } finally {
      setCartId(null)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Heart
                  size={22}
                  fill="currentColor"
                />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                  Your Collection
                </p>

                <h1 className="mt-1 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                  Wishlist
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-stone-500">
              Keep your favorite instruments saved
              here and come back whenever you're
              ready to add them to your collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Messages */}
        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
          >
            {message}
          </motion.div>
        )}

        {actionError && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {actionError}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-stone-200" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />

                  <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />

                  <div className="h-10 animate-pulse rounded-xl bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h2 className="text-lg font-bold text-red-800">
              Unable to load wishlist
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadWishlist}
              className="mt-5 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty Wishlist */}
        {!loading &&
          !error &&
          items.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
                <Heart size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-stone-950">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-stone-500">
                Save instruments you love by
                clicking the heart icon. They'll
                appear here for easy access later.
              </p>

              <Link
                to="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                Explore Instruments
                <ArrowRight size={17} />
              </Link>
            </motion.div>
          )}

        {/* Wishlist Items */}
        {!loading &&
          !error &&
          items.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  {items.length}{" "}
                  {items.length === 1
                    ? "instrument"
                    : "instruments"}{" "}
                  saved
                </p>

                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-amber-600"
                >
                  Continue Shopping
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => {
                  const product = item.products

                  if (!product) {
                    return null
                  }

                  const primaryImage =
                    product.product_images?.find(
                      (image) =>
                        image.is_primary,
                    ) ||
                    product.product_images?.[0]

                  const hasDiscount =
                    product.discount_price !==
                      null &&
                    Number(
                      product.discount_price,
                    ) <
                      Number(product.price)

                  const displayPrice =
                    hasDiscount
                      ? Number(
                          product.discount_price,
                        )
                      : Number(product.price)

                  const isOutOfStock =
                    product.stock_quantity <= 0

                  return (
                    <motion.article
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      whileHover={{
                        y: -5,
                      }}
                      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-stone-100">
                        {primaryImage ? (
                          <img
                            src={
                              primaryImage.image_url
                            }
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
                            {Math.round(
                              ((Number(
                                product.price,
                              ) -
                                Number(
                                  product.discount_price,
                                )) /
                                Number(
                                  product.price,
                                )) *
                                100,
                            )}
                            % OFF
                          </span>
                        )}

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              product.id,
                            )
                          }
                          disabled={
                            removingId ===
                            product.id
                          }
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-600 opacity-100 shadow-md backdrop-blur transition-all duration-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={17}
                            className={
                              removingId ===
                              product.id
                                ? "animate-pulse"
                                : ""
                            }
                          />
                        </button>

                        {/* Wishlist Heart */}
                        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm">
                          <Heart
                            size={18}
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        {product.categories?.name && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                            {product.categories.name}
                          </p>
                        )}

                        <Link
                          to={`/products/${product.slug}`}
                        >
                          <h2 className="mt-2 line-clamp-2 text-lg font-bold text-stone-900 transition-colors hover:text-amber-600">
                            {product.name}
                          </h2>
                        </Link>

                        {product.brand && (
                          <p className="mt-1 text-sm text-stone-500">
                            {product.brand}
                          </p>
                        )}

                        {/* Price */}
                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-xl font-bold text-stone-950">
                            ₹
                            {displayPrice.toLocaleString(
                              "en-IN",
                            )}
                          </span>

                          {hasDiscount && (
                            <span className="text-sm text-stone-400 line-through">
                              ₹
                              {Number(
                                product.price,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          )}
                        </div>

                        {/* Stock */}
                        <div className="mt-3">
                          {isOutOfStock ? (
                            <p className="text-sm font-medium text-red-600">
                              Out of stock
                            </p>
                          ) : product.stock_quantity <=
                            5 ? (
                            <p className="text-sm font-medium text-orange-600">
                              Only{" "}
                              {
                                product.stock_quantity
                              }{" "}
                              left
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-green-600">
                              In stock
                            </p>
                          )}
                        </div>

                        {/* Add To Cart */}
                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(
                              product,
                            )
                          }
                          disabled={
                            isOutOfStock ||
                            cartId === product.id
                          }
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
                        >
                          <ShoppingCart
                            size={17}
                            className={
                              cartId === product.id
                                ? "animate-pulse"
                                : ""
                            }
                          />

                          {isOutOfStock
                            ? "Out of stock"
                            : cartId === product.id
                              ? "Adding..."
                              : "Add to cart"}
                        </button>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </>
          )}
      </section>
    </main>
  )
}

export default Wishlist