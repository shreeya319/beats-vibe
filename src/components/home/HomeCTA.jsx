import { ArrowRight, Music2 } from "lucide-react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

function HomeCTA() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-3xl bg-stone-950 px-6 py-14 sm:px-12 sm:py-16 lg:px-16"
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
              <Music2 size={24} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Find Your Sound
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Your next musical journey starts here.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Whether you're just starting out or you're an experienced
              musician, discover instruments that match your passion,
              style, and sound.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
              >
                Explore Instruments
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-stone-500 hover:bg-white/5"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HomeCTA