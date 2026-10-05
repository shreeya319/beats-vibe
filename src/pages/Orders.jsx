import {
  ArrowRight,
  CalendarDays,
  Package,
  ShoppingBag,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../services/orderService"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getOrders()

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load orders",
        )
      }

      setOrders(result.data || [])
    } catch (err) {
      console.error("Orders loading error:", err)

      setError(
        err.message || "Unable to load your orders.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN")

  const formatDate = (date) => {
    if (!date) {
      return "—"
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
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

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-stone-200" />

            <div className="mt-3 h-10 w-56 rounded-lg bg-stone-200" />

            <div className="mt-3 h-5 w-80 rounded bg-stone-200" />
          </div>

          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
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
            Unable to load orders
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-6 rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Package size={36} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            My Orders
          </p>

          <h1 className="mt-2 text-3xl font-bold text-stone-950">
            No orders yet
          </h1>

          <p className="mt-3 max-w-md text-stone-500">
            You haven't placed any orders yet.
            Explore our collection and find your
            next musical instrument.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-7 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            <ShoppingBag size={18} />
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            My Orders
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Your Orders
          </h1>

          <p className="mt-2 text-stone-500">
            View and track all your musical instrument
            orders.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              {/* Top */}
              <div className="flex flex-col gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Order Number
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-stone-950">
                    {order.order_number ||
                      `#${order.id}`}
                  </h2>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                    order.status,
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Details */}
              <div className="grid gap-5 py-5 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Order Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {formatDate(
                        order.created_at,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                    <Package size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-stone-800">
                      {order.payment_method ||
                        "Cash on Delivery"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    Total Amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-stone-950">
                    ₹
                    {formatPrice(
                      order.total_amount,
                    )}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              {order.shipping_address && (
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    {order.shipping_name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-stone-500">
                    {order.shipping_address},{" "}
                    {order.shipping_city},{" "}
                    {order.shipping_state} -{" "}
                    {order.shipping_postal_code}
                  </p>
                </div>
              )}

              {/* Bottom */}
              <div className="mt-5 flex justify-end">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                >
                  View Order
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Orders