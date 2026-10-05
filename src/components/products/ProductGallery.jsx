import { useEffect, useState } from "react"
import { motion } from "motion/react"

function ProductGallery({ images = [], productName }) {
  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order,
  )

  const primaryImage =
    sortedImages.find((image) => image.is_primary) ||
    sortedImages[0]

  const [selectedImage, setSelectedImage] = useState(primaryImage)

  useEffect(() => {
    setSelectedImage(
      sortedImages.find((image) => image.is_primary) ||
        sortedImages[0],
    )
  }, [images])

  if (!sortedImages.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-100 text-stone-400">
        No image available
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="aspect-square overflow-hidden rounded-3xl bg-white shadow-sm"
      >
        <img
          src={selectedImage.image_url}
          alt={
            selectedImage.alt_text ||
            productName
          }
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </motion.div>

      {sortedImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {sortedImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                selectedImage.id === image.id
                  ? "border-amber-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={image.image_url}
                alt={
                  image.alt_text ||
                  productName
                }
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery