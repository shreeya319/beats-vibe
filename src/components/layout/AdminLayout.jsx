import {
    Archive,
    BarChart3,
    ClipboardList,
    ExternalLink,
    Home,
    Info,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    Settings,
    Star,
    Users,
    X,
} from "lucide-react"

import { useState } from "react"
import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom"

import { supabase } from "../../lib/supabase"

// ============================================================
// ADMIN SIDEBAR NAVIGATION
// ============================================================

const navigation = [
    // Dashboard
    {
        name: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
    },

    // Website Management
    {
        name: "Home",
        path: "/admin/home",
        icon: Home,
    },

    {
        name: "About",
        path: "/admin/about",
        icon: Info,
    },

    // Store Management
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
        icon: ClipboardList,
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
        name: "Messages",
        path: "/admin/contact-messages",
        icon: MessageSquare,
    },
]

// ============================================================
// ADMIN LAYOUT
// ============================================================

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false)

    const navigate = useNavigate()

    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = async () => {
        await supabase.auth.signOut()

        navigate("/login", {
            replace: true,
        })
    }

    return (
        <div className="min-h-screen bg-stone-100">

            {/* ==================================================
                MOBILE OVERLAY
            ================================================== */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-72
                    flex-col
                    border-r
                    border-stone-800
                    bg-stone-950
                    text-white
                    transition-transform
                    duration-300

                    lg:translate-x-0

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* ==================================================
                    LOGO
                ================================================== */}

                <div className="flex h-20 shrink-0 items-center justify-between border-b border-stone-800 px-6">

                    <Link
                        to="/admin"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
                            <BarChart3 size={21} />
                        </div>

                        <div>
                            <p className="font-bold tracking-tight">
                                Store Admin
                            </p>

                            <p className="text-xs text-stone-500">
                                Musical Instruments
                            </p>
                        </div>

                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* ==================================================
                    RED SIDEBAR TEST
                ================================================== */}

                <div className="mx-4 mt-4 rounded-lg bg-red-500 p-3 text-center text-sm font-bold text-white">
                    SIDEBAR TEST
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <div className="flex-1 overflow-y-auto px-4 py-6">

                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                        Main Menu
                    </p>

                    <nav className="space-y-1">

                        {navigation.map((item) => {
                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={
                                        item.path ===
                                        "/admin"
                                    }
                                    onClick={() =>
                                        setSidebarOpen(false)
                                    }
                                    className={({ isActive }) =>
                                        `
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-sm
                                        font-medium
                                        transition

                                        ${
                                            isActive
                                                ? "bg-amber-500 text-stone-950"
                                                : "text-stone-400 hover:bg-stone-900 hover:text-white"
                                        }
                                        `
                                    }
                                >

                                    <Icon size={19} />

                                    <span>
                                        {item.name}
                                    </span>

                                </NavLink>
                            )
                        })}

                    </nav>

                </div>

                {/* ==================================================
                    BOTTOM NAVIGATION
                ================================================== */}

                <div className="shrink-0 border-t border-stone-800 p-4">

                    {/* ==================================================
                        VIEW STORE
                    ================================================== */}

                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 transition hover:bg-stone-900 hover:text-white"
                    >

                        <ExternalLink size={19} />

                        <span>
                            View Store
                        </span>

                    </Link>

                    {/* ==================================================
                        SETTINGS
                    ================================================== */}

                    <Link
                        to="/admin/settings"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 transition hover:bg-stone-900 hover:text-white"
                    >

                        <Settings size={19} />

                        <span>
                            Settings
                        </span>

                    </Link>

                    {/* ==================================================
                        LOGOUT
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-400 transition hover:bg-red-950 hover:text-red-300"
                    >

                        <LogOut size={19} />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>

            {/* ==================================================
                MAIN AREA
            ================================================== */}

            <div className="lg:pl-72">

                {/* ==================================================
                    TOP HEADER
                ================================================== */}

                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

                    {/* Mobile Menu */}

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="rounded-xl border border-stone-200 p-2.5 text-stone-700 hover:bg-stone-100 lg:hidden"
                    >
                        <Menu size={21} />
                    </button>

                    {/* Desktop Header */}

                    <div className="hidden lg:block">

                        <p className="text-sm font-medium text-stone-500">
                            Administration
                        </p>

                        <p className="text-lg font-bold text-stone-950">
                            Musical Instruments Store
                        </p>

                    </div>

                    {/* Admin Profile */}

                    <div className="ml-auto flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-semibold text-stone-900">
                                Administrator
                            </p>

                            <p className="text-xs text-stone-500">
                                Store Manager
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-bold text-white">
                            A
                        </div>

                    </div>

                </header>

                {/* ==================================================
                    PAGE CONTENT
                ================================================== */}

                <main>
                    <Outlet />
                </main>

            </div>

        </div>
    )
}

export default AdminLayout