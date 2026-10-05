import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Plus,
  ShoppingBag,
} from "lucide-react"

import {
  createAddress,
  getAddresses,
} from "../services/addressService"

import { createOrder } from "../services/orderService"

import { getCart } from "../services/cartService"

function Checkout() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [addresses, setAddresses] = useState([])

  const [selectedAddressId, setSelectedAddressId] =
    useState("")

  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)

  const [showAddressForm, setShowAddressForm] =
    useState(false)

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  })

  // ==========================================================
  // LOAD CHECKOUT DATA
  // ==========================================================

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true)
        setError("")

        const [cartResult, addressResult] =
          await Promise.all([
            getCart(),
            getAddresses(),
          ])

        if (!cartResult.success) {
          throw new Error(
            cartResult.message ||
              "Failed to load cart",
          )
        }

        if (!addressResult.success) {
          throw new Error(
            addressResult.message ||
              "Failed to load addresses",
          )
        }

        const items = cartResult.data || []
        const savedAddresses =
          addressResult.data || []

        setCartItems(items)
        setAddresses(savedAddresses)

        if (savedAddresses.length > 0) {
          setSelectedAddressId(
            String(savedAddresses[0].id),
          )
        }
      } catch (err) {
        console.error(
          "Checkout loading error:",
          err,
        )

        setError(
          err.message ||
            "Unable to load checkout.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadCheckoutData()
  }, [])

  // ==========================================================
  // CART PRICE CALCULATIONS
  // ==========================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = item.products

      if (!product) {
        return total
      }

      const price =
        product.discount_price !== null &&
        Number(product.discount_price) <
          Number(product.price)
          ? Number(product.discount_price)
          : Number(product.price)

      return (
        total +
        price * Number(item.quantity)
      )
    }, 0)
  }, [cartItems])

  const shippingFee =
    subtotal >= 5000 ? 0 : 100

  const totalAmount =
    subtotal + shippingFee

  // ==========================================================
  // ADDRESS FORM CHANGE
  // ==========================================================

  const handleAddressChange = (event) => {
    const { name, value } = event.target

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ==========================================================
  // CREATE NEW ADDRESS
  // ==========================================================

  const handleCreateAddress = async (event) => {
    event.preventDefault()

    try {
      setError("")
      setMessage("")

      const result =
        await createAddress(addressForm)

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to create address",
        )
      }

      const newAddress = result.data

      setAddresses((current) => [
        ...current,
        newAddress,
      ])

      setSelectedAddressId(
        String(newAddress.id),
      )

      setAddressForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
      })

      setShowAddressForm(false)

      setMessage(
        "New shipping address added.",
      )
    } catch (err) {
      console.error(
        "Create checkout address error:",
        err,
      )

      setError(
        err.message ||
          "Unable to save address.",
      )
    }
  }

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handlePlaceOrder = async () => {
    try {
      setError("")
      setMessage("")

      if (!selectedAddressId) {
        setError(
          "Please select a shipping address.",
        )
        return
      }

      if (cartItems.length === 0) {
        setError(
          "Your cart is empty.",
        )
        return
      }

      setPlacingOrder(true)

      const result = await createOrder({
        address_id: Number(
          selectedAddressId,
        ),
        payment_method:
          "Cash on Delivery",
      })

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to place order",
        )
      }

      window.dispatchEvent(
        new Event("cartUpdated"),
      )

      // Backend may return either:
      // result.data.order
      // OR
      // result.data
      const order =
        result.data?.order ||
        result.data

      if (order?.id) {
        navigate(
          `/order-success/${order.id}`,
          {
            replace: true,
            state: {
              order,
            },
          },
        )
      } else {
        navigate("/orders", {
          replace: true,
        })
      }
    } catch (err) {
      console.error(
        "Place order error:",
        err,
      )

      setError(
        err.message ||
          "Unable to place order.",
      )
    } finally {
      setPlacingOrder(false)
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-sm text-stone-500">
              Loading checkout...
            </p>
          </div>
        </div>
      </main>
    )
  }

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <ShoppingBag size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-stone-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-stone-500">
            Add some instruments to your cart
            before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  // ==========================================================
  // CHECKOUT
  // ==========================================================

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 transition hover:text-stone-950"
          >
            <ChevronLeft size={17} />
            Back to Cart
          </Link>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Complete your order
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div className="space-y-6">
            {/* Shipping Address */}
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <MapPin size={19} />
                    </div>

                    <h2 className="text-xl font-bold text-stone-950">
                      Shipping Address
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-stone-500">
                    Select where you want your
                    order delivered.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError("")
                    setShowAddressForm(
                      (current) => !current,
                    )
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="mt-6 space-y-3">
                  {addresses.map((address) => {
                    const selected =
                      String(
                        selectedAddressId,
                      ) ===
                      String(address.id)

                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() =>
                          setSelectedAddressId(
                            String(
                              address.id,
                            ),
                          )
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-100"
                            : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-amber-600 bg-amber-600 text-white"
                                : "border-stone-300"
                            }`}
                          >
                            {selected && (
                              <Check
                                size={13}
                                strokeWidth={3}
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-stone-900">
                              {address.name}
                            </p>

                            <p className="mt-1 text-sm text-stone-500">
                              {address.phone}
                            </p>

                            <p className="mt-2 text-sm leading-6 text-stone-600">
                              {address.address}
                              <br />
                              {address.city},{" "}
                              {address.state}
                              <br />
                              {
                                address.postal_code
                              }
                              ,{" "}
                              {address.country}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* No Address */}
              {addresses.length === 0 && (
                <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                  <MapPin
                    size={28}
                    className="mx-auto text-stone-300"
                  />

                  <p className="mt-3 font-semibold text-stone-800">
                    No shipping address
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    Add an address to continue.
                  </p>
                </div>
              )}

              {/* New Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={
                    handleCreateAddress
                  }
                  className="mt-6 border-t border-stone-200 pt-6"
                >
                  <h3 className="text-lg font-bold text-stone-900">
                    Add New Address
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <input
                      name="name"
                      value={
                        addressForm.name
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Full name"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <input
                      name="phone"
                      value={
                        addressForm.phone
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Phone number"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <textarea
                      name="address"
                      value={
                        addressForm.address
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="House number, street, area"
                      rows={3}
                      required
                      className="resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 sm:col-span-2"
                    />

                    <input
                      name="city"
                      value={
                        addressForm.city
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="City"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <input
                      name="state"
                      value={
                        addressForm.state
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="State"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <input
                      name="postal_code"
                      value={
                        addressForm.postal_code
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Postal code"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <input
                      name="country"
                      value={
                        addressForm.country
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Country"
                      required
                      className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                    >
                      Save Address
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressForm(
                          false,
                        )
                      }
                      className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-stone-950">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Choose your preferred payment
                    method.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white">
                    <Check
                      size={13}
                      strokeWidth={3}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-stone-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      Pay when your order is
                      delivered.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-stone-400">
                Online payment will be available
                in a future update.
              </p>
            </section>
          </div>

          {/* ==================================================
              RIGHT SIDE — ORDER SUMMARY
          ================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-950">
                Order Summary
              </h2>

              {/* Products */}
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => {
                  const product =
                    item.products

                  if (!product) {
                    return null
                  }

                  const price =
                    product.discount_price !==
                      null &&
                    Number(
                      product.discount_price,
                    ) <
                      Number(
                        product.price,
                      )
                      ? Number(
                          product.discount_price,
                        )
                      : Number(
                          product.price,
                        )

                  const itemTotal =
                    price *
                    Number(item.quantity)

                  const image =
                    product.product_images?.find(
                      (img) =>
                        img.is_primary,
                    ) ||
                    product
                      .product_images?.[0]

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {image ? (
                          <img
                            src={
                              image.image_url
                            }
                            alt={
                              image.alt_text ||
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-stone-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-stone-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Qty:{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-800">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="mt-6 border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-stone-800">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Shipping
                  </span>

                  <span className="font-semibold text-stone-800">
                    {shippingFee === 0
                      ? "FREE"
                      : `₹${shippingFee.toLocaleString(
                          "en-IN",
                        )}`}
                  </span>
                </div>

                {shippingFee === 0 && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Free shipping on orders
                    above ₹5,000
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5">
                  <span className="text-lg font-bold text-stone-950">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-stone-950">
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  placingOrder ||
                  !selectedAddressId
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placingOrder ? (
                  "Placing Order..."
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Place Order
                  </>
                )}
              </button>

              {!selectedAddressId && (
                <p className="mt-3 text-center text-xs font-medium text-red-500">
                  Please select a shipping
                  address.
                </p>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-stone-400">
                By placing your order, you agree
                to our terms and conditions.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Checkout