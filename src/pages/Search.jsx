import { Search as SearchIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import ProductGrid from "../components/products/ProductGrid"
import { getProducts } from "../services/productService"

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(urlQuery)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  // ============================================================
  // SEARCH PRODUCTS
  // ============================================================

  const performSearch = async (searchValue) => {
    const searchTerm = searchValue.trim()

    if (!searchTerm) {
      setProducts([])
      setSearched(false)
      setError("")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")
      setSearched(true)

      console.log("Searching for:", searchTerm)

      const result = await getProducts({
        search: searchTerm,
        category: "",
        sort: "newest",
        page: 1,
        limit: 12,
      })

      console.log("Search API result:", result)

      if (!result.success) {
        throw new Error(
          result.message || "Failed to search products",
        )
      }

      setProducts(result.data || [])
    } catch (err) {
      console.error("Search products error:", err)

      setProducts([])
      setError(
        err.message || "Unable to search products.",
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // LOAD SEARCH FROM URL
  // ============================================================

  useEffect(() => {
    setQuery(urlQuery)

    if (urlQuery) {
      performSearch(urlQuery)
    } else {
      setProducts([])
      setSearched(false)
    }
  }, [urlQuery])

  // ============================================================
  // SUBMIT SEARCH
  // ============================================================

  const handleSubmit = (event) => {
    event.preventDefault()

    const searchTerm = query.trim()

    if (!searchTerm) {
      setSearchParams({})
      return
    }

    setSearchParams({
      q: searchTerm,
    })
  }

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const handleClear = () => {
    setQuery("")
    setProducts([])
    setSearched(false)
    setError("")
    setSearchParams({})
  }

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
            Search Products
          </h1>

          <p className="mt-4 max-w-2xl text-stone-500">
            Find the perfect instrument by name or brand.
          </p>

          {/* ====================================================
              SEARCH FORM
          ==================================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search instruments or brands..."
                className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-12 pr-11 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />

              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              <SearchIcon size={18} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================
          SEARCH RESULTS
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="font-semibold text-red-800">
              Search failed
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Initial State */}
        {!error && !searched && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <SearchIcon size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-stone-950">
              Search for an instrument
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              Search by instrument name or brand to find
              products from our collection.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
            >
              Browse All Instruments
            </Link>
          </div>
        )}

        {/* Loading */}
        {searched && loading && (
          <ProductGrid
            products={[]}
            loading={true}
          />
        )}

        {/* Results */}
        {!error &&
          searched &&
          !loading &&
          products.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm text-stone-500">
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </p>

                <h2 className="mt-1 text-xl font-bold text-stone-950">
                  Results for "{urlQuery}"
                </h2>
              </div>

              <ProductGrid
                products={products}
                loading={false}
              />
            </>
          )}

        {/* No Results */}
        {!error &&
          searched &&
          !loading &&
          products.length === 0 && (
            <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                <SearchIcon size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-stone-950">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                We couldn't find any products matching{" "}
                <span className="font-semibold text-stone-700">
                  "{urlQuery}"
                </span>
                .
              </p>

              <button
                type="button"
                onClick={handleClear}
                className="mt-6 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                Clear Search
              </button>
            </div>
          )}
      </section>
    </main>
  )
}

export default Search