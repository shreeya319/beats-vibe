import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { useSearchParams } from "react-router-dom"
import ProductFilters from "../components/products/ProductFilters"
import ProductGrid from "../components/products/ProductGrid"
import { getProducts } from "../services/productService"

const API_URL = "http://localhost:5000/api"

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ============================================================
  // CATEGORY FROM URL
  // ============================================================

  const categoryFromUrl = searchParams.get("category") || ""

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(categoryFromUrl)
  const [sort, setSort] = useState("newest")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  // ============================================================
  // KEEP CATEGORY STATE IN SYNC WITH URL
  // ============================================================

  useEffect(() => {
    setCategory(categoryFromUrl)

    setPagination((current) => ({
      ...current,
      page: 1,
    }))
  }, [categoryFromUrl])

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/categories`,
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load categories",
          )
        }

        const result = await response.json()

        if (result.success) {
          setCategories(result.data || [])
        }
      } catch (err) {
        console.error(
          "Category loading error:",
          err,
        )
      }
    }

    loadCategories()
  }, [])

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const result = await getProducts({
          search,
          category,
          sort,
          page: pagination.page,
          limit: pagination.limit,
        })

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load products",
          )
        }

        setProducts(result.data || [])

        setPagination((current) => ({
          ...current,
          ...(result.pagination || {}),
        }))
      } catch (err) {
        console.error(
          "Product loading error:",
          err,
        )

        setError(
          err.message ||
            "Unable to load products.",
        )

        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [
    search,
    category,
    sort,
    pagination.page,
    pagination.limit,
  ])

  // ============================================================
  // SEARCH CHANGE
  // ============================================================

  const handleSearchChange = (value) => {
    setSearch(value)

    setPagination((current) => ({
      ...current,
      page: 1,
    }))
  }

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (value) => {
    setCategory(value)

    setPagination((current) => ({
      ...current,
      page: 1,
    }))

    // Keep URL synchronized with selected category
    if (value) {
      setSearchParams({
        category: value,
      })
    } else {
      setSearchParams({})
    }
  }

  // ============================================================
  // SORT CHANGE
  // ============================================================

  const handleSortChange = (value) => {
    setSort(value)

    setPagination((current) => ({
      ...current,
      page: 1,
    }))
  }

  // ============================================================
  // PAGE CHANGE
  // ============================================================

  const changePage = (page) => {
    setPagination((current) => ({
      ...current,
      page,
    }))

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ============================================================
  // FIND CURRENT CATEGORY NAME
  // ============================================================

  const selectedCategory = categories.find(
    (item) =>
      String(item.id) === String(category),
  )

  return (
    <main className="min-h-screen bg-stone-50">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
              Musical Instruments
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              {selectedCategory
                ? selectedCategory.name
                : "Explore our collection"}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-500">
              {selectedCategory
                ? `Explore our ${selectedCategory.name.toLowerCase()} collection.`
                : "Discover instruments for practice, performance and every stage of your musical journey."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          FILTERS + PRODUCTS
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        <div className="mt-8">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <h2 className="font-semibold text-red-800">
                Unable to load products
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          ) : (
            <>
              {!loading && (
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-stone-500">
                    {pagination.total}{" "}
                    {pagination.total === 1
                      ? "instrument"
                      : "instruments"}
                  </p>
                </div>
              )}

              <ProductGrid
                products={products}
                loading={loading}
              />

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {!loading &&
                pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from(
                      {
                        length:
                          pagination.totalPages,
                      },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          changePage(page)
                        }
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                          page ===
                          pagination.page
                            ? "bg-stone-950 text-white"
                            : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Shop