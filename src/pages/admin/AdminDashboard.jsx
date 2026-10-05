import { useEffect, useState } from "react"

import {
  Archive,
  BarChart3,
  ClipboardList,
  ExternalLink,
  Home,
  Info,
  MessageSquare,
  Package,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react"

import { motion } from "motion/react"
import { Link } from "react-router-dom"

import { getDashboardStats } from "../../services/adminService"


// ============================================================
// MANAGEMENT ITEMS
// ============================================================

const managementItems = [

  // ==========================================================
  // WEBSITE MANAGEMENT
  // ==========================================================

  {
    title: "Home",
    description:
      "Manage Home page hero slides and content.",
    icon: Home,
    path: "/admin/home",
  },

  {
    title: "About Us",
    description:
      "Manage About Us page content.",
    icon: Info,
    path: "/admin/about",
  },


  // ==========================================================
  // STORE MANAGEMENT
  // ==========================================================

  {
    title: "Products",
    description:
      "Add, edit and manage musical instruments.",
    icon: Package,
    path: "/admin/products",
  },

  {
    title: "Categories",
    description:
      "Manage instrument categories and visibility.",
    icon: Archive,
    path: "/admin/categories",
  },

  {
    title: "Orders",
    description:
      "View orders and update their status.",
    icon: ClipboardList,
    path: "/admin/orders",
  },

  {
    title: "Customers",
    description:
      "View registered customer accounts.",
    icon: Users,
    path: "/admin/customers",
  },

  {
    title: "Testimonials",
    description:
      "Manage customer testimonials displayed on Home.",
    icon: Star,
    path: "/admin/testimonials",
  },

  {
    title: "Contact Messages",
    description:
      "View and manage customer enquiries.",
    icon: MessageSquare,
    path: "/admin/contact-messages",
  },
]


// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboard() {

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
  })


  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  // ==========================================================
  // LOAD DASHBOARD STATISTICS
  // ==========================================================

  useEffect(() => {

    const loadDashboardStats = async () => {

      try {

        setLoading(true)

        setError("")


        const result =
          await getDashboardStats()


        if (!result.success) {

          throw new Error(
            result.message ||
              "Failed to load dashboard statistics",
          )

        }


        setStats(
          result.data || {
            products: 0,
            categories: 0,
            orders: 0,
            customers: 0,
          },
        )

      } catch (err) {

        console.error(
          "Dashboard statistics error:",
          err,
        )


        setError(
          err.message ||
            "Unable to load dashboard statistics.",
        )

      } finally {

        setLoading(false)

      }

    }


    loadDashboardStats()

  }, [])


  // ==========================================================
  // STATISTIC CARDS
  // ==========================================================

  const statCards = [

    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      description:
        "Manage your instrument catalog",
    },

    {
      title: "Categories",
      value: stats.categories,
      icon: Archive,
      description:
        "Manage product categories",
    },

    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      description:
        "View and manage orders",
    },

    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      description:
        "Manage registered customers",
    },

  ]


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="min-h-screen bg-stone-100">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-stone-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">


            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                Administration
              </p>


              <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                Admin Dashboard
              </h1>


              <p className="mt-2 text-stone-500">
                Manage your musical instruments
                store.
              </p>

            </div>


            {/* VIEW STORE */}

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >

              View Store

              <ExternalLink size={17} />

            </Link>

          </div>

        </div>

      </section>


      {/* ======================================================
          DASHBOARD CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-800">
              Unable to load dashboard statistics
            </p>


            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

          </div>

        )}


        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map((stat, index) => {

            const Icon = stat.icon


            return (

              <motion.div
                key={stat.title}

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

                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >

                <div className="flex items-start justify-between">


                  <div>

                    <p className="text-sm font-medium text-stone-500">
                      {stat.title}
                    </p>


                    <div className="mt-2">

                      {loading ? (

                        <div className="h-9 w-16 animate-pulse rounded-lg bg-stone-200" />

                      ) : (

                        <p className="text-3xl font-bold text-stone-950">

                          {stat.value.toLocaleString(
                            "en-IN",
                          )}

                        </p>

                      )}

                    </div>

                  </div>


                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                    <Icon size={21} />

                  </div>

                </div>


                <p className="mt-4 text-xs text-stone-400">
                  {stat.description}
                </p>

              </motion.div>

            )

          })}

        </div>


        {/* ====================================================
            MANAGEMENT
        ==================================================== */}

        <div className="mt-10">


          <div className="mb-5">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Store Management
            </p>


            <h2 className="mt-2 text-2xl font-bold text-stone-950">
              Manage Store
            </h2>

          </div>


          {/* ==================================================
              MANAGEMENT CARDS
          ================================================== */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {managementItems.map(
              (item, index) => {

                const Icon = item.icon


                return (

                  <motion.div
                    key={item.title}

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
                  >

                    <Link
                      to={item.path}

                      className="group block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >


                      {/* CARD HEADER */}

                      <div className="flex items-start justify-between">


                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-white transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-stone-950">

                          <Icon size={22} />

                        </div>


                        <BarChart3
                          size={18}
                          className="text-stone-300 transition-colors group-hover:text-amber-500"
                        />

                      </div>


                      {/* TITLE */}

                      <h3 className="mt-5 text-lg font-bold text-stone-950">
                        {item.title}
                      </h3>


                      {/* DESCRIPTION */}

                      <p className="mt-2 text-sm leading-6 text-stone-500">
                        {item.description}
                      </p>


                      {/* ACTION */}

                      <div className="mt-5 text-sm font-semibold text-amber-600">
                        Manage →
                      </div>


                    </Link>

                  </motion.div>

                )

              },
            )}

          </div>

        </div>


      </section>

    </main>

  )
}


export default AdminDashboard