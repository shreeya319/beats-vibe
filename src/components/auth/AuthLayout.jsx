import { motion } from "motion/react"

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/80 shadow-2xl shadow-black/30 lg:grid-cols-2">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-12 lg:flex lg:flex-col lg:justify-between"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                Musical Instruments Store
              </p>

              <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight">
                Find the sound that feels like you.
              </h2>

              <p className="mt-6 max-w-md leading-7 text-stone-300">
                Explore instruments, discover your favorites, and build your
                musical journey with us.
              </p>
            </div>

            <p className="text-sm text-stone-400">
              Quality instruments. Trusted shopping. Your music.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-10 lg:p-12"
          >
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-50">
                  {title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-stone-400">
                  {subtitle}
                </p>
              </div>

              {children}

              {footer && (
                <div className="mt-8 border-t border-stone-800 pt-6 text-center text-sm text-stone-400">
                  {footer}
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout