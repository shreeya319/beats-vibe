const supabase = require("../config/supabase")

// ============================================================
// GET ABOUT US
// Used by customer About page
// ============================================================

const getAbout = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("about_us")
            .select(`
                id,
                hero_image_url,
                hero_eyebrow,
                hero_title,
                hero_description,
                story_eyebrow,
                story_title,
                story_paragraph_1,
                story_paragraph_2,
                story_paragraph_3,
                story_image_url,
                why_eyebrow,
                why_title,
                why_description,
                mission_title,
                mission_description,
                cta_title,
                cta_description,
                cta_button_text,
                updated_at
            `)
            .limit(1)
            .single()

        if (error) {
            console.error(
                "About Us fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch About Us content",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get About Us controller error:",
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
// GET ABOUT US FOR ADMIN
// ============================================================

const getAdminAbout = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("about_us")
            .select("*")
            .limit(1)
            .single()

        if (error) {
            console.error(
                "Admin About Us fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch About Us content",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get admin About Us error:",
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
// UPDATE ABOUT US
// ============================================================

const updateAbout = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "About Us ID is required",
            })
        }

        const {
            hero_image_url,
            hero_eyebrow,
            hero_title,
            hero_description,

            story_eyebrow,
            story_title,
            story_paragraph_1,
            story_paragraph_2,
            story_paragraph_3,
            story_image_url,

            why_eyebrow,
            why_title,
            why_description,

            mission_title,
            mission_description,

            cta_title,
            cta_description,
            cta_button_text,
        } = req.body

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (
            hero_title !== undefined &&
            (!hero_title || !hero_title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Hero title is required",
            })
        }

        if (
            story_title !== undefined &&
            (!story_title || !story_title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Story title is required",
            })
        }

        // ------------------------------------------------------
        // BUILD UPDATE OBJECT
        // Only update fields supplied by frontend
        // ------------------------------------------------------

        const updateData = {
            updated_at: new Date().toISOString(),
        }

        // ------------------------------------------------------
        // HERO
        // ------------------------------------------------------

        if (hero_image_url !== undefined) {
            updateData.hero_image_url =
                hero_image_url &&
                    hero_image_url.trim()
                    ? hero_image_url.trim()
                    : null
        }

        if (hero_eyebrow !== undefined) {
            updateData.hero_eyebrow =
                hero_eyebrow &&
                    hero_eyebrow.trim()
                    ? hero_eyebrow.trim()
                    : null
        }

        if (hero_title !== undefined) {
            updateData.hero_title =
                hero_title.trim()
        }

        if (hero_description !== undefined) {
            updateData.hero_description =
                hero_description &&
                    hero_description.trim()
                    ? hero_description.trim()
                    : null
        }

        // ------------------------------------------------------
        // STORY
        // ------------------------------------------------------

        if (story_eyebrow !== undefined) {
            updateData.story_eyebrow =
                story_eyebrow &&
                    story_eyebrow.trim()
                    ? story_eyebrow.trim()
                    : null
        }

        if (story_title !== undefined) {
            updateData.story_title =
                story_title.trim()
        }

        if (story_paragraph_1 !== undefined) {
            updateData.story_paragraph_1 =
                story_paragraph_1 &&
                    story_paragraph_1.trim()
                    ? story_paragraph_1.trim()
                    : null
        }

        if (story_paragraph_2 !== undefined) {
            updateData.story_paragraph_2 =
                story_paragraph_2 &&
                    story_paragraph_2.trim()
                    ? story_paragraph_2.trim()
                    : null
        }

        if (story_paragraph_3 !== undefined) {
            updateData.story_paragraph_3 =
                story_paragraph_3 &&
                    story_paragraph_3.trim()
                    ? story_paragraph_3.trim()
                    : null
        }

        if (story_image_url !== undefined) {
            updateData.story_image_url =
                story_image_url &&
                    story_image_url.trim()
                    ? story_image_url.trim()
                    : null
        }

        // ------------------------------------------------------
        // WHY CHOOSE US
        // ------------------------------------------------------

        if (why_eyebrow !== undefined) {
            updateData.why_eyebrow =
                why_eyebrow &&
                    why_eyebrow.trim()
                    ? why_eyebrow.trim()
                    : null
        }

        if (why_title !== undefined) {
            updateData.why_title =
                why_title.trim()
        }

        if (why_description !== undefined) {
            updateData.why_description =
                why_description &&
                    why_description.trim()
                    ? why_description.trim()
                    : null
        }

        // ------------------------------------------------------
        // MISSION
        // ------------------------------------------------------

        if (mission_title !== undefined) {
            updateData.mission_title =
                mission_title.trim()
        }

        if (mission_description !== undefined) {
            updateData.mission_description =
                mission_description &&
                    mission_description.trim()
                    ? mission_description.trim()
                    : null
        }

        // ------------------------------------------------------
        // CTA
        // ------------------------------------------------------

        if (cta_title !== undefined) {
            updateData.cta_title =
                cta_title.trim()
        }

        if (cta_description !== undefined) {
            updateData.cta_description =
                cta_description &&
                    cta_description.trim()
                    ? cta_description.trim()
                    : null
        }

        if (cta_button_text !== undefined) {
            updateData.cta_button_text =
                cta_button_text &&
                    cta_button_text.trim()
                    ? cta_button_text.trim()
                    : null
        }

        // ------------------------------------------------------
        // UPDATE DATABASE
        // ------------------------------------------------------

        const { data, error } = await supabase
            .from("about_us")
            .update(updateData)
            .eq("id", id)
            .select(`
                id,
                hero_image_url,
                hero_eyebrow,
                hero_title,
                hero_description,
                story_eyebrow,
                story_title,
                story_paragraph_1,
                story_paragraph_2,
                story_paragraph_3,
                story_image_url,
                why_eyebrow,
                why_title,
                why_description,
                mission_title,
                mission_description,
                cta_title,
                cta_description,
                cta_button_text,
                updated_at
            `)
            .single()

        if (error) {
            console.error(
                "Update About Us error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to update About Us content",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "About Us updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update About Us controller error:",
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
// UPLOAD ABOUT US IMAGE
// Uploads image to Supabase Storage
// ============================================================

const uploadAboutImage = async (req, res) => {
    try {
        // ------------------------------------------------------
        // CHECK FILE
        // ------------------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image",
            })
        }

        const file = req.file

        // ------------------------------------------------------
        // VALIDATE IMAGE
        // ------------------------------------------------------

        if (!file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed",
            })
        }

        // ------------------------------------------------------
        // CREATE UNIQUE FILE NAME
        // ------------------------------------------------------

        const fileExtension =
            file.originalname
                .split(".")
                .pop()
                .toLowerCase()

        const fileName = `about-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}.${fileExtension}`

        // ------------------------------------------------------
        // SUPABASE STORAGE BUCKET
        // ------------------------------------------------------

        const bucketName = "Aboutus"

        // ------------------------------------------------------
        // UPLOAD
        // ------------------------------------------------------

        const { error: uploadError } =
            await supabase.storage
                .from(bucketName)
                .upload(
                    fileName,
                    file.buffer,
                    {
                        contentType:
                            file.mimetype,
                        upsert: false,
                    },
                )

        if (uploadError) {
            console.error(
                "About image storage upload error:",
                uploadError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to upload About Us image to Supabase Storage",
                error: uploadError.message,
            })
        }

        // ------------------------------------------------------
        // GET PUBLIC URL
        // ------------------------------------------------------

        const {
            data: publicUrlData,
        } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName)

        const image_url =
            publicUrlData?.publicUrl

        if (!image_url) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate About Us image URL",
            })
        }

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "About Us image uploaded successfully",
            image_url,
        })
    } catch (error) {
        console.error(
            "About image upload controller error:",
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
// EXPORTS
// ============================================================

module.exports = {
    getAbout,
    getAdminAbout,
    updateAbout,
    uploadAboutImage,
}