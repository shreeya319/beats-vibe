import { ArrowRight, Music2 } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getCategories } from "../services/categoryService"


function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await getCategories()

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to load categories",
        )
      }

      setCategories(result.data || [])
    } catch (err) {
      console.error(
        "Category loading error:",
        err,
      )

      setCategories([])
      setError(
        err.message ||
          "Unable to load categories.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />

            <div className="mt-4 h-12 w-72 animate-pulse rounded-lg bg-stone-200" />

            <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-stone-200" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-stone-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-32 animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-full animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </main>
    )
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Music2 size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-stone-950">
            Unable to load categories
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCategories}
            className="mt-6 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (categories.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50">
        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
              Musical Instruments
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Categories
            </h1>

            <p className="mt-4 text-stone-500">
              Explore our musical instrument
              collection by category.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Music2 size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-stone-950">
              No categories available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              There are currently no active
              instrument categories available.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              Browse Instruments
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    )
  }

  // ============================================================
  // CATEGORY PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Musical Instruments
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Instrument Categories
          </h1>

          <p className="mt-4 max-w-2xl text-stone-500">
            Explore our collection by instrument
            category and find the right sound for
            you.
          </p>
        </div>
      </section>

      {/* ========================================================
          CATEGORIES
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.id}
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

              <Link
                to={`/shop?category=${category.id}`}
                className="block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stone-100 text-stone-300">
                      <Music2 size={48} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white">
                      {category.name}
                    </h2>
                  </div>
                </div>
              </Link>

              {/* Information */}

              {/* Information */}

<div className="p-5">
  <p className="text-sm leading-6 text-stone-500">
    Explore our{" "}
    {category.name.toLowerCase()}{" "}
    collection and discover
    instruments that match your
    style.
  </p>

  <Link
    to={`/shop?category=${category.id}`}
    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
  >
    View Products
    <ArrowRight size={17} />
  </Link>
</div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Categories