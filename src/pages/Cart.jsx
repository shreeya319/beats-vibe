import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Link,
  useNavigate,
} from "react-router-dom"

import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService"

function Cart() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [summary, setSummary] = useState({
    itemCount: 0,
    uniqueItems: 0,
    subtotal: 0,
  })

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState("")

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getCart()

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load cart",
        )
      }

      setCartItems(result.data || [])

      setSummary(
        result.summary || {
          itemCount: 0,
          uniqueItems: 0,
          subtotal: 0,
        },
      )
    } catch (err) {
      console.error("Cart loading error:", err)

      setError(
        err.message || "Unable to load your cart.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const getProductPrice = (product) => {
    if (
      product.discount_price !== null &&
      Number(product.discount_price) <
        Number(product.price)
    ) {
      return Number(product.discount_price)
    }

    return Number(product.price)
  }

  const getPrimaryImage = (product) => {
    const images =
      product?.product_images || []

    const primaryImage = images.find(
      (image) => image.is_primary,
    )

    return (
      primaryImage?.image_url ||
      images[0]?.image_url ||
      "/placeholder-product.jpg"
    )
  }

  const handleQuantityChange = async (
    item,
    newQuantity,
  ) => {
    if (newQuantity < 1) {
      return
    }

    if (
      newQuantity >
      item.products.stock_quantity
    ) {
      return
    }

    try {
      setUpdatingId(item.id)
      setError("")

      const result =
        await updateCartItem(
          item.id,
          newQuantity,
        )

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update cart",
        )
      }

      await fetchCart()

      window.dispatchEvent(
        new Event("cartUpdated"),
      )
    } catch (err) {
      console.error(
        "Quantity update error:",
        err,
      )

      setError(
        err.message ||
          "Unable to update quantity.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (
    cartItemId,
  ) => {
    try {
      setRemovingId(cartItemId)
      setError("")

      const result =
        await removeCartItem(
          cartItemId,
        )

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to remove item",
        )
      }

      await fetchCart()

      window.dispatchEvent(
        new Event("cartUpdated"),
      )
    } catch (err) {
      console.error(
        "Remove cart item error:",
        err,
      )

      setError(
        err.message ||
          "Unable to remove item.",
      )
    } finally {
      setRemovingId(null)
    }
  }

  // ==========================================================
  // PROCEED TO CHECKOUT
  // ==========================================================

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      return
    }

    navigate("/checkout")
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 animate-pulse">
            <div className="h-10 w-48 rounded-lg bg-stone-200" />

            <div className="mt-3 h-5 w-72 rounded bg-stone-200" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-2xl bg-white"
                  />
                ),
              )}
            </div>

            <div className="h-80 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    )
  }

  // ==========================================================
  // CART ERROR
  // ==========================================================

  if (
    error &&
    cartItems.length === 0
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ShoppingBag size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-stone-950">
            Unable to load cart
          </h1>

          <p className="mt-2 text-stone-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCart}
            className="mt-6 rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ShoppingBag size={36} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-stone-950">
            Your cart is empty
          </h1>

          <p className="mt-3 max-w-md text-stone-500">
            Looks like you haven't added any
            musical instruments yet. Explore our
            collection and find something you love.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-7 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    )
  }

  // ==========================================================
  // CART
  // ==========================================================

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Your Cart
          </h1>

          <p className="mt-2 text-stone-500">
            {summary.itemCount}{" "}
            {summary.itemCount === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <section className="space-y-4">
            {cartItems.map((item) => {
              const product = item.products

              const price =
                getProductPrice(product)

              const itemSubtotal =
                price * item.quantity

              const isUpdating =
                updatingId === item.id

              const isRemoving =
                removingId === item.id

              return (
                <article
                  key={item.id}
                  className={`group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    isRemoving
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}

                    <Link
                      to={`/products/${product.slug}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-36 sm:w-36"
                    >
                      <img
                        src={getPrimaryImage(
                          product,
                        )}
                        alt={
                          product.product_images?.find(
                            (image) =>
                              image.is_primary,
                          )?.alt_text ||
                          product.name
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Product Information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {product.brand && (
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                              {product.brand}
                            </p>
                          )}

                          <Link
                            to={`/products/${product.slug}`}
                            className="mt-1 block text-lg font-bold text-stone-950 transition hover:text-amber-600 sm:text-xl"
                          >
                            {product.name}
                          </Link>

                          <p className="mt-1 text-sm text-stone-400">
                            SKU:{" "}
                            {product.sku}
                          </p>
                        </div>

                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              item.id,
                            )
                          }
                          disabled={
                            isRemoving ||
                            isUpdating
                          }
                          aria-label={`Remove ${product.name}`}
                          className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2
                            size={19}
                          />
                        </button>
                      </div>

                      {/* Price */}

                      <div className="mt-3 flex items-center gap-2">
                        <span className="font-bold text-stone-950">
                          ₹
                          {price.toLocaleString(
                            "en-IN",
                          )}
                        </span>

                        {Number(
                          product.discount_price,
                        ) <
                          Number(
                            product.price,
                          ) && (
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

                      {/* Bottom Row */}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity */}

                        <div className="flex items-center rounded-xl border border-stone-200">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity -
                                  1,
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity <=
                                1
                            }
                            className="p-2.5 text-stone-600 transition hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus
                              size={16}
                            />
                          </button>

                          <span className="min-w-9 text-center text-sm font-bold text-stone-900">
                            {isUpdating
                              ? "..."
                              : item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                item.quantity +
                                  1,
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity >=
                                product.stock_quantity
                            }
                            className="p-2.5 text-stone-600 transition hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus
                              size={16}
                            />
                          </button>
                        </div>

                        {/* Item Subtotal */}

                        <div className="text-right">
                          <p className="text-xs text-stone-400">
                            Item Total
                          </p>

                          <p className="text-lg font-bold text-stone-950">
                            ₹
                            {itemSubtotal.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-stone-950">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">
                    Items
                  </span>

                  <span className="font-semibold text-stone-900">
                    {summary.itemCount}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-stone-900">
                    ₹
                    {Number(
                      summary.subtotal,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">
                    Shipping
                  </span>

                  <span className="font-semibold text-green-600">
                    Free
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-stone-200" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-stone-950">
                  Total
                </span>

                <span className="text-2xl font-bold text-stone-950">
                  ₹
                  {Number(
                    summary.subtotal,
                  ).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              {/* ==================================================
                  PROCEED TO CHECKOUT
              ================================================== */}

              <button
                type="button"
                onClick={
                  handleProceedToCheckout
                }
                disabled={
                  cartItems.length === 0
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3.5 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <Link
                to="/shop"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-600"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </Link>
            </div>

            {/* Secure Shopping */}

            <div className="mt-4 rounded-2xl bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                Secure Shopping
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800/70">
                Your cart is securely linked to
                your account. Product availability
                is checked before quantity changes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Cart