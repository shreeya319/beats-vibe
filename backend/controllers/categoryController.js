const supabase = require("../config/supabase")

const CATEGORY_BUCKET = "category-images"

// ============================================================
// HELPER - CREATE SLUG
// ============================================================

const createSlug = (value) => {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

// ============================================================
// HELPER - UPLOAD CATEGORY IMAGE
// ============================================================

const uploadCategoryImage = async (file) => {
    if (!file) {
        return null
    }

    const extension =
        file.originalname
            ?.split(".")
            .pop()
            ?.toLowerCase() || "jpg"

    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${extension}`

    const filePath = `categories/${fileName}`

    const {
        error: uploadError,
    } = await supabase.storage
        .from(CATEGORY_BUCKET)
        .upload(
            filePath,
            file.buffer,
            {
                contentType:
                    file.mimetype,
                upsert: false,
            },
        )

    if (uploadError) {
        console.error(
            "Category image upload error:",
            uploadError,
        )

        throw new Error(
            `Failed to upload category image: ${uploadError.message}`,
        )
    }

    const {
        data: publicUrlData,
    } = supabase.storage
        .from(CATEGORY_BUCKET)
        .getPublicUrl(filePath)

    return {
        url: publicUrlData.publicUrl,
        path: filePath,
    }
}

// ============================================================
// HELPER - DELETE CATEGORY IMAGE
// ============================================================

const deleteCategoryImage = async (
    imageUrl,
) => {
    if (!imageUrl) {
        return
    }

    try {
        const url = new URL(imageUrl)

        const marker =
            `/storage/v1/object/public/${CATEGORY_BUCKET}/`

        const index =
            url.pathname.indexOf(marker)

        if (index === -1) {
            return
        }

        const filePath =
            decodeURIComponent(
                url.pathname.substring(
                    index + marker.length,
                ),
            )

        if (!filePath) {
            return
        }

        const {
            error,
        } = await supabase.storage
            .from(CATEGORY_BUCKET)
            .remove([filePath])

        if (error) {
            console.error(
                "Category image delete error:",
                error,
            )
        }
    } catch (error) {
        console.error(
            "Category image URL parsing error:",
            error,
        )
    }
}

// ============================================================
// GET ACTIVE CATEGORIES
// ============================================================

const getCategories = async (
    req,
    res,
) => {
    try {
        const {
            data,
            error,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("name", {
                ascending: true,
            })

        if (error) {
            console.error(
                "Category fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch categories",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error(
            "Category controller error:",
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
// GET ADMIN CATEGORIES
// ============================================================

const getAdminCategories = async (
    req,
    res,
) => {
    try {
        const search =
            req.query.search?.trim() || ""

        let query = supabase
            .from("categories")
            .select("*")
            .order("name", {
                ascending: true,
            })

        if (search) {
            query = query.or(
                `name.ilike.%${search}%,slug.ilike.%${search}%`,
            )
        }

        const {
            data,
            error,
        } = await query

        if (error) {
            console.error(
                "Admin category fetch error:",
                error,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch categories",
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
            message:
                "Failed to fetch categories",
            error: error.message,
        })
    }
}

// ============================================================
// GET SINGLE ADMIN CATEGORY
// ============================================================

const getAdminCategoryById = async (
    req,
    res,
) => {
    try {
        const categoryId =
            req.params.id

        const {
            data,
            error,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single()

        if (error) {
            console.error(
                "Get category error:",
                error,
            )

            return res.status(404).json({
                success: false,
                message:
                    "Category not found",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get admin category controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch category",
            error: error.message,
        })
    }
}

// ============================================================
// CREATE CATEGORY
// ============================================================

const createCategory = async (
    req,
    res,
) => {
    let uploadedImagePath = null

    try {
        const {
            name,
            slug,
            description,
            is_active,
        } = req.body

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Category name is required",
            })
        }

        const finalSlug =
            slug?.trim() ||
            createSlug(name)

        if (!finalSlug) {
            return res.status(400).json({
                success: false,
                message:
                    "Category slug is required",
            })
        }

        // --------------------------------------------------------
        // CHECK DUPLICATE NAME
        // --------------------------------------------------------

        const {
            data: existingName,
        } = await supabase
            .from("categories")
            .select("id")
            .eq("name", name.trim())
            .maybeSingle()

        if (existingName) {
            return res.status(409).json({
                success: false,
                message:
                    "A category with this name already exists.",
            })
        }

        // --------------------------------------------------------
        // CHECK DUPLICATE SLUG
        // --------------------------------------------------------

        const {
            data: existingSlug,
        } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", finalSlug)
            .maybeSingle()

        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message:
                    "A category with this slug already exists.",
            })
        }

        // --------------------------------------------------------
        // UPLOAD IMAGE
        // --------------------------------------------------------

        let imageUrl = null

        if (req.file) {
            const uploaded =
                await uploadCategoryImage(
                    req.file,
                )

            imageUrl = uploaded.url
            uploadedImagePath =
                uploaded.path
        }

        // --------------------------------------------------------
        // CREATE CATEGORY
        // --------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("categories")
            .insert({
                name: name.trim(),
                slug: finalSlug,
                description:
                    description?.trim() ||
                    null,
                image_url: imageUrl,
                is_active:
                    is_active === undefined
                        ? true
                        : String(
                            is_active,
                        ) === "true",
            })
            .select("*")
            .single()

        if (error) {
            console.error(
                "Create category database error:",
                error,
            )

            // Cleanup uploaded image
            if (uploadedImagePath) {
                await supabase.storage
                    .from(CATEGORY_BUCKET)
                    .remove([
                        uploadedImagePath,
                    ])
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create category",
                error: error.message,
            })
        }

        return res.status(201).json({
            success: true,
            message:
                "Category created successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Create category controller error:",
            error,
        )

        if (uploadedImagePath) {
            await supabase.storage
                .from(CATEGORY_BUCKET)
                .remove([
                    uploadedImagePath,
                ])
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create category",
            error: error.message,
        })
    }
}

// ============================================================
// UPDATE CATEGORY
// ============================================================

const updateCategory = async (
    req,
    res,
) => {
    let uploadedImagePath = null

    try {
        const categoryId =
            req.params.id

        const {
            name,
            slug,
            description,
            is_active,
        } = req.body

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Category name is required",
            })
        }

        const finalSlug =
            slug?.trim() ||
            createSlug(name)

        // --------------------------------------------------------
        // GET EXISTING CATEGORY
        // --------------------------------------------------------

        const {
            data: existingCategory,
            error: existingError,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single()

        if (
            existingError ||
            !existingCategory
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Category not found",
            })
        }

        // --------------------------------------------------------
        // CHECK DUPLICATE NAME
        // --------------------------------------------------------

        const {
            data: duplicateName,
        } = await supabase
            .from("categories")
            .select("id")
            .eq("name", name.trim())
            .neq("id", categoryId)
            .maybeSingle()

        if (duplicateName) {
            return res.status(409).json({
                success: false,
                message:
                    "Another category with this name already exists.",
            })
        }

        // --------------------------------------------------------
        // CHECK DUPLICATE SLUG
        // --------------------------------------------------------

        const {
            data: duplicateSlug,
        } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", finalSlug)
            .neq("id", categoryId)
            .maybeSingle()

        if (duplicateSlug) {
            return res.status(409).json({
                success: false,
                message:
                    "Another category with this slug already exists.",
            })
        }

        // --------------------------------------------------------
        // IMAGE
        // --------------------------------------------------------

        let imageUrl =
            existingCategory.image_url

        if (req.file) {
            const uploaded =
                await uploadCategoryImage(
                    req.file,
                )

            imageUrl = uploaded.url
            uploadedImagePath =
                uploaded.path
        }

        // --------------------------------------------------------
        // UPDATE DATABASE
        // --------------------------------------------------------

        const {
            data,
            error,
        } = await supabase
            .from("categories")
            .update({
                name: name.trim(),
                slug: finalSlug,
                description:
                    description?.trim() ||
                    null,
                image_url: imageUrl,
                is_active:
                    is_active === undefined
                        ? existingCategory.is_active
                        : String(
                            is_active,
                        ) === "true",
                updated_at:
                    new Date().toISOString(),
            })
            .eq("id", categoryId)
            .select("*")
            .single()

        if (error) {
            console.error(
                "Update category database error:",
                error,
            )

            if (uploadedImagePath) {
                await supabase.storage
                    .from(CATEGORY_BUCKET)
                    .remove([
                        uploadedImagePath,
                    ])
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update category",
                error: error.message,
            })
        }

        // --------------------------------------------------------
        // DELETE OLD IMAGE AFTER SUCCESSFUL UPDATE
        // --------------------------------------------------------

        if (
            req.file &&
            existingCategory.image_url
        ) {
            await deleteCategoryImage(
                existingCategory.image_url,
            )
        }

        return res.status(200).json({
            success: true,
            message:
                "Category updated successfully",
            data,
        })
    } catch (error) {
        console.error(
            "Update category controller error:",
            error,
        )

        if (uploadedImagePath) {
            await supabase.storage
                .from(CATEGORY_BUCKET)
                .remove([
                    uploadedImagePath,
                ])
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update category",
            error: error.message,
        })
    }
}

// ============================================================
// DELETE CATEGORY
// ============================================================

const deleteCategory = async (
    req,
    res,
) => {
    try {
        const categoryId =
            req.params.id

        // --------------------------------------------------------
        // GET CATEGORY
        // --------------------------------------------------------

        const {
            data: category,
            error: categoryError,
        } = await supabase
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single()

        if (
            categoryError ||
            !category
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Category not found",
            })
        }

        // --------------------------------------------------------
        // CHECK PRODUCTS
        // --------------------------------------------------------

        const {
            count,
            error: productError,
        } = await supabase
            .from("products")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq(
                "category_id",
                categoryId,
            )

        if (productError) {
            console.error(
                "Category product check error:",
                productError,
            )
        }

        if (
            count &&
            count > 0
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This category cannot be deleted because products are associated with it.",
            })
        }

        // --------------------------------------------------------
        // DELETE CATEGORY
        // --------------------------------------------------------

        const {
            error: deleteError,
        } = await supabase
            .from("categories")
            .delete()
            .eq("id", categoryId)

        if (deleteError) {
            console.error(
                "Delete category error:",
                deleteError,
            )

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete category",
                error:
                    deleteError.message,
            })
        }

        // --------------------------------------------------------
        // DELETE IMAGE
        // --------------------------------------------------------

        if (category.image_url) {
            await deleteCategoryImage(
                category.image_url,
            )
        }

        return res.status(200).json({
            success: true,
            message:
                `"${category.name}" deleted successfully`,
            data: {
                id: category.id,
            },
        })
    } catch (error) {
        console.error(
            "Delete category controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete category",
            error: error.message,
        })
    }
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getCategories,
    getAdminCategories,
    getAdminCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}