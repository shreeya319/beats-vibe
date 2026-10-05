import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { motion } from "motion/react"

const benefits = [
  {
    icon: BadgeCheck,
    title: "Quality Instruments",
    description:
      "Carefully selected instruments from trusted brands, built for reliable performance and lasting use.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Shop with confidence using a secure checkout experience designed to keep your payment information protected.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Get your instruments delivered safely to your doorstep with dependable shipping and careful handling.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Need help choosing an instrument? Our support team is here to help you make the right choice.",
  },
]

function WhyChooseUs() {
  return (
    <section className="bg-stone-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Everything you need for your musical journey
          </h2>

          <p className="mt-4 text-stone-500">
            We make finding and buying your next instrument simple,
            reliable, and enjoyable.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon

            return (
              <motion.article
                key={benefit.title}
                initial={{
                  opacity: 0,
                  y: 25,
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
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -5,
                }}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-stone-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  {benefit.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs