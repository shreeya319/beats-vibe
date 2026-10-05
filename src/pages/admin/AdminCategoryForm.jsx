import { useEffect, useState } from "react"
import {
    ArrowLeft,
    CheckCircle,
    FolderOpen,
    ImagePlus,
    Save,
    Upload,
    X,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
    createCategory,
    getAdminCategoryById,
    updateCategory,
} from "../../services/categoryService"

function AdminCategoryForm() {
    const navigate = useNavigate()
    const { id } = useParams()

    const isEditMode = Boolean(id)

    // ============================================================
    // FORM STATE
    // ============================================================

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        is_active: true,
    })

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEditMode)

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] =
        useState("")

    // ============================================================
    // FETCH EXISTING CATEGORY
    // ============================================================

    useEffect(() => {
        if (!isEditMode) {
            return
        }

        const fetchCategory = async () => {
            try {
                setFetching(true)
                setError("")

                const result =
                    await getAdminCategoryById(id)

                if (!result?.success) {
                    throw new Error(
                        result?.message ||
                            "Failed to load category",
                    )
                }

                const category = result.data

                if (!category) {
                    throw new Error(
                        "Category not found",
                    )
                }

                setFormData({
                    name: category.name || "",
                    slug: category.slug || "",
                    description:
                        category.description || "",
                    is_active:
                        category.is_active !== false,
                })

                if (category.image_url) {
                    setImagePreview(
                        category.image_url,
                    )
                }
            } catch (err) {
                console.error(
                    "Admin category fetch error:",
                    err,
                )

                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Unable to load category.",
                )
            } finally {
                setFetching(false)
            }
        }

        fetchCategory()
    }, [id, isEditMode])

    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }))
    }

    // ============================================================
    // IMAGE SELECT
    // ============================================================

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        // Only allow common image types
        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file.",
            )

            event.target.value = ""
            return
        }

        // 5 MB limit
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be less than 5 MB.",
            )

            event.target.value = ""
            return
        }

        setError("")
        setImageFile(file)

        const previewUrl =
            URL.createObjectURL(file)

        setImagePreview(previewUrl)
    }

    // ============================================================
    // REMOVE SELECTED IMAGE
    // ============================================================

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview("")

        const input =
            document.getElementById(
                "category-image",
            )

        if (input) {
            input.value = ""
        }
    }

    // ============================================================
    // GENERATE SLUG
    // ============================================================

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s-]/g,
                "",
            )
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")

        setFormData((current) => ({
            ...current,
            slug,
        }))
    }

    // ============================================================
    // FORM SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setSuccessMessage("")

        const name = formData.name.trim()
        const slug = formData.slug.trim()

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!name) {
            setError(
                "Category name is required.",
            )
            return
        }

        if (name.length < 2) {
            setError(
                "Category name must contain at least 2 characters.",
            )
            return
        }

        if (!slug) {
            setError(
                "Category slug is required.",
            )
            return
        }

        if (
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
                slug,
            )
        ) {
            setError(
                "Slug can contain lowercase letters, numbers, and hyphens only.",
            )
            return
        }

        try {
            setLoading(true)

            // ====================================================
            // FORMDATA
            // ====================================================

            const data = new FormData()

            data.append("name", name)
            data.append("slug", slug)

            data.append(
                "description",
                formData.description.trim(),
            )

            data.append(
                "is_active",
                String(formData.is_active),
            )

            // Only append image when a new file is selected
            if (imageFile) {
                data.append(
                    "image",
                    imageFile,
                )
            }

            // ====================================================
            // CREATE
            // ====================================================

            if (!isEditMode) {
                const result =
                    await createCategory(data)

                if (!result?.success) {
                    throw new Error(
                        result?.message ||
                            "Failed to create category",
                    )
                }

                setSuccessMessage(
                    result.message ||
                        "Category created successfully.",
                )

                setTimeout(() => {
                    navigate(
                        "/admin/categories",
                    )
                }, 1000)

                return
            }

            // ====================================================
            // UPDATE
            // ====================================================

            const result =
                await updateCategory(
                    id,
                    data,
                )

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        "Failed to update category",
                )
            }

            setSuccessMessage(
                result.message ||
                    "Category updated successfully.",
            )

            setTimeout(() => {
                navigate(
                    "/admin/categories",
                )
            }, 1000)
        } catch (err) {
            console.error(
                "Category save error:",
                err,
            )

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to save category.",
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // FETCHING SCREEN
    // ============================================================

    if (fetching) {
        return (
            <main className="min-h-screen bg-stone-100">
                <div className="flex min-h-[500px] items-center justify-center px-5">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                        <p className="mt-4 text-sm text-stone-500">
                            Loading category...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <main className="min-h-screen bg-stone-100">
            {/* ======================================================
                PAGE HEADER
            ====================================================== */}

            <section className="border-b border-stone-200 bg-white">
                <div className="px-5 py-7 sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                to="/admin/categories"
                                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-950"
                            >
                                <ArrowLeft
                                    size={17}
                                />
                                Back to Categories
                            </Link>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Store Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                                {isEditMode
                                    ? "Edit Category"
                                    : "Add Category"}
                            </h1>

                            <p className="mt-2 text-sm text-stone-500">
                                {isEditMode
                                    ? "Update the category information for your store."
                                    : "Create a new product category for your musical instrument store."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================================================
                CONTENT
            ====================================================== */}

            <section className="px-5 py-7 sm:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {successMessage && (
                        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <CheckCircle
                                    size={19}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-emerald-800">
                                    Success
                                </p>

                                <p className="mt-0.5 text-sm text-emerald-700">
                                    {
                                        successMessage
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setError(
                                        "",
                                    )
                                }
                                className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-100"
                            >
                                <X
                                    size={18}
                                />
                            </button>
                        </div>
                    )}

                    {/* ==================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                    >
                        {/* =================================================
                            FORM HEADER
                        ================================================= */}

                        <div className="border-b border-stone-200 px-5 py-5 sm:px-7">
                            <h2 className="text-lg font-bold text-stone-950">
                                Category Information
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Enter the details according
                                to your category schema.
                            </p>
                        </div>

                        {/* =================================================
                            FORM BODY
                        ================================================= */}

                        <div className="grid gap-7 px-5 py-7 sm:px-7 lg:grid-cols-2">
                            {/* =============================================
                                LEFT SIDE
                            ============================================= */}

                            <div className="space-y-6">
                                {/* NAME */}

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-stone-800"
                                    >
                                        Category Name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Guitars"
                                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                    />
                                </div>

                                {/* SLUG */}

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="slug"
                                            className="block text-sm font-semibold text-stone-800"
                                        >
                                            Slug
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={
                                                generateSlug
                                            }
                                            className="text-xs font-semibold text-amber-600 transition hover:text-amber-700"
                                        >
                                            Generate
                                            from name
                                        </button>
                                    </div>

                                    <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10">
                                        <span className="border-r border-stone-200 px-3 text-sm text-stone-400">
                                            /
                                        </span>

                                        <input
                                            id="slug"
                                            name="slug"
                                            type="text"
                                            value={
                                                formData.slug
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="guitars"
                                            className="w-full bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-stone-400">
                                        Use lowercase
                                        letters, numbers
                                        and hyphens.
                                    </p>
                                </div>

                                {/* DESCRIPTION */}

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-semibold text-stone-800"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={6}
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe this product category..."
                                        className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
                                    />

                                    <p className="mt-2 text-xs text-stone-400">
                                        Optional category
                                        description.
                                    </p>
                                </div>

                                {/* ACTIVE STATUS */}

                                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={
                                                formData.is_active
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-500 focus:ring-amber-500"
                                        />

                                        <span>
                                            <span className="block text-sm font-semibold text-stone-900">
                                                Active
                                                Category
                                            </span>

                                            <span className="mt-1 block text-xs leading-5 text-stone-500">
                                                Active categories
                                                can be used
                                                and displayed
                                                in the store.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* =============================================
                                RIGHT SIDE — IMAGE
                            ============================================= */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-stone-800">
                                    Category Image
                                </label>

                                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                                    {/* IMAGE PREVIEW */}

                                    <div className="relative flex min-h-[300px] items-center justify-center bg-stone-100">
                                        {imagePreview ? (
                                            <>
                                                <img
                                                    src={
                                                        imagePreview
                                                    }
                                                    alt="Category preview"
                                                    className="h-[300px] w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleRemoveImage
                                                    }
                                                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-stone-600 shadow-md transition hover:bg-red-50 hover:text-red-600"
                                                    title="Remove image"
                                                >
                                                    <X
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="px-6 text-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-stone-400 shadow-sm">
                                                    <FolderOpen
                                                        size={
                                                            28
                                                        }
                                                    />
                                                </div>

                                                <p className="mt-4 text-sm font-semibold text-stone-700">
                                                    No image
                                                    selected
                                                </p>

                                                <p className="mt-1 text-xs text-stone-400">
                                                    Select an
                                                    image from
                                                    your
                                                    computer
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* FILE SELECTOR */}

                                    <div className="border-t border-stone-200 bg-white p-4">
                                        <input
                                            id="category-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleImageChange
                                            }
                                            className="hidden"
                                        />

                                        <label
                                            htmlFor="category-image"
                                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                                        >
                                            <Upload
                                                size={
                                                    18
                                                }
                                            />

                                            {imageFile
                                                ? "Choose Different Image"
                                                : "Choose Image from File Explorer"}
                                        </label>

                                        <p className="mt-3 text-center text-xs text-stone-400">
                                            JPG, JPEG, PNG,
                                            WEBP • Maximum
                                            5 MB
                                        </p>

                                        {imageFile && (
                                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                                                <ImagePlus
                                                    size={
                                                        16
                                                    }
                                                    className="shrink-0 text-emerald-600"
                                                />

                                                <p className="min-w-0 truncate text-xs font-medium text-emerald-700">
                                                    {
                                                        imageFile.name
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditMode &&
                                    !imageFile &&
                                    imagePreview && (
                                        <p className="mt-2 text-xs text-stone-400">
                                            Existing image is
                                            being kept. Choose
                                            a new image only if
                                            you want to replace
                                            it.
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* =================================================
                            FORM FOOTER
                        ================================================= */}

                        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-stone-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
                            <Link
                                to="/admin/categories"
                                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                        {isEditMode
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={
                                                17
                                            }
                                        />

                                        {isEditMode
                                            ? "Update Category"
                                            : "Create Category"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default AdminCategoryForm