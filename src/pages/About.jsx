import { useEffect, useState } from "react"
import {
  Award,
  Music,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react"
import { Link } from "react-router-dom"

const API_URL = "http://localhost:5000/api"

function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ============================================================
  // FIXED WHY CHOOSE US FEATURES
  // These are intentionally not stored in the database.
  // ============================================================

  const features = [
    {
      icon: Music,
      title: "Quality Instruments",
      description:
        "We bring together carefully selected musical instruments suitable for beginners, enthusiasts, and experienced musicians.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Shopping",
      description:
        "Shop with confidence through a secure and reliable online shopping experience.",
    },
    {
      icon: ShoppingBag,
      title: "Wide Collection",
      description:
        "Explore a growing collection of instruments across different categories, styles, and price ranges.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description:
        "We aim to make your shopping experience simple, convenient, and dependable from order to delivery.",
    },
  ]

  // ============================================================
  // FETCH ABOUT US DATA
  // ============================================================

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/about`,
        )

        const contentType =
          response.headers.get("content-type") || ""

        if (!contentType.includes("application/json")) {
          throw new Error(
            "Server returned an invalid response. Make sure the backend is running on port 5000.",
          )
        }

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load About Us information.",
          )
        }

        setAbout(result.data)
      } catch (err) {
        console.error(
          "About Us loading error:",
          err,
        )

        setError(
          err.message ||
            "Unable to load About Us information.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [])

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

          <p className="mt-4 text-sm text-stone-500">
            Loading About Us...
          </p>
        </div>
      </main>
    )
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-800">
            Unable to Load About Us
          </h2>

          <p className="mt-3 text-sm leading-6 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!about) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-950">
            About Us information not found
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Please add About Us information from the admin panel.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative min-h-[500px] overflow-hidden">

        {/* Hero Background Image */}

        {about.hero_image_url ? (
          <img
            src={about.hero_image_url}
            alt="Musical instruments"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-900" />
        )}

        {/* Light Dark Overlay */}

        <div className="absolute inset-0 bg-stone-950/25" />

        {/* Subtle bottom gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />

        {/* Hero Content */}

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            {/* Eyebrow */}

            {about.hero_eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                {about.hero_eyebrow}
              </p>
            )}

            {/* Title */}

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {about.hero_title}
            </h1>

            {/* Description */}

            {about.hero_description && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-100 sm:text-lg">
                {about.hero_description}
              </p>
            )}

          </div>
        </div>
      </section>


      {/* ============================================================
          OUR STORY
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT — STORY CONTENT */}

          <div>

            {/* Story Eyebrow */}

            {about.story_eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                {about.story_eyebrow}
              </p>
            )}

            {/* Story Title */}

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              {about.story_title}
            </h2>

            {/* Story Paragraphs */}

            <div className="mt-6 space-y-4 text-base leading-7 text-stone-600">

              {about.story_paragraph_1 && (
                <p>
                  {about.story_paragraph_1}
                </p>
              )}

              {about.story_paragraph_2 && (
                <p>
                  {about.story_paragraph_2}
                </p>
              )}

              {about.story_paragraph_3 && (
                <p>
                  {about.story_paragraph_3}
                </p>
              )}

            </div>

          </div>


          {/* RIGHT — STORY IMAGE */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl shadow-xl">

              {about.story_image_url ? (
                <img
                  src={about.story_image_url}
                  alt="Musical instruments"
                  className="h-[420px] w-full object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-stone-200">
                  <Music
                    size={50}
                    className="text-stone-400"
                  />
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ============================================================
          WHY CHOOSE US
      ============================================================ */}

      <section className="border-y border-stone-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">

            {/* Eyebrow */}

            {about.why_eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                {about.why_eyebrow}
              </p>
            )}

            {/* Title */}

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              {about.why_title}
            </h2>

            {/* Description */}

            {about.why_description && (
              <p className="mt-4 leading-7 text-stone-500">
                {about.why_description}
              </p>
            )}

          </div>


          {/* Feature Cards */}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-stone-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {feature.description}
                  </p>

                </article>
              )
            })}

          </div>

        </div>

      </section>


      {/* ============================================================
          MISSION
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        <div className="rounded-3xl bg-amber-50 px-6 py-12 text-center sm:px-12">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
            <Award size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-stone-950">
            {about.mission_title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">
            {about.mission_description}
          </p>

        </div>

      </section>


      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="bg-stone-950">

        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold text-white">
            {about.cta_title}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-stone-400">
            {about.cta_description}
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-xl bg-amber-500 px-7 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            {about.cta_button_text || "Shop Now"}
          </Link>

        </div>

      </section>

    </main>
  )
}

export default About