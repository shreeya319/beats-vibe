import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getOrderById } from "../services/orderService"

function OrderDetails() {
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getOrderById(id)

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load order",
        )
      }

      const orderData =
        result.data?.order || result.data

      setOrder(orderData)
    } catch (err) {
      console.error("Order details error:", err)

      setError(
        err.message || "Unable to load order details.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN")

  const formatDate = (date) => {
    if (!date) return "—"

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    )
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700"

      case "Shipped":
        return "bg-blue-50 text-blue-700"

      case "Processing":
        return "bg-purple-50 text-purple-700"

      case "Confirmed":
        return "bg-amber-50 text-amber-700"

      case "Cancelled":
        return "bg-red-50 text-red-700"

      case "Pending":
      default:
        return "bg-stone-100 text-stone-700"
    }
  }

  const getProductImage = (item) => {
    const images = item.products?.product_images || []

    const primaryImage = images.find(
      (image) => image.is_primary,
    )

    return (
      primaryImage?.image_url ||
      images[0]?.image_url ||
      "/placeholder-product.jpg"
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded bg-stone-200" />
          <div className="mt-4 h-10 w-64 rounded-lg bg-stone-200" />

          <div className="mt-8 h-32 rounded-2xl bg-white" />

          <div className="mt-6 h-72 rounded-2xl bg-white" />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Package size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-stone-950">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={fetchOrder}
              className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              Try Again
            </button>

            <Link
              to="/orders"
              className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              My Orders
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!order) {
    return null
  }

  const orderItems =
    order.order_items ||
    order.items ||
    []

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-600"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Order Details
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                {order.order_number ||
                  `#${order.id}`}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                <CalendarDays size={16} />
                Ordered on{" "}
                {formatDate(order.created_at)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusClasses(
                order.status,
              )}`}
            >
              {order.status || "Pending"}
            </span>
          </div>
        </div>

        {/* Order Status */}
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              {order.status === "Delivered" ? (
                <CheckCircle2 size={22} />
              ) : (
                <Clock3 size={22} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-stone-950">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Your order is currently{" "}
                <span className="font-semibold text-stone-800">
                  {order.status || "Pending"}
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_350px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Products */}
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={20}
                  className="text-amber-600"
                />

                <h2 className="text-xl font-bold text-stone-950">
                  Ordered Items
                </h2>
              </div>

              {orderItems.length === 0 ? (
                <p className="mt-6 text-sm text-stone-500">
                  No order items found.
                </p>
              ) : (
                <div className="mt-6 divide-y divide-stone-100">
                  {orderItems.map((item) => {
                    const itemTotal =
                      Number(
                        item.subtotal,
                      ) ||
                      Number(
                        item.unit_price,
                      ) *
                        Number(item.quantity)

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        {/* Image */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-28">
                          <img
                            src={getProductImage(
                              item,
                            )}
                            alt={
                              item.product_name
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-stone-950">
                            {item.product_name}
                          </h3>

                          <p className="mt-1 text-sm text-stone-500">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            Unit price: ₹
                            {formatPrice(
                              item.unit_price,
                            )}
                          </p>
                        </div>

                        {/* Total */}
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-stone-400">
                            Subtotal
                          </p>

                          <p className="mt-1 font-bold text-stone-950">
                            ₹
                            {formatPrice(
                              itemTotal,
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin
                  size={20}
                  className="text-amber-600"
                />

                <h2 className="text-xl font-bold text-stone-950">
                  Delivery Address
                </h2>
              </div>

              <div className="mt-5 rounded-xl bg-stone-50 p-5 text-sm leading-6">
                <p className="font-bold text-stone-900">
                  {order.shipping_name ||
                    "—"}
                </p>

                {order.shipping_phone && (
                  <p className="text-stone-600">
                    {order.shipping_phone}
                  </p>
                )}

                <p className="mt-2 text-stone-600">
                  {order.shipping_address ||
                    "—"}
                </p>

                <p className="text-stone-600">
                  {order.shipping_city
                    ? `${order.shipping_city}, `
                    : ""}
                  {order.shipping_state || ""}
                  {order.shipping_postal_code
                    ? ` - ${order.shipping_postal_code}`
                    : ""}
                </p>

                <p className="text-stone-600">
                  {order.shipping_country ||
                    "India"}
                </p>
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-950">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-stone-900">
                    ₹
                    {formatPrice(
                      order.subtotal,
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">
                    Shipping
                  </span>

                  <span className="font-semibold text-green-600">
                    {Number(
                      order.shipping_fee || 0,
                    ) === 0
                      ? "Free"
                      : `₹${formatPrice(
                          order.shipping_fee,
                        )}`}
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
                  {formatPrice(
                    order.total_amount,
                  )}
                </span>
              </div>
            </section>

            {/* Payment */}
            <section className="mt-4 rounded-2xl bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                Payment Information
              </p>

              <div className="mt-3 space-y-1 text-sm text-amber-800/80">
                <p>
                  Method:{" "}
                  <span className="font-semibold">
                    {order.payment_method ||
                      "Cash on Delivery"}
                  </span>
                </p>

                {order.payment_status && (
                  <p>
                    Status:{" "}
                    <span className="font-semibold">
                      {order.payment_status}
                    </span>
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default OrderDetails