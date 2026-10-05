const supabase = require("../config/supabase")

// ============================================================
// GET USER ADDRESSES
// ============================================================

const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", {
                ascending: false,
            })

        if (error) {
            console.error("Get addresses error:", error)

            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error("Get addresses controller error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
        })
    }
}


// ============================================================
// GET SINGLE ADDRESS
// ============================================================

const getAddressById = async (req, res) => {
    try {
        const userId = req.user.id
        const addressId = req.params.id

        const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("id", addressId)
            .eq("user_id", userId)
            .single()

        if (error) {
            console.error("Get address error:", error)

            return res.status(404).json({
                success: false,
                message: "Address not found",
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get address controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to fetch address",
        })
    }
}


// ============================================================
// CREATE ADDRESS
// ============================================================

const createAddress = async (req, res) => {
    try {
        const userId = req.user.id

        const {
            name,
            phone,
            address,
            city,
            state,
            postal_code,
            country,
        } = req.body

        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !postal_code
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, phone, address, city, state and postal code are required",
            })
        }

        const { data, error } = await supabase
            .from("addresses")
            .insert([
                {
                    user_id: userId,
                    name,
                    phone,
                    address,
                    city,
                    state,
                    postal_code,
                    country: country || "India",
                },
            ])
            .select()
            .single()

        if (error) {
            console.error("Create address error:", error)

            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Create address controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to create address",
        })
    }
}


// ============================================================
// UPDATE ADDRESS
// ============================================================

const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id
        const addressId = req.params.id

        const {
            name,
            phone,
            address,
            city,
            state,
            postal_code,
            country,
        } = req.body

        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !postal_code
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, phone, address, city, state and postal code are required",
            })
        }

        const { data, error } = await supabase
            .from("addresses")
            .update({
                name,
                phone,
                address,
                city,
                state,
                postal_code,
                country: country || "India",
                updated_at: new Date().toISOString(),
            })
            .eq("id", addressId)
            .eq("user_id", userId)
            .select()
            .single()

        if (error) {
            console.error("Update address error:", error)

            return res.status(404).json({
                success: false,
                message: "Address not found or could not be updated",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update address controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to update address",
        })
    }
}


// ============================================================
// DELETE ADDRESS
// ============================================================

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id
        const addressId = req.params.id

        const { error } = await supabase
            .from("addresses")
            .delete()
            .eq("id", addressId)
            .eq("user_id", userId)

        if (error) {
            console.error("Delete address error:", error)

            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        })
    } catch (error) {
        console.error(
            "Delete address controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Failed to delete address",
        })
    }
}


module.exports = {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
}