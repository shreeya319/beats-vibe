import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const API_URL = "http://localhost:5000/api"

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ==========================================================
  // LOAD TESTIMONIALS
  // ==========================================================

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/testimonials`,
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load testimonials",
          )
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load testimonials",
          )
        }

        setTestimonials(result.data || [])
      } catch (err) {
        console.error(
          "Testimonials loading error:",
          err,
        )

        setError(
          err.message ||
            "Unable to load testimonials.",
        )
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  // ==========================================================
  // CREATE GROUPS OF 3
  // ==========================================================

  const testimonialGroups = []

  for (let i = 0; i < testimonials.length; i += 3) {
    testimonialGroups.push(
      testimonials.slice(i, i + 3),
    )
  }

  // ==========================================================
  // AUTOMATIC SLIDER
  // ==========================================================

  useEffect(() => {
    if (testimonialGroups.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setCurrentPage((page) =>
        page === testimonialGroups.length - 1
          ? 0
          : page + 1,
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonialGroups.length])

  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const previousPage = () => {
    setCurrentPage((page) =>
      page === 0
        ? testimonialGroups.length - 1
        : page - 1,
    )
  }

  // ==========================================================
  // NEXT
  // ==========================================================

  const nextPage = () => {
    setCurrentPage((page) =>
      page === testimonialGroups.length - 1
        ? 0
        : page + 1,
    )
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-stone-200" />

            <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded bg-stone-200" />

            <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-stone-200" />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-stone-100"
              />
            ))}
          </div>

        </div>
      </section>
    )
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-800">
              Unable to load testimonials
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>

        </div>
      </section>
    )
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (!testimonials.length) {
    return null
  }

  const activeGroup =
    testimonialGroups[currentPage] || []

  return (
    <section className="relative overflow-hidden bg-stone-100 py-20 sm:py-24">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
            Customer Experiences
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-stone-500">
            Hear from musicians and music lovers who
            found their perfect instrument with us.
          </p>
        </motion.div>

        {/* ====================================================
            TESTIMONIAL SLIDER
        ==================================================== */}

        <div className="relative mt-12">

          <AnimatePresence mode="wait">

            <motion.div
              key={currentPage}
              initial={{
                opacity: 0,
                x: 60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -60,
              }}
              transition={{
                duration: 0.5,
              }}
              className="grid gap-6 md:grid-cols-3"
            >

              {activeGroup.map(
                (testimonial) => (
                  <motion.article
                    key={testimonial.id}
                    whileHover={{
                      y: -5,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="flex min-h-[310px] flex-col rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8"
                  >

                    {/* Quote */}

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <Quote size={21} />
                      </div>

                      {/* Rating */}

                      <div className="flex gap-1">
                        {Array.from(
                          {
                            length: 5,
                          },
                          (_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={
                                index <
                                Number(
                                  testimonial.rating,
                                )
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-stone-300"
                              }
                            />
                          ),
                        )}
                      </div>

                    </div>

                    {/* Review */}

                    <blockquote className="mt-7 flex-1 text-base leading-7 text-stone-600">
                      "{testimonial.review}"
                    </blockquote>

                    {/* Customer */}

                    <div className="mt-7 border-t border-stone-100 pt-5">

                      <p className="font-bold text-stone-950">
                        {testimonial.customer_name}
                      </p>

                      {testimonial.customer_role && (
                        <p className="mt-1 text-sm text-stone-500">
                          {testimonial.customer_role}
                        </p>
                      )}

                    </div>

                  </motion.article>
                ),
              )}

            </motion.div>

          </AnimatePresence>

          {/* ==================================================
              PREVIOUS BUTTON
          ================================================== */}

          {testimonialGroups.length > 1 && (
            <button
              type="button"
              onClick={previousPage}
              aria-label="Previous testimonials"
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-md transition hover:bg-stone-950 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* ==================================================
              NEXT BUTTON
          ================================================== */}

          {testimonialGroups.length > 1 && (
            <button
              type="button"
              onClick={nextPage}
              aria-label="Next testimonials"
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-md transition hover:bg-stone-950 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          )}

        </div>

        {/* ====================================================
            SLIDE INDICATORS
        ==================================================== */}

        {testimonialGroups.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {testimonialGroups.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setCurrentPage(index)
                  }
                  aria-label={`Go to testimonial group ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? "w-8 bg-amber-500"
                      : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ),
            )}
          </div>
        )}

      </div>
    </section>
  )
}

export default Testimonials