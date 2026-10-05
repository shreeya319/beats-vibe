const supabase = require("../config/supabase")

// ============================================================
// GET ACTIVE HERO SLIDES
// Used by customer Home page
// ============================================================

const getHeroSlides = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("home_hero_slides")
            .select(`
                id,
                image_url,
                eyebrow,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
            `)
            .eq("is_active", true)
            .order("display_order", {
                ascending: true,
            })

        if (error) {
            console.error(
                "Hero slides fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch hero slides",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Hero slides controller error:",
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
// GET ALL HERO SLIDES
// Used by Admin Home
// ============================================================

const getAllHeroSlides = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("home_hero_slides")
            .select(`
                id,
                image_url,
                eyebrow,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
            `)
            .order("display_order", {
                ascending: true,
            })

        if (error) {
            console.error(
                "All hero slides fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch hero slides",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Get all hero slides error:",
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
// CREATE HERO SLIDE
// ============================================================

const createHeroSlide = async (req, res) => {
    try {
        const {
            image_url,
            eyebrow,
            title,
            description,
            display_order,
            is_active,
        } = req.body

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (!image_url) {
            return res.status(400).json({
                success: false,
                message: "Hero image URL is required",
            })
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Hero title is required",
            })
        }

        // ------------------------------------------------------
        // CREATE
        // ------------------------------------------------------

        const { data, error } = await supabase
            .from("home_hero_slides")
            .insert({
                image_url: image_url.trim(),

                eyebrow:
                    eyebrow && eyebrow.trim()
                        ? eyebrow.trim()
                        : null,

                title: title.trim(),

                description:
                    description && description.trim()
                        ? description.trim()
                        : null,

                display_order:
                    display_order !== undefined &&
                        display_order !== ""
                        ? Number(display_order)
                        : 0,

                is_active:
                    is_active !== undefined
                        ? Boolean(is_active)
                        : true,
            })
            .select(`
                id,
                image_url,
                eyebrow,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
            `)
            .single()

        if (error) {
            console.error(
                "Create hero slide error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to create hero slide",
                error: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message: "Hero slide created successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Create hero slide controller error:",
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
// UPDATE HERO SLIDE
// ============================================================

const updateHeroSlide = async (req, res) => {
    try {
        const { id } = req.params

        const {
            image_url,
            eyebrow,
            title,
            description,
            display_order,
            is_active,
        } = req.body

        // ------------------------------------------------------
        // VALIDATE ID
        // ------------------------------------------------------

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Hero slide ID is required",
            })
        }

        // ------------------------------------------------------
        // VALIDATE TITLE
        // ------------------------------------------------------

        if (
            title !== undefined &&
            (!title || !title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Hero title is required",
            })
        }

        // ------------------------------------------------------
        // FIND EXISTING SLIDE
        // ------------------------------------------------------

        const {
            data: existingSlide,
            error: existingError,
        } = await supabase
            .from("home_hero_slides")
            .select(`
                id,
                image_url,
                eyebrow,
                title,
                description,
                display_order,
                is_active
            `)
            .eq("id", id)
            .single()

        if (existingError || !existingSlide) {
            console.error(
                "Find hero slide error:",
                existingError,
            )

            return res.status(404).json({
                success: false,
                message: "Hero slide not found",
                error: existingError?.message,
            })
        }

        // ------------------------------------------------------
        // BUILD UPDATE OBJECT
        // ------------------------------------------------------

        const updateData = {
            updated_at: new Date().toISOString(),
        }

        // IMAGE
        if (image_url !== undefined) {
            if (
                typeof image_url !== "string" ||
                !image_url.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Hero image URL cannot be empty",
                })
            }

            updateData.image_url = image_url.trim()
        } else {
            updateData.image_url =
                existingSlide.image_url
        }

        // EYEBROW
        if (eyebrow !== undefined) {
            updateData.eyebrow =
                eyebrow &&
                    typeof eyebrow === "string" &&
                    eyebrow.trim()
                    ? eyebrow.trim()
                    : null
        } else {
            updateData.eyebrow =
                existingSlide.eyebrow
        }

        // TITLE
        if (title !== undefined) {
            updateData.title = title.trim()
        } else {
            updateData.title =
                existingSlide.title
        }

        // DESCRIPTION
        if (description !== undefined) {
            updateData.description =
                description &&
                    typeof description === "string" &&
                    description.trim()
                    ? description.trim()
                    : null
        } else {
            updateData.description =
                existingSlide.description
        }

        // DISPLAY ORDER
        if (
            display_order !== undefined &&
            display_order !== ""
        ) {
            updateData.display_order =
                Number(display_order)
        } else {
            updateData.display_order =
                existingSlide.display_order
        }

        // ACTIVE STATUS
        if (is_active !== undefined) {
            updateData.is_active =
                Boolean(is_active)
        } else {
            updateData.is_active =
                existingSlide.is_active
        }

        // ------------------------------------------------------
        // UPDATE DATABASE
        // ------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("home_hero_slides")
            .update(updateData)
            .eq("id", id)
            .select(`
                id,
                image_url,
                eyebrow,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
            `)
            .single()

        if (error) {
            console.error(
                "Update hero slide error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to update hero slide",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Hero slide updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update hero slide controller error:",
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
// DELETE HERO SLIDE
// ============================================================

const deleteHeroSlide = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Hero slide ID is required",
            })
        }

        // ------------------------------------------------------
        // FIND EXISTING SLIDE
        // ------------------------------------------------------

        const {
            data: existingSlide,
            error: findError,
        } = await supabase
            .from("home_hero_slides")
            .select(`
                id,
                image_url
            `)
            .eq("id", id)
            .single()

        if (findError || !existingSlide) {
            return res.status(404).json({
                success: false,
                message: "Hero slide not found",
            })
        }

        // ------------------------------------------------------
        // DELETE DATABASE RECORD
        // ------------------------------------------------------

        const { error } = await supabase
            .from("home_hero_slides")
            .delete()
            .eq("id", id)

        if (error) {
            console.error(
                "Delete hero slide error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to delete hero slide",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Hero slide deleted successfully",
        })
    } catch (error) {
        console.error(
            "Delete hero slide controller error:",
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
// UPLOAD HERO IMAGE
// Uploads image to Supabase Storage
// ============================================================

const uploadHeroImage = async (req, res) => {
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

        if (
            !file.mimetype ||
            !file.mimetype.startsWith("image/")
        ) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed",
            })
        }

        // ------------------------------------------------------
        // CREATE SAFE FILE EXTENSION
        // ------------------------------------------------------

        const originalExtension =
            file.originalname
                ?.split(".")
                .pop()
                ?.toLowerCase()

        const allowedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "avif",
        ]

        const fileExtension =
            allowedExtensions.includes(
                originalExtension,
            )
                ? originalExtension
                : "jpg"

        // ------------------------------------------------------
        // CREATE UNIQUE FILE NAME
        // ------------------------------------------------------

        const fileName = `hero-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}.${fileExtension}`

        // ------------------------------------------------------
        // SUPABASE STORAGE BUCKET
        // ------------------------------------------------------

        const bucketName = "Home"

        // ------------------------------------------------------
        // UPLOAD TO SUPABASE STORAGE
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
                "Hero image storage upload error:",
                uploadError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to upload hero image to Supabase Storage",
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
                    "Failed to generate hero image URL",
            })
        }

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Hero image uploaded successfully",
            image_url,
        })
    } catch (error) {
        console.error(
            "Hero image upload controller error:",
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
    getHeroSlides,
    getAllHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    uploadHeroImage,
}