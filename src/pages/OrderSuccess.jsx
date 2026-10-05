import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"

function OrderSuccess() {
  const { id } = useParams()
  const location = useLocation()

  const order = location.state?.order

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN")

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Card */}
        <section className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={42} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Order Confirmed
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-stone-500">
            Your order has been successfully placed. We will process it
            shortly and keep you updated about its status.
          </p>

          {/* Order Information */}
          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-stone-50 p-6 text-left">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Order Number
                </p>

                <p className="mt-1 font-bold text-stone-900">
                  {order?.order_number || `#${id}`}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Status
                </p>

                <p className="mt-1 font-bold text-amber-600">
                  {order?.status || "Pending"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Payment
                </p>

                <p className="mt-1 font-semibold text-stone-800">
                  {order?.payment_method || "Cash on Delivery"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Total Amount
                </p>

                <p className="mt-1 font-bold text-stone-950">
                  ₹{formatPrice(order?.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order?.shipping_address && (
            <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-stone-200 p-6 text-left">
              <div className="flex items-center gap-2">
                <Package size={19} className="text-amber-600" />

                <h2 className="font-bold text-stone-950">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-3 text-sm leading-6 text-stone-600">
                <p className="font-semibold text-stone-900">
                  {order.shipping_name}
                </p>

                <p>{order.shipping_phone}</p>

                <p>{order.shipping_address}</p>

                <p>
                  {order.shipping_city},{" "}
                  {order.shipping_state} -{" "}
                  {order.shipping_postal_code}
                </p>

                <p>{order.shipping_country}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={`/orders/${id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              View Order
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OrderSuccess