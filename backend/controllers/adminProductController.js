const supabase = require("../config/supabase")

// ============================================================
// CREATE PRODUCT
// ============================================================

const createProduct = async (req, res) => {
    let uploadedFilePath = null
    let createdProductId = null

    try {
        const {
            name,
            slug,
            sku,
            brand,
            description,
            category_id,
            price,
            discount_price,
            stock_quantity,
            is_featured = "false",
            is_active = "true",
            specifications,
        } = req.body

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            })
        }

        if (!slug?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product slug is required",
            })
        }

        if (!sku?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product SKU is required",
            })
        }

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Product price is required",
            })
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative",
            })
        }

        if (
            discount_price !== undefined &&
            discount_price !== null &&
            discount_price !== ""
        ) {
            if (Number(discount_price) < 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Discount price cannot be negative",
                })
            }

            if (
                Number(discount_price) >
                Number(price)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Discount price cannot be greater than the original price",
                })
            }
        }

        if (
            stock_quantity === undefined ||
            stock_quantity === null ||
            stock_quantity === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock quantity is required",
            })
        }

        if (Number(stock_quantity) < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock quantity cannot be negative",
            })
        }

        // ========================================================
        // IMAGE VALIDATION
        // ========================================================

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Product image is required",
            })
        }

        // ========================================================
        // CATEGORY VALIDATION
        // ========================================================

        if (category_id) {
            const {
                data: category,
                error: categoryError,
            } = await supabase
                .from("categories")
                .select("id")
                .eq("id", category_id)
                .eq("is_active", true)
                .single()

            if (categoryError || !category) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid category selected",
                })
            }
        }

        // ========================================================
        // CHECK SLUG
        // ========================================================

        const {
            data: existingSlug,
            error: slugError,
        } = await supabase
            .from("products")
            .select("id")
            .eq("slug", slug.trim())
            .maybeSingle()

        if (slugError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to validate product slug",
                error: slugError.message,
            })
        }

        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message:
                    "A product with this slug already exists",
            })
        }

        // ========================================================
        // CHECK SKU
        // ========================================================

        const {
            data: existingSku,
            error: skuError,
        } = await supabase
            .from("products")
            .select("id")
            .eq("sku", sku.trim())
            .maybeSingle()

        if (skuError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to validate product SKU",
                error: skuError.message,
            })
        }

        if (existingSku) {
            return res.status(409).json({
                success: false,
                message:
                    "A product with this SKU already exists",
            })
        }

        // ========================================================
        // UPLOAD IMAGE
        // ========================================================

        const file = req.file

        const extension =
            file.originalname
                .split(".")
                .pop()
                .toLowerCase()

        const safeName = name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")

        const uniqueName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`

        uploadedFilePath =
            `${safeName}-${uniqueName}.${extension}`

        const {
            error: uploadError,
        } = await supabase.storage
            .from("product-images")
            .upload(
                uploadedFilePath,
                file.buffer,
                {
                    contentType: file.mimetype,
                    upsert: false,
                },
            )

        if (uploadError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to upload product image",
                error: uploadError.message,
            })
        }

        // ========================================================
        // PUBLIC IMAGE URL
        // ========================================================

        const {
            data: publicUrlData,
        } = supabase.storage
            .from("product-images")
            .getPublicUrl(
                uploadedFilePath,
            )

        const imageUrl =
            publicUrlData?.publicUrl

        if (!imageUrl) {
            await supabase.storage
                .from("product-images")
                .remove([
                    uploadedFilePath,
                ])

            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate product image URL",
            })
        }

        // ========================================================
        // CREATE PRODUCT
        // ========================================================

        const productData = {
            category_id:
                category_id || null,

            name: name.trim(),

            slug: slug.trim(),

            sku: sku.trim(),

            brand:
                brand?.trim() || null,

            description:
                description?.trim() || null,

            price: Number(price),

            discount_price:
                discount_price !== undefined &&
                    discount_price !== null &&
                    discount_price !== ""
                    ? Number(discount_price)
                    : null,

            stock_quantity:
                Number(stock_quantity),

            is_featured:
                is_featured === true ||
                is_featured === "true",

            is_active:
                is_active === true ||
                is_active === "true",
        }

        const {
            data: product,
            error: productError,
        } = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single()

        if (productError) {
            await supabase.storage
                .from("product-images")
                .remove([
                    uploadedFilePath,
                ])

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create product",
                error: productError.message,
            })
        }

        createdProductId = product.id

        // ========================================================
        // SAVE PRODUCT IMAGE
        // ========================================================

        const {
            data: productImage,
            error: imageError,
        } = await supabase
            .from("product_images")
            .insert({
                product_id: product.id,
                image_url: imageUrl,
                alt_text: name.trim(),
                is_primary: true,
                display_order: 0,
            })
            .select()
            .single()

        if (imageError) {
            await supabase
                .from("products")
                .delete()
                .eq("id", product.id)

            await supabase.storage
                .from("product-images")
                .remove([
                    uploadedFilePath,
                ])

            return res.status(500).json({
                success: false,
                message:
                    "Failed to save product image",
                error: imageError.message,
            })
        }

        // ========================================================
        // SAVE SPECIFICATIONS
        // ========================================================

        let parsedSpecifications = []

        if (specifications) {
            try {
                parsedSpecifications =
                    typeof specifications ===
                        "string"
                        ? JSON.parse(
                            specifications,
                        )
                        : specifications
            } catch {
                await supabase
                    .from("product_images")
                    .delete()
                    .eq(
                        "id",
                        productImage.id,
                    )

                await supabase
                    .from("products")
                    .delete()
                    .eq(
                        "id",
                        product.id,
                    )

                await supabase.storage
                    .from("product-images")
                    .remove([
                        uploadedFilePath,
                    ])

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid specifications format",
                })
            }
        }

        if (
            Array.isArray(
                parsedSpecifications,
            ) &&
            parsedSpecifications.length > 0
        ) {
            const validSpecifications =
                parsedSpecifications
                    .filter(
                        (item) =>
                            item &&
                            item.name?.trim() &&
                            item.value?.trim(),
                    )
                    .map((item) => ({
                        product_id:
                            product.id,
                        specification_name:
                            item.name.trim(),
                        specification_value:
                            item.value.trim(),
                    }))

            if (
                validSpecifications.length > 0
            ) {
                const {
                    error:
                    specificationsError,
                } = await supabase
                    .from(
                        "product_specifications",
                    )
                    .insert(
                        validSpecifications,
                    )

                if (specificationsError) {
                    await supabase
                        .from(
                            "product_images",
                        )
                        .delete()
                        .eq(
                            "id",
                            productImage.id,
                        )

                    await supabase
                        .from("products")
                        .delete()
                        .eq(
                            "id",
                            product.id,
                        )

                    await supabase.storage
                        .from(
                            "product-images",
                        )
                        .remove([
                            uploadedFilePath,
                        ])

                    return res.status(
                        500,
                    ).json({
                        success: false,
                        message:
                            "Failed to create product specifications",
                        error:
                            specificationsError.message,
                    })
                }
            }
        }

        // ========================================================
        // SUCCESS
        // ========================================================

        return res.status(201).json({
            success: true,
            message:
                "Product created successfully",
            data: {
                product,
                image: productImage,
            },
        })
    } catch (error) {
        console.error(
            "Create product controller error:",
            error,
        )

        if (createdProductId) {
            await supabase
                .from("products")
                .delete()
                .eq(
                    "id",
                    createdProductId,
                )
        }

        if (uploadedFilePath) {
            await supabase.storage
                .from("product-images")
                .remove([
                    uploadedFilePath,
                ])
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to create product",
            error: error.message,
        })
    }
}


// ============================================================
// GET SINGLE ADMIN PRODUCT
// ============================================================

const getAdminProductById = async (req, res) => {
    try {
        const productId = req.params.id

        const {
            data,
            error,
        } = await supabase
            .from("products")
            .select(`
                *,
                categories (
                    id,
                    name,
                    slug
                ),
                product_images (
                    id,
                    image_url,
                    alt_text,
                    is_primary,
                    display_order
                ),
                product_specifications (
                    id,
                    specification_name,
                    specification_value
                )
            `)
            .eq("id", productId)
            .single()

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        return res.status(200).json({
            success: true,
            data,
        })
    } catch (error) {
        console.error(
            "Get admin product error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch product",
            error: error.message,
        })
    }
}


// ============================================================
// UPDATE PRODUCT
// ============================================================

const updateProduct = async (req, res) => {
    let newUploadedFilePath = null

    try {
        const productId = req.params.id

        const {
            name,
            slug,
            sku,
            brand,
            description,
            category_id,
            price,
            discount_price,
            stock_quantity,
            is_featured,
            is_active,
            specifications,
        } = req.body

        // ========================================================
        // GET EXISTING PRODUCT
        // ========================================================

        const {
            data: existingProduct,
            error: existingProductError,
        } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .single()

        if (
            existingProductError ||
            !existingProduct
        ) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Product name is required",
            })
        }

        if (!slug?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Product slug is required",
            })
        }

        if (!sku?.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Product SKU is required",
            })
        }

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product price is required",
            })
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Price cannot be negative",
            })
        }

        if (
            discount_price !== undefined &&
            discount_price !== null &&
            discount_price !== ""
        ) {
            if (Number(discount_price) < 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Discount price cannot be negative",
                })
            }

            if (
                Number(discount_price) >
                Number(price)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Discount price cannot be greater than the original price",
                })
            }
        }

        if (
            stock_quantity === undefined ||
            stock_quantity === null ||
            stock_quantity === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock quantity is required",
            })
        }

        if (Number(stock_quantity) < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock quantity cannot be negative",
            })
        }

        // ========================================================
        // CATEGORY VALIDATION
        // ========================================================

        if (category_id) {
            const {
                data: category,
                error: categoryError,
            } = await supabase
                .from("categories")
                .select("id")
                .eq("id", category_id)
                .eq("is_active", true)
                .single()

            if (categoryError || !category) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid category selected",
                })
            }
        }

        // ========================================================
        // CHECK SLUG DUPLICATE
        // ========================================================

        const {
            data: duplicateSlug,
            error: duplicateSlugError,
        } = await supabase
            .from("products")
            .select("id")
            .eq("slug", slug.trim())
            .neq("id", productId)
            .maybeSingle()

        if (duplicateSlugError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to validate product slug",
                error:
                    duplicateSlugError.message,
            })
        }

        if (duplicateSlug) {
            return res.status(409).json({
                success: false,
                message:
                    "A product with this slug already exists",
            })
        }

        // ========================================================
        // CHECK SKU DUPLICATE
        // ========================================================

        const {
            data: duplicateSku,
            error: duplicateSkuError,
        } = await supabase
            .from("products")
            .select("id")
            .eq("sku", sku.trim())
            .neq("id", productId)
            .maybeSingle()

        if (duplicateSkuError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to validate product SKU",
                error:
                    duplicateSkuError.message,
            })
        }

        if (duplicateSku) {
            return res.status(409).json({
                success: false,
                message:
                    "A product with this SKU already exists",
            })
        }

        // ========================================================
        // PREPARE UPDATE
        // ========================================================

        const productUpdate = {
            category_id:
                category_id || null,

            name: name.trim(),

            slug: slug.trim(),

            sku: sku.trim(),

            brand:
                brand?.trim() || null,

            description:
                description?.trim() || null,

            price: Number(price),

            discount_price:
                discount_price !== undefined &&
                    discount_price !== null &&
                    discount_price !== ""
                    ? Number(
                        discount_price,
                    )
                    : null,

            stock_quantity:
                Number(stock_quantity),

            is_featured:
                is_featured === true ||
                is_featured === "true",

            is_active:
                is_active === true ||
                is_active === "true",

            updated_at:
                new Date().toISOString(),
        }

        // ========================================================
        // HANDLE NEW IMAGE
        // ========================================================

        let newImageUrl = null
        let oldImagePath = null
        let oldImageId = null

        if (req.file) {
            const file = req.file

            const extension =
                file.originalname
                    .split(".")
                    .pop()
                    .toLowerCase()

            const safeName = name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")

            const uniqueName =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`

            newUploadedFilePath =
                `${safeName}-${uniqueName}.${extension}`

            const {
                error: uploadError,
            } = await supabase.storage
                .from("product-images")
                .upload(
                    newUploadedFilePath,
                    file.buffer,
                    {
                        contentType:
                            file.mimetype,
                        upsert: false,
                    },
                )

            if (uploadError) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to upload new product image",
                    error:
                        uploadError.message,
                })
            }

            const {
                data: publicUrlData,
            } = supabase.storage
                .from("product-images")
                .getPublicUrl(
                    newUploadedFilePath,
                )

            newImageUrl =
                publicUrlData?.publicUrl

            if (!newImageUrl) {
                await supabase.storage
                    .from("product-images")
                    .remove([
                        newUploadedFilePath,
                    ])

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to generate new image URL",
                })
            }

            // Get old primary image
            const {
                data: oldImage,
            } = await supabase
                .from("product_images")
                .select("*")
                .eq(
                    "product_id",
                    productId,
                )
                .eq(
                    "is_primary",
                    true,
                )
                .maybeSingle()

            if (oldImage) {
                oldImageId = oldImage.id

                try {
                    const url = new URL(
                        oldImage.image_url,
                    )

                    const marker =
                        "/storage/v1/object/public/product-images/"

                    const index =
                        url.pathname.indexOf(
                            marker,
                        )

                    if (index !== -1) {
                        oldImagePath =
                            decodeURIComponent(
                                url.pathname.substring(
                                    index +
                                    marker.length,
                                ),
                            )
                    }
                } catch {
                    oldImagePath = null
                }
            }
        }

        // ========================================================
        // UPDATE PRODUCT
        // ========================================================

        const {
            data: updatedProduct,
            error: updateError,
        } = await supabase
            .from("products")
            .update(productUpdate)
            .eq("id", productId)
            .select()
            .single()

        if (updateError) {
            if (newUploadedFilePath) {
                await supabase.storage
                    .from("product-images")
                    .remove([
                        newUploadedFilePath,
                    ])
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update product",
                error: updateError.message,
            })
        }

        // ========================================================
        // UPDATE IMAGE
        // ========================================================

        let updatedImage = null

        if (newImageUrl) {
            if (oldImageId) {
                const {
                    data: imageData,
                    error: imageUpdateError,
                } = await supabase
                    .from("product_images")
                    .update({
                        image_url:
                            newImageUrl,
                        alt_text:
                            name.trim(),
                        is_primary: true,
                        display_order: 0,
                    })
                    .eq(
                        "id",
                        oldImageId,
                    )
                    .select()
                    .single()

                if (imageUpdateError) {
                    return res.status(500).json({
                        success: false,
                        message:
                            "Product updated but image could not be updated",
                        error:
                            imageUpdateError.message,
                    })
                }

                updatedImage = imageData
            } else {
                const {
                    data: imageData,
                    error: imageInsertError,
                } = await supabase
                    .from("product_images")
                    .insert({
                        product_id:
                            productId,
                        image_url:
                            newImageUrl,
                        alt_text:
                            name.trim(),
                        is_primary: true,
                        display_order: 0,
                    })
                    .select()
                    .single()

                if (imageInsertError) {
                    return res.status(500).json({
                        success: false,
                        message:
                            "Product updated but new image could not be saved",
                        error:
                            imageInsertError.message,
                    })
                }

                updatedImage = imageData
            }

            // Remove old image from storage
            if (oldImagePath) {
                await supabase.storage
                    .from("product-images")
                    .remove([
                        oldImagePath,
                    ])
            }
        }

        // ========================================================
        // UPDATE SPECIFICATIONS
        // ========================================================

        let parsedSpecifications = []

        if (specifications) {
            try {
                parsedSpecifications =
                    typeof specifications ===
                        "string"
                        ? JSON.parse(
                            specifications,
                        )
                        : specifications
            } catch {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid specifications format",
                })
            }
        }

        // Delete old specifications
        const {
            error:
            deleteSpecificationsError,
        } = await supabase
            .from(
                "product_specifications",
            )
            .delete()
            .eq(
                "product_id",
                productId,
            )

        if (deleteSpecificationsError) {
            return res.status(500).json({
                success: false,
                message:
                    "Product updated but specifications could not be updated",
                error:
                    deleteSpecificationsError.message,
            })
        }

        // Insert new specifications
        if (
            Array.isArray(
                parsedSpecifications,
            ) &&
            parsedSpecifications.length > 0
        ) {
            const validSpecifications =
                parsedSpecifications
                    .filter(
                        (item) =>
                            item &&
                            item.name?.trim() &&
                            item.value?.trim(),
                    )
                    .map((item) => ({
                        product_id:
                            productId,

                        specification_name:
                            item.name.trim(),

                        specification_value:
                            item.value.trim(),
                    }))

            if (
                validSpecifications.length > 0
            ) {
                const {
                    error:
                    specificationsError,
                } = await supabase
                    .from(
                        "product_specifications",
                    )
                    .insert(
                        validSpecifications,
                    )

                if (specificationsError) {
                    return res.status(500).json({
                        success: false,
                        message:
                            "Product updated but specifications could not be saved",
                        error:
                            specificationsError.message,
                    })
                }
            }
        }

        // ========================================================
        // GET COMPLETE UPDATED PRODUCT
        // ========================================================

        const {
            data: completeProduct,
            error: completeProductError,
        } = await supabase
            .from("products")
            .select(`
                *,
                categories (
                    id,
                    name,
                    slug
                ),
                product_images (
                    id,
                    image_url,
                    alt_text,
                    is_primary,
                    display_order
                ),
                product_specifications (
                    id,
                    specification_name,
                    specification_value
                )
            `)
            .eq("id", productId)
            .single()

        if (completeProductError) {
            return res.status(500).json({
                success: false,
                message:
                    "Product updated but failed to fetch updated product",
                error:
                    completeProductError.message,
            })
        }

        return res.status(200).json({
            success: true,
            message:
                "Product updated successfully",
            data: completeProduct,
            image: updatedImage,
        })
    } catch (error) {
        console.error(
            "Update product controller error:",
            error,
        )

        if (newUploadedFilePath) {
            await supabase.storage
                .from("product-images")
                .remove([
                    newUploadedFilePath,
                ])
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update product",
            error: error.message,
        })
    }
}


