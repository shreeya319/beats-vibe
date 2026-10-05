import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ProductGallery from "../components/products/ProductGallery"
import ProductInfo from "../components/products/ProductInfo"
import { getProductBySlug } from "../services/productService"

function ProductDetails() {
  const { slug } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError("")

        const result =
          await getProductBySlug(slug)

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load product",
          )
        }

        setProduct(result.data)
      } catch (err) {
        console.error(
          "Product details error:",
          err,
        )

        setError(
          err.message ||
            "Unable to load product.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-stone-200" />

            <div className="space-y-5">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-10 w-48 animate-pulse rounded bg-stone-200" />
              <div className="h-24 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-stone-950">
            Product not found
          </h1>

          <p className="mt-3 text-stone-500">
            {error ||
              "The product you are looking for does not exist."}
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-amber-600"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.product_images}
            productName={product.name}
          />

          <ProductInfo product={product} />
        </div>

        {product.product_specifications?.length > 0 && (
          <motion.section
            initial={{
              opacity: 0,
              y: 20,
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
              duration: 0.5,
            }}
            className="mt-16 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-bold text-stone-950">
              Specifications
            </h2>

            <div className="mt-6 divide-y divide-stone-100">
              {product.product_specifications.map(
                (specification) => (
                  <div
                    key={specification.id}
                    className="grid gap-2 py-4 sm:grid-cols-2"
                  >
                    <span className="font-semibold text-stone-700">
                      {specification.specification_name}
                    </span>

                    <span className="text-stone-500">
                      {specification.specification_value}
                    </span>
                  </div>
                ),
              )}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  )
}

export default ProductDetails