
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import FeaturedProducts from "../components/home/FeaturedProducts"
import CategorySection from "../components/home/CategorySection"
import WhyChooseUs from "../components/home/WhyChooseUs"
import HomeCTA from "../components/home/HomeCTA"
import Testimonials from "../components/home/Testimonials"

const API_URL = "http://localhost:5000/api"

function Home() {
  const [slides, setSlides] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ==========================================================
  // LOAD HERO SLIDES
  // ==========================================================

  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/home/hero-slides`,
        )

        if (!response.ok) {
          throw new Error("Failed to load hero slides")
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load hero slides",
          )
        }

        setSlides(result.data || [])
      } catch (err) {
        console.error("Hero slides loading error:", err)

        setError(
          err.message || "Unable to load hero slides.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadHeroSlides()
  }, [])

  // ==========================================================
  // AUTOMATIC SLIDER
  // ==========================================================

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1
          ? 0
          : current + 1,
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  // ==========================================================
  // SLIDE CONTROLS
  // ==========================================================

  const goToPrevious = () => {
    setCurrentSlide((current) =>
      current === 0
        ? slides.length - 1
        : current - 1,
    )
  }

  const goToNext = () => {
    setCurrentSlide((current) =>
      current === slides.length - 1
        ? 0
        : current + 1,
    )
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const activeSlide = slides[currentSlide]

  return (
    <main className="min-h-screen bg-stone-50">

      {/* ========================================================
          HERO SLIDER
      ======================================================== */}

      <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-stone-950">

        {/* ======================================================
            LOADING STATE
        ====================================================== */}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-700 border-t-amber-500" />

              <p className="mt-4 text-sm text-stone-400">
                Loading...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            ERROR STATE
        ====================================================== */}

        {!loading && error && (
          <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                Musical Instruments
              </p>

              <h1 className="mt-4 text-3xl font-bold text-white">
                Unable to load hero section
              </h1>

              <p className="mt-3 text-stone-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            SLIDES
        ====================================================== */}

        {!loading && !error && slides.length > 0 && (
          <AnimatePresence mode="wait">

            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >

              {/* ==================================================
                  BACKGROUND IMAGE
              ================================================== */}

              <img
                src={activeSlide.image_url}
                alt={
                  activeSlide.alt_text ||
                  activeSlide.title ||
                  "Musical instruments"
                }
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* ==================================================
                  LIGHT DARK OVERLAY
                  Keeps the image clear and visible
              ================================================== */}

              <div className="absolute inset-0 bg-black/20" />

              {/* ==================================================
                  SOFT GRADIENT
                  Only slightly darkens the left side for text
              ================================================== */}

              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/45 via-stone-950/15 to-transparent" />

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-12">

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                  }}
                  className="max-w-2xl"
                >

                  {/* ==================================================
                      EYEBROW
                  ================================================== */}

                  {activeSlide.eyebrow && (
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-sm">
                      {activeSlide.eyebrow}
                    </p>
                  )}

                  {/* ==================================================
                      TITLE
                  ================================================== */}

                  <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {activeSlide.title}
                  </h1>

                  {/* ==================================================
                      DESCRIPTION
                  ================================================== */}

                  {activeSlide.description && (
                    <p className="mt-5 max-w-lg text-sm leading-7 text-stone-100 sm:text-base sm:leading-8">
                      {activeSlide.description}
                    </p>
                  )}

                  
                </motion.div>

              </div>

            </motion.div>

          </AnimatePresence>
        )}

        {/* ======================================================
            PREVIOUS BUTTON
        ====================================================== */}

        {!loading &&
          !error &&
          slides.length > 1 && (
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950 sm:left-6 sm:h-11 sm:w-11"
            >
              <ChevronLeft size={21} />
            </button>
          )}

        {/* ======================================================
            NEXT BUTTON
        ====================================================== */}

        {!loading &&
          !error &&
          slides.length > 1 && (
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950 sm:right-6 sm:h-11 sm:w-11"
            >
              <ChevronRight size={21} />
            </button>
          )}

        {/* ======================================================
            SLIDE INDICATORS
        ====================================================== */}

        {!loading &&
          !error &&
          slides.length > 1 && (
            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-amber-500"
                      : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}

      </section>

      {/* ========================================================
          FEATURED PRODUCTS
      ======================================================== */}

      <FeaturedProducts />

      <CategorySection/>

      {/* ========================================================
          WHY CHOOSE US
      ======================================================== */}

      <WhyChooseUs />

      {/* ========================================================
          CUSTOMER TESTIMONIALS
      ======================================================== */}

      <Testimonials />

      {/* ========================================================
          PROMOTIONAL CTA
      ======================================================== */}

      <HomeCTA />

    </main>
  )
}

export default Home

