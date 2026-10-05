import { ArrowRight, Music2 } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API_URL = "http://localhost:5000/api"

function CategorySection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/categories`,
        )

        if (!response.ok) {
          throw new Error("Failed to load categories")
        }

        const result = await response.json()

        if (result.success) {
          setCategories(result.data || [])
        }
      } catch (error) {
        console.error(
          "Home categories error:",
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // ============================================================
  // SHOW ONLY 4 CATEGORIES ON HOME PAGE
  // ============================================================

  const homeCategories = categories.slice(0, 4)

  return (
    <section className="bg-stone-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            SECTION HEADING
        ====================================================== */}

        <motion.div
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Explore Collection
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-stone-500">
            Find the right instrument for your
            musical journey from our carefully
            organized collections.
          </p>
        </motion.div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-stone-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-32 animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-full animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* ======================================================
            FOUR HOME CATEGORIES
        ====================================================== */}

        {!loading &&
          homeCategories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {homeCategories.map(
                (category, index) => (
                  <motion.article
                    key={category.id}
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
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  >
                    <Link
                      to={`/shop?category=${category.id}`}
                    >
                      {/* Image */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-stone-300">
                            <Music2 size={48} />
                          </div>
                        )}

                        {/* Overlay */}

                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />

                        {/* Category Name */}

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-xl font-bold text-white">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}

                      <div className="flex items-center justify-between p-5">
                        <span className="text-sm font-semibold text-stone-700 transition-colors group-hover:text-amber-600">
                          Explore Category
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-stone-950">
                          <ArrowRight
                            size={17}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ),
              )}
            </div>
          )}

        {/* ======================================================
            VIEW ALL CATEGORIES
        ====================================================== */}

        {!loading &&
          categories.length > 4 && (
            <div className="mt-10 text-center">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
              >
                View All Categories
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

      </div>
    </section>
  )
}

export default CategorySection