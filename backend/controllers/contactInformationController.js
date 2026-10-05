const supabase = require("../config/supabase")

// ============================================================
// GET CONTACT INFORMATION
//
// GET /api/contact-information
// ============================================================

const getContactInformation = async (req, res) => {
    try {
        const {
            data,
            error,
        } = await supabase
            .from("contact_information")
            .select(`
                id,
                email,
                phone,
                address_line1,
                address_line2,
                support_title,
                support_description,
                map_location,
                facebook_url,
                instagram_url,
                whatsapp_number,
                whatsapp_message,
                is_active,
                created_at,
                updated_at
            `)
            .limit(1)
            .single()

        if (error) {
            console.error(
                "Get contact information error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch contact information",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Contact information controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

// ============================================================
// UPDATE CONTACT INFORMATION
//
// PUT /api/contact-information/:id
//
// This remains available if you ever need to update
// contact information directly.
//
// ============================================================

const updateContactInformation = async (
    req,
    res,
) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Contact information ID is required",
            })
        }

        const {
            email,
            phone,
            address_line1,
            address_line2,
            support_description,
            facebook_url,
            instagram_url,
            whatsapp_number,
            whatsapp_message,
        } = req.body

        // ========================================================
        // VALIDATION
        // ========================================================

        if (
            email !== undefined &&
            (
                !email ||
                !String(email).trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            })
        }

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(email).trim(),
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address",
            })
        }

        // ========================================================
        // BUILD UPDATE
        //
        // support_title and map_location are intentionally
        // excluded so existing values remain unchanged.
        // ========================================================

        const updateData = {
            updated_at:
                new Date().toISOString(),
        }

        if (email !== undefined) {
            updateData.email =
                String(email).trim()
        }

        if (phone !== undefined) {
            updateData.phone =
                String(phone).trim()
        }

        if (
            address_line1 !== undefined
        ) {
            updateData.address_line1 =
                String(address_line1).trim()
        }

        if (
            address_line2 !== undefined
        ) {
            updateData.address_line2 =
                address_line2 &&
                    String(address_line2).trim()
                    ? String(
                        address_line2,
                    ).trim()
                    : null
        }

        if (
            support_description !==
            undefined
        ) {
            updateData.support_description =
                String(
                    support_description,
                ).trim()
        }

        if (
            facebook_url !== undefined
        ) {
            updateData.facebook_url =
                facebook_url &&
                    String(facebook_url).trim()
                    ? String(
                        facebook_url,
                    ).trim()
                    : null
        }

        if (
            instagram_url !== undefined
        ) {
            updateData.instagram_url =
                instagram_url &&
                    String(instagram_url).trim()
                    ? String(
                        instagram_url,
                    ).trim()
                    : null
        }

        if (
            whatsapp_number !== undefined
        ) {
            updateData.whatsapp_number =
                whatsapp_number &&
                    String(whatsapp_number).trim()
                    ? String(
                        whatsapp_number,
                    ).trim()
                    : null
        }

        if (
            whatsapp_message !== undefined
        ) {
            updateData.whatsapp_message =
                whatsapp_message &&
                    String(whatsapp_message).trim()
                    ? String(
                        whatsapp_message,
                    ).trim()
                    : null
        }

        // ========================================================
        // UPDATE
        // ========================================================

        const {
            data,
            error,
        } = await supabase
            .from("contact_information")
            .update(updateData)
            .eq("id", id)
            .select(`
                id,
                email,
                phone,
                address_line1,
                address_line2,
                support_title,
                support_description,
                map_location,
                facebook_url,
                instagram_url,
                whatsapp_number,
                whatsapp_message,
                is_active,
                created_at,
                updated_at
            `)
            .single()

        if (error) {
            console.error(
                "Update contact information error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update contact information",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Contact information updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Contact information update error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getContactInformation,
    updateContactInformation,
}