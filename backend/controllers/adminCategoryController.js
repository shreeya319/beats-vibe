const supabase = require("../config/supabase")

// ============================================================
// GET ALL ADMIN CATEGORIES
// ============================================================
// Returns both active and inactive categories.
// Supports optional search by category name or slug.
// ============================================================

const getAdminCategories = async (req, res) => {
    try {
        const search = req.query.search?.trim() || ""

        let query = supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true })

        if (search) {
            query = query.or(
                `name.ilike.%${search}%,slug.ilike.%${search}%`,
            )
        }

        const { data, error } = await query

        if (error) {
            console.error(
                "Admin category fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to fetch categories",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Admin category controller error:",
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
// GET SINGLE ADMIN CATEGORY
// ============================================================

const getAdminCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            })
        }

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            console.error(
                "Admin category details error:",
                error,
            )

            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }

            return res.status(500).json({
                success: false,
                message: "Failed to fetch category",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Admin category details controller error:",
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
// CREATE CATEGORY
// ============================================================

const createCategory = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            image_url,
            is_active,
        } = req.body

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            })
        }

        if (!slug?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category slug is required",
            })
        }

        // ----------------------------------------------------
        // CHECK DUPLICATE NAME
        // ----------------------------------------------------

        const { data: existingName, error: nameError } =
            await supabase
                .from("categories")
                .select("id")
                .ilike("name", name.trim())
                .maybeSingle()

        if (nameError) {
            console.error(
                "Category name check error:",
                nameError,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to validate category name",
                error: nameError.message,
            })
        }

        if (existingName) {
            return res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            })
        }

        // ----------------------------------------------------
        // CHECK DUPLICATE SLUG
        // ----------------------------------------------------

        const { data: existingSlug, error: slugError } =
            await supabase
                .from("categories")
                .select("id")
                .eq("slug", slug.trim())
                .maybeSingle()

        if (slugError) {
            console.error(
                "Category slug check error:",
                slugError,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to validate category slug",
                error: slugError.message,
            })
        }

        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message: "A category with this slug already exists",
            })
        }

        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        const categoryData = {
            name: name.trim(),
            slug: slug.trim(),
            description:
                description?.trim() || null,
            image_url:
                image_url?.trim() || null,
            is_active:
                is_active !== undefined
                    ? is_active === true ||
                    is_active === "true"
                    : true,
        }

        const { data, error } = await supabase
            .from("categories")
            .insert([categoryData])
            .select("*")
            .single()

        if (error) {
            console.error(
                "Category creation error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to create category",
                error: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Create category controller error:",
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
// UPDATE CATEGORY
// ============================================================

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params

        const {
            name,
            slug,
            description,
            image_url,
            is_active,
        } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            })
        }

        // ----------------------------------------------------
        // CHECK CATEGORY EXISTS
        // ----------------------------------------------------

        const {
            data: existingCategory,
            error: existingError,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .single()

        if (existingError) {
            console.error(
                "Existing category check error:",
                existingError,
            )

            if (existingError.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }

            return res.status(500).json({
                success: false,
                message: "Failed to find category",
                error: existingError.message,
            })
        }

        // ----------------------------------------------------
        // VALIDATE NAME
        // ----------------------------------------------------

        if (
            name !== undefined &&
            !name?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Category name cannot be empty",
            })
        }

        // ----------------------------------------------------
        // VALIDATE SLUG
        // ----------------------------------------------------

        if (
            slug !== undefined &&
            !slug?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Category slug cannot be empty",
            })
        }

        // ----------------------------------------------------
        // CHECK DUPLICATE NAME
        // ----------------------------------------------------

        if (
            name !== undefined &&
            name.trim().toLowerCase() !==
            existingCategory.name
                .trim()
                .toLowerCase()
        ) {
            const {
                data: duplicateName,
                error: duplicateNameError,
            } = await supabase
                .from("categories")
                .select("id")
                .ilike("name", name.trim())
                .neq("id", id)
                .maybeSingle()

            if (duplicateNameError) {
                console.error(
                    "Duplicate name check error:",
                    duplicateNameError,
                )

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to validate category name",
                    error:
                        duplicateNameError.message,
                })
            }

            if (duplicateName) {
                return res.status(409).json({
                    success: false,
                    message:
                        "A category with this name already exists",
                })
            }
        }

        // ----------------------------------------------------
        // CHECK DUPLICATE SLUG
        // ----------------------------------------------------

        if (
            slug !== undefined &&
            slug.trim() !== existingCategory.slug
        ) {
            const {
                data: duplicateSlug,
                error: duplicateSlugError,
            } = await supabase
                .from("categories")
                .select("id")
                .eq("slug", slug.trim())
                .neq("id", id)
                .maybeSingle()

            if (duplicateSlugError) {
                console.error(
                    "Duplicate slug check error:",
                    duplicateSlugError,
                )

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to validate category slug",
                    error:
                        duplicateSlugError.message,
                })
            }

            if (duplicateSlug) {
                return res.status(409).json({
                    success: false,
                    message:
                        "A category with this slug already exists",
                })
            }
        }

        // ----------------------------------------------------
        // BUILD UPDATE DATA
        // ----------------------------------------------------

        const updateData = {
            updated_at: new Date().toISOString(),
        }

        if (name !== undefined) {
            updateData.name = name.trim()
        }

        if (slug !== undefined) {
            updateData.slug = slug.trim()
        }

        if (description !== undefined) {
            updateData.description =
                description?.trim() || null
        }

        if (image_url !== undefined) {
            updateData.image_url =
                image_url?.trim() || null
        }

        if (is_active !== undefined) {
            updateData.is_active =
                is_active === true ||
                is_active === "true"
        }

        // ----------------------------------------------------
        // UPDATE
        // ----------------------------------------------------

        const { data, error } = await supabase
            .from("categories")
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single()

        if (error) {
            console.error(
                "Category update error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message: "Failed to update category",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update category controller error:",
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
// DELETE CATEGORY
// ============================================================

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            })
        }

        // ----------------------------------------------------
        // CHECK CATEGORY EXISTS
        // ----------------------------------------------------

        const {
            data: category,
            error: categoryError,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .single()

        if (categoryError) {
            console.error(
                "Category delete lookup error:",
                categoryError,
            )

            if (categoryError.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                })
            }

            return res.status(500).json({
                success: false,
                message: "Failed to find category",
                error: categoryError.message,
            })
        }

        // ----------------------------------------------------
        // DELETE
        // ----------------------------------------------------

        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id)

        if (error) {
            console.error(
                "Category deletion error:",
                error,
            )

            // Foreign-key related deletion failure
            if (
                error.code === "23503"
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "This category cannot be deleted because products are associated with it. Please move or remove those products first.",
                    error: error.message,
                })
            }

            return res.status(500).json({
                success: false,
                message: "Failed to delete category",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: `"${category.name}" deleted successfully`,
        })
    } catch (error) {
        console.error(
            "Delete category controller error:",
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
    getAdminCategories,
    getAdminCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}