const supabase = require("../config/supabase")

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            })
        }

        const token = authHeader.replace("Bearer ", "").trim()

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token",
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.error("Authentication middleware error:", error)

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message,
        })
    }
}

module.exports = authMiddleware