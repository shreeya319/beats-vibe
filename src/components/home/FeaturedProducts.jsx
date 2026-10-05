import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../products/ProductCard"
import { getProducts } from "../../services/productService"

function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ==========================================================
  // LOAD FEATURED PRODUCTS
  // ==========================================================

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const result = await getProducts({
          search: "",
          category: "",
          sort: "newest",
          page: 1,
          limit: 8,
          featured: true,
        })

        console.log(
          "Featured products result:",
          result,
        )

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to load featured products",
          )
        }

        setProducts(result.data || [])
      } catch (error) {
        console.error(
          "Featured products error:",
          error,
        )

        setProducts([])
        setError(
          error.message ||
            "Unable to load featured products.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ======================================================
            SECTION HEADER
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
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-amber-500"
              />

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                Our Selection
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-4 max-w-2xl text-stone-500">
              Discover some of our most popular and
              carefully selected instruments.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-950 hover:bg-stone-950 hover:text-white"
          >
            View All Products
            <ArrowRight size={17} />
          </Link>
        </motion.div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <h3 className="font-semibold text-red-800">
              Unable to load featured products
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                >
                  {/* Image Skeleton */}
                  <div className="aspect-square animate-pulse bg-stone-200" />

                  {/* Content Skeleton */}
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />

                    <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />

                    <div className="h-5 w-1/3 animate-pulse rounded bg-stone-200" />

                    <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* ======================================================
            FEATURED PRODUCTS
        ====================================================== */}

        {!error &&
          !loading &&
          products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
            </div>
          )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!error &&
          !loading &&
          products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Sparkles size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-stone-900">
                No featured products
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Featured instruments will appear here
                when they are available.
              </p>

              <Link
                to="/shop"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                Browse All Instruments
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

      </div>
    </section>
  )
}

export default FeaturedProducts