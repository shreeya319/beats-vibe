import ProductCard from "./ProductCard"

function ProductGrid({
  products,
  loading,
  featuredLayout = false,
}) {
  const gridClass = featuredLayout
    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    : "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: featuredLayout ? 4 : 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-stone-200" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />

                <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />

                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />

                <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200" />
              </div>
            </div>
          ),
        )}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <h3 className="text-xl font-bold text-stone-900">
          No instruments found
        </h3>

        <p className="mt-2 text-sm text-stone-500">
          Try changing your search or filter options.
        </p>
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductGrid