import { useState } from "react"
import { Menu, X } from "lucide-react"
import AdminSidebar from "./AdminSidebar"

function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className="min-h-screen bg-stone-100">

            {/* ======================================================
                MOBILE HEADER
            ====================================================== */}

            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-stone-200 bg-white px-4 lg:hidden">

                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 transition hover:bg-stone-100"
                    aria-label="Open admin menu"
                >
                    <Menu size={22} />
                </button>

                <div className="ml-3">
                    <p className="text-sm font-bold text-stone-950">
                        Musical Store
                    </p>

                    <p className="text-xs text-stone-500">
                        Administration
                    </p>
                </div>

            </header>


            {/* ======================================================
                MOBILE OVERLAY
            ====================================================== */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-stone-950/60 lg:hidden"
                />
            )}


            {/* ======================================================
                SIDEBAR
            ====================================================== */}

            <div
                className={[
                    "fixed inset-y-0 left-0 z-50 transition-transform duration-300",

                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full",

                    "lg:translate-x-0",
                ].join(" ")}
            >

                <AdminSidebar
                    onNavigate={closeSidebar}
                />

                {/* Mobile close button */}

                <button
                    type="button"
                    onClick={closeSidebar}
                    className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-900 hover:text-white lg:hidden"
                    aria-label="Close admin menu"
                >
                    <X size={20} />
                </button>

            </div>


            {/* ======================================================
                MAIN ADMIN CONTENT
            ====================================================== */}

            <div className="lg:pl-72">

                <main className="min-h-[calc(100vh-4rem)]">
                    {children}
                </main>

            </div>

        </div>
    )
}

export default AdminLayout