// ============================================================
// DELETE PRODUCT
// ============================================================

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id

        // ========================================================
        // GET PRODUCT IMAGES
        // ========================================================

        const {
            data: images,
            error: imagesError,
        } = await supabase
            .from("product_images")
            .select(
                "id, image_url",
            )
            .eq(
                "product_id",
                productId,
            )

        if (imagesError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to find product images",
                error:
                    imagesError.message,
            })
        }

        // ========================================================
        // CHECK PRODUCT
        // ========================================================

        const {
            data: product,
            error: productError,
        } = await supabase
            .from("products")
            .select(
                "id, name",
            )
            .eq(
                "id",
                productId,
            )
            .single()

        if (
            productError ||
            !product
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            })
        }

        // ========================================================
        // EXTRACT STORAGE FILE PATHS
        // ========================================================

        const filePaths = []

        for (const image of images || []) {
            try {
                const url = new URL(
                    image.image_url,
                )

                const marker =
                    "/storage/v1/object/public/product-images/"

                const index =
                    url.pathname.indexOf(
                        marker,
                    )

                if (index !== -1) {
                    const filePath =
                        decodeURIComponent(
                            url.pathname.substring(
                                index +
                                marker.length,
                            ),
                        )

                    filePaths.push(
                        filePath,
                    )
                }
            } catch {
                // Ignore invalid external image URLs
            }
        }

        // ========================================================
        // DELETE PRODUCT
        // ========================================================

        const {
            error: deleteError,
        } = await supabase
            .from("products")
            .delete()
            .eq(
                "id",
                productId,
            )

        if (deleteError) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete product",
                error:
                    deleteError.message,
            })
        }

        // ========================================================
        // DELETE STORAGE FILES
        // ========================================================

        if (filePaths.length > 0) {
            const {
                error: storageDeleteError,
            } = await supabase.storage
                .from("product-images")
                .remove(
                    filePaths,
                )

            if (storageDeleteError) {
                console.error(
                    "Storage image deletion error:",
                    storageDeleteError,
                )
            }
        }

        return res.status(200).json({
            success: true,
            message:
                `"${product.name}" deleted successfully`,
            data: {
                id: product.id,
            },
        })
    } catch (error) {
        console.error(
            "Delete product controller error:",
            error,
        )

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete product",
            error: error.message,
        })
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createProduct,
    getAdminProductById,
    updateProduct,
    deleteProduct,
}