const supabase = require("../config/supabase")

// ============================================================
// GET STORE SETTINGS FOR CUSTOMER
// GET /api/settings
// ============================================================

const getSettings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("store_settings")
            .select(`
                id,
                store_name,
                store_description,
                contact_email,
                contact_phone,
                store_address,
                currency,
                free_shipping_threshold,
                shipping_charge,
                tax_percentage,
                facebook_url,
                instagram_url,
                whatsapp_url,
                store_status,
                updated_at
            `)
            .limit(1)
            .single()

        if (error) {
            console.error(
                "Store settings fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch store settings",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get store settings controller error:",
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
// GET SETTINGS FOR ADMIN
// GET /api/settings/admin
//
// Returns BOTH:
// 1. store_settings
// 2. contact_information
// ============================================================

const getAdminSettings = async (req, res) => {
    try {
        const {
            data: store,
            error: storeError,
        } = await supabase
            .from("store_settings")
            .select("*")
            .limit(1)
            .single()

        if (storeError) {
            console.error(
                "Admin store settings fetch error:",
                storeError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch store settings",
                error: storeError.message,
            })
        }

        const {
            data: contact,
            error: contactError,
        } = await supabase
            .from("contact_information")
            .select("*")
            .limit(1)
            .single()

        if (contactError) {
            console.error(
                "Admin contact information fetch error:",
                contactError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch contact information",
                error: contactError.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: {
                store,
                contact,
            },
        })
    } catch (error) {
        console.error(
            "Get admin settings controller error:",
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
// UPDATE SETTINGS
// PUT /api/settings/:id
//
// Updates:
// store_settings
// +
// contact_information
//
// IMPORTANT:
// support_title and map_location are NOT updated.
// ============================================================

const updateSettings = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Settings ID is required",
            })
        }

        const {
            // ==================================================
            // STORE SETTINGS
            // ==================================================

            store_name,
            store_description,
            currency,

            free_shipping_threshold,
            shipping_charge,
            tax_percentage,

            store_status,

            // ==================================================
            // CONTACT INFORMATION
            // ==================================================

            email,
            phone,
            address_line1,
            address_line2,
            support_description,

            // ==================================================
            // SOCIAL MEDIA
            // ==================================================

            facebook_url,
            instagram_url,
            whatsapp_number,
            whatsapp_message,
        } = req.body

        // ============================================================
        // VALIDATE STORE NAME
        // ============================================================

        if (
            store_name !== undefined &&
            (!store_name ||
                !String(store_name).trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Store name is required",
            })
        }

        // ============================================================
        // VALIDATE EMAIL
        // ============================================================

        if (
            email !== undefined &&
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(email).trim(),
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid contact email",
            })
        }

        // ============================================================
        // VALIDATE NUMERIC FIELDS
        // ============================================================

        const numericFields = [
            {
                name: "free_shipping_threshold",
                value: free_shipping_threshold,
            },
            {
                name: "shipping_charge",
                value: shipping_charge,
            },
            {
                name: "tax_percentage",
                value: tax_percentage,
            },
        ]

        for (const field of numericFields) {
            if (
                field.value !== undefined &&
                field.value !== "" &&
                (
                    Number.isNaN(
                        Number(field.value),
                    ) ||
                    Number(field.value) < 0
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${field.name.replaceAll("_", " ")} must be a valid non-negative number`,
                })
            }
        }

        if (
            tax_percentage !== undefined &&
            tax_percentage !== "" &&
            Number(tax_percentage) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Tax percentage cannot exceed 100",
            })
        }

        // ============================================================
        // CHECK STORE SETTINGS
        // ============================================================

        const {
            data: existingStore,
            error: existingStoreError,
        } = await supabase
            .from("store_settings")
            .select("id")
            .eq("id", id)
            .single()

        if (
            existingStoreError ||
            !existingStore
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Store settings not found",
                error:
                    existingStoreError?.message,
            })
        }

        // ============================================================
        // BUILD STORE UPDATE
        // ============================================================

        const storeUpdate = {
            updated_at:
                new Date().toISOString(),
        }

        if (store_name !== undefined) {
            storeUpdate.store_name =
                String(store_name).trim()
        }

        if (
            store_description !== undefined
        ) {
            storeUpdate.store_description =
                store_description &&
                    String(store_description).trim()
                    ? String(
                        store_description,
                    ).trim()
                    : null
        }

        if (currency !== undefined) {
            storeUpdate.currency =
                currency &&
                    String(currency).trim()
                    ? String(currency)
                        .trim()
                        .toUpperCase()
                    : "INR"
        }

        if (
            free_shipping_threshold !==
            undefined &&
            free_shipping_threshold !== ""
        ) {
            storeUpdate.free_shipping_threshold =
                Number(
                    free_shipping_threshold,
                )
        }

        if (
            shipping_charge !== undefined &&
            shipping_charge !== ""
        ) {
            storeUpdate.shipping_charge =
                Number(shipping_charge)
        }

        if (
            tax_percentage !== undefined &&
            tax_percentage !== ""
        ) {
            storeUpdate.tax_percentage =
                Number(tax_percentage)
        }

        if (store_status !== undefined) {
            if (
                typeof store_status ===
                "boolean"
            ) {
                storeUpdate.store_status =
                    store_status
            } else if (
                store_status === "true" ||
                store_status === "false"
            ) {
                storeUpdate.store_status =
                    store_status === "true"
            } else {
                return res.status(400).json({
                    success: false,
                    message:
                        "Store status must be true or false",
                })
            }
        }

        // ============================================================
        // UPDATE STORE SETTINGS
        // ============================================================

        const {
            data: updatedStore,
            error: storeUpdateError,
        } = await supabase
            .from("store_settings")
            .update(storeUpdate)
            .eq("id", id)
            .select()
            .single()

        if (storeUpdateError) {
            console.error(
                "Store settings update error:",
                storeUpdateError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update store settings",
                error:
                    storeUpdateError.message,
            })
        }

        // ============================================================
        // FIND CONTACT INFORMATION RECORD
        // ============================================================

        const {
            data: existingContact,
            error: contactFindError,
        } = await supabase
            .from("contact_information")
            .select("id")
            .limit(1)
            .single()

        if (
            contactFindError ||
            !existingContact
        ) {
            console.error(
                "Contact information record not found:",
                contactFindError,
            )

            return res.status(404).json({
                success: false,
                message:
                    "Contact information record not found",
                error:
                    contactFindError?.message,
            })
        }

        // ============================================================
        // BUILD CONTACT UPDATE
        //
        // IMPORTANT:
        // support_title is intentionally NOT included.
        //
        // map_location is intentionally NOT included.
        //
        // is_active is intentionally NOT included.
        // ============================================================

        const contactUpdate = {
            updated_at:
                new Date().toISOString(),
        }

        // ------------------------------------------------------------
        // EMAIL
        // ------------------------------------------------------------

        if (email !== undefined) {
            contactUpdate.email =
                String(email).trim()
        }

        // ------------------------------------------------------------
        // PHONE
        // ------------------------------------------------------------

        if (phone !== undefined) {
            contactUpdate.phone =
                String(phone).trim()
        }

        // ------------------------------------------------------------
        // ADDRESS LINE 1
        // ------------------------------------------------------------

        if (
            address_line1 !== undefined
        ) {
            contactUpdate.address_line1 =
                String(address_line1).trim()
        }

        // ------------------------------------------------------------
        // ADDRESS LINE 2
        // ------------------------------------------------------------

        if (
            address_line2 !== undefined
        ) {
            contactUpdate.address_line2 =
                address_line2 &&
                    String(address_line2).trim()
                    ? String(
                        address_line2,
                    ).trim()
                    : null
        }

        // ------------------------------------------------------------
        // SUPPORT DESCRIPTION
        // ------------------------------------------------------------

        if (
            support_description !==
            undefined
        ) {
            contactUpdate.support_description =
                String(
                    support_description,
                ).trim()
        }

        // ------------------------------------------------------------
        // FACEBOOK
        // ------------------------------------------------------------

        if (
            facebook_url !== undefined
        ) {
            contactUpdate.facebook_url =
                facebook_url &&
                    String(facebook_url).trim()
                    ? String(
                        facebook_url,
                    ).trim()
                    : null
        }

        // ------------------------------------------------------------
        // INSTAGRAM
        // ------------------------------------------------------------

        if (
            instagram_url !== undefined
        ) {
            contactUpdate.instagram_url =
                instagram_url &&
                    String(instagram_url).trim()
                    ? String(
                        instagram_url,
                    ).trim()
                    : null
        }

        // ------------------------------------------------------------
        // WHATSAPP NUMBER / LINK
        // ------------------------------------------------------------

        if (
            whatsapp_number !== undefined
        ) {
            contactUpdate.whatsapp_number =
                whatsapp_number &&
                    String(whatsapp_number).trim()
                    ? String(
                        whatsapp_number,
                    ).trim()
                    : null
        }

        // ------------------------------------------------------------
        // WHATSAPP MESSAGE
        // ------------------------------------------------------------

        if (
            whatsapp_message !== undefined
        ) {
            contactUpdate.whatsapp_message =
                whatsapp_message &&
                    String(whatsapp_message).trim()
                    ? String(
                        whatsapp_message,
                    ).trim()
                    : null
        }

        // ============================================================
        // UPDATE CONTACT INFORMATION
        // ============================================================

        const {
            data: updatedContact,
            error: contactUpdateError,
        } = await supabase
            .from("contact_information")
            .update(contactUpdate)
            .eq("id", existingContact.id)
            .select()
            .single()

        if (contactUpdateError) {
            console.error(
                "Contact information update error:",
                contactUpdateError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Store settings were updated, but contact information could not be updated",
                error:
                    contactUpdateError.message,
            })
        }

        // ============================================================
        // SUCCESS
        // ============================================================

        return res.status(200).json({
            success: true,
            message:
                "Store settings and contact information updated successfully",
            data: {
                store: updatedStore,
                contact: updatedContact,
            },
        })
    } catch (error) {
        console.error(
            "Update settings controller error:",
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
    getSettings,
    getAdminSettings,
    updateSettings,
}