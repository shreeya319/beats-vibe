const supabase = require("../config/supabase")

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            })
        }

        const { data: profile, error } =
            await supabase
                .from("profiles")
                .select("id, role")
                .eq("id", req.user.id)
                .single()

        if (error || !profile) {
            return res.status(403).json({
                success: false,
                message: "Admin profile not found",
            })
        }

        if (profile.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            })
        }

        req.profile = profile

        next()
    } catch (error) {
        console.error(
            "Admin authorization error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to verify admin access",
        })
    }
}

module.exports = adminMiddleware