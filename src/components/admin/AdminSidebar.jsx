import {
  Archive,
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  Settings,
  Star,
  Users,
  Music2,
  Home,
  Info,
} from "lucide-react"

import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// ============================================================
// ADMIN NAVIGATION
// ============================================================

const navigationItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },

  // ----------------------------------------------------------
  // WEBSITE MANAGEMENT
  // ----------------------------------------------------------

  {
    name: "Home",
    path: "/admin/home",
    icon: Home,
  },

  {
    name: "About Us",
    path: "/admin/about",
    icon: Info,
  },

  // ----------------------------------------------------------
  // STORE MANAGEMENT
  // ----------------------------------------------------------

  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },

  {
    name: "Categories",
    path: "/admin/categories",
    icon: Archive,
  },

  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },

  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },

  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: Star,
  },

  {
    name: "Contact Messages",
    path: "/admin/contact-messages",
    icon: MessageSquare,
  },
]


function AdminSidebar({ onNavigate }) {

  const navigate = useNavigate()

  const { profile, logout } = useAuth()


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {

      await logout()

      navigate("/login", {
        replace: true,
      })

    } catch (error) {

      console.error(
        "Logout error:",
        error,
      )

    }
  }


  return (
    <aside className="flex h-full w-72 flex-col border-r border-stone-800 bg-stone-950 text-white">


      {/* ======================================================
          BRAND
      ====================================================== */}

      <div className="border-b border-stone-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-stone-950">

            <Music2 size={23} />

          </div>


          <div>

            <h1 className="text-base font-bold tracking-wide">
              Musical Store
            </h1>

            <p className="mt-0.5 text-xs text-stone-500">
              Administration Panel
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          ADMIN PROFILE
      ====================================================== */}

      <div className="border-b border-stone-800 px-5 py-5">

        <div className="flex items-center gap-3 rounded-xl bg-stone-900 p-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-stone-950">

            {profile?.full_name
              ? profile.full_name
                  .charAt(0)
                  .toUpperCase()
              : "A"}

          </div>


          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-white">
              {profile?.full_name || "Administrator"}
            </p>

            <p className="truncate text-xs text-stone-500">
              {profile?.email || "Admin"}
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
          Main Menu
        </p>


        <div className="space-y-1">

          {navigationItems.map((item) => {

            const Icon = item.icon

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}

                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",

                    isActive
                      ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/10"
                      : "text-stone-400 hover:bg-stone-900 hover:text-white",

                  ].join(" ")
                }
              >

                {({ isActive }) => (

                  <>

                    <Icon
                      size={19}
                      className={
                        isActive
                          ? "text-stone-950"
                          : "text-stone-500 group-hover:text-amber-400"
                      }
                    />

                    <span>
                      {item.name}
                    </span>

                  </>

                )}

              </NavLink>

            )

          })}

        </div>


        {/* ====================================================
            STORE
        ==================================================== */}

        <div className="mt-8 border-t border-stone-800 pt-6">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
            Store
          </p>


          {/* ==================================================
              VIEW STORE
          ================================================== */}

          <NavLink
            to="/"
            onClick={onNavigate}

            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 transition-all duration-200 hover:bg-stone-900 hover:text-white"
          >

            <ExternalLink
              size={19}
              className="text-stone-500 transition-colors group-hover:text-amber-400"
            />

            <span>
              View Store
            </span>

          </NavLink>


          {/* ==================================================
              SETTINGS
          ================================================== */}

          <NavLink
            to="/admin/settings"
            onClick={onNavigate}

            className={({ isActive }) =>
              [
                "group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",

                isActive
                  ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/10"
                  : "text-stone-400 hover:bg-stone-900 hover:text-white",

              ].join(" ")
            }
          >

            {({ isActive }) => (

              <>

                <Settings
                  size={19}
                  className={
                    isActive
                      ? "text-stone-950"
                      : "text-stone-500 group-hover:text-amber-400"
                  }
                />

                <span>
                  Settings
                </span>

              </>

            )}

          </NavLink>

        </div>

      </nav>


      {/* ======================================================
          LOGOUT
      ====================================================== */}

      <div className="border-t border-stone-800 p-4">

        <button
          type="button"
          onClick={handleLogout}

          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 transition-all duration-200 hover:bg-red-950/40 hover:text-red-400"
        >

          <LogOut
            size={19}
            className="text-stone-500 transition-colors group-hover:text-red-400"
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  )
}


export default AdminSidebar