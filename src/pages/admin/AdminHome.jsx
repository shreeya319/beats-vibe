import { useEffect, useState } from "react"
import {
    ImagePlus,
    Save,
    Trash2,
    Upload,
    X,
    RefreshCw,
} from "lucide-react"

const API_URL = "http://localhost:5000/api"

function AdminHome() {
    const [slides, setSlides] = useState([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingId, setUploadingId] = useState(null)

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // ============================================================
    // COMMON HERO CONTENT
    // ============================================================

    const [commonContent, setCommonContent] = useState({
        eyebrow: "",
        title: "",
        description: "",
    })

    // ============================================================
    // SELECTED IMAGE PER SLIDE
    // ============================================================

    const [selectedFiles, setSelectedFiles] = useState({})
    const [previewUrls, setPreviewUrls] = useState({})

    // ============================================================
    // LOAD HERO SLIDES
    // ============================================================

    const loadHeroSlides = async () => {
        try {
            setLoading(true)
            setError("")
            setSuccess("")

            const response = await fetch(
                `${API_URL}/home/hero-slides/all`,
            )

            const contentType =
                response.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Server returned an invalid response. Make sure the backend is running on port 5000.",
                )
            }

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to load hero slides.",
                )
            }

            const loadedSlides = result.data || []

            setSlides(loadedSlides)

            // ====================================================
            // COMMON CONTENT
            // First slide is used as the source because
            // Eyebrow, Title and Description are common.
            // ====================================================

            if (loadedSlides.length > 0) {
                const firstSlide = loadedSlides[0]

                setCommonContent({
                    eyebrow: firstSlide.eyebrow || "",
                    title: firstSlide.title || "",
                    description:
                        firstSlide.description || "",
                })
            } else {
                setCommonContent({
                    eyebrow: "",
                    title: "",
                    description: "",
                })
            }
        } catch (err) {
            console.error(
                "Admin hero slides loading error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to load hero slides.",
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadHeroSlides()
    }, [])

    // ============================================================
    // COMMON CONTENT CHANGE
    // ============================================================

    const handleCommonContentChange = (event) => {
        const { name, value } = event.target

        setCommonContent((current) => ({
            ...current,
            [name]: value,
        }))
    }

    // ============================================================
    // SELECT IMAGE FROM FILE EXPLORER
    // ============================================================

    const handleFileSelect = (event, slideId) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file.",
            )

            event.target.value = ""
            return
        }

        setError("")
        setSuccess("")

        // Revoke old preview URL for this slide
        if (previewUrls[slideId]) {
            URL.revokeObjectURL(
                previewUrls[slideId],
            )
        }

        const previewUrl =
            URL.createObjectURL(file)

        setSelectedFiles((current) => ({
            ...current,
            [slideId]: file,
        }))

        setPreviewUrls((current) => ({
            ...current,
            [slideId]: previewUrl,
        }))
    }

    // ============================================================
    // CLEAR SELECTED IMAGE
    // ============================================================

    const clearSelectedFile = (slideId) => {
        if (previewUrls[slideId]) {
            URL.revokeObjectURL(
                previewUrls[slideId],
            )
        }

        setSelectedFiles((current) => {
            const updated = { ...current }
            delete updated[slideId]
            return updated
        })

        setPreviewUrls((current) => {
            const updated = { ...current }
            delete updated[slideId]
            return updated
        })
    }

    // ============================================================
    // UPLOAD IMAGE TO SUPABASE STORAGE
    // ============================================================

    const uploadImage = async (file) => {
        if (!file) {
            throw new Error(
                "Please select an image first.",
            )
        }

        const formData = new FormData()

        formData.append("image", file)

        const response = await fetch(
            `${API_URL}/home/hero-slides/upload`,
            {
                method: "POST",
                body: formData,
            },
        )

        const contentType =
            response.headers.get("content-type") || ""

        if (!contentType.includes("application/json")) {
            throw new Error(
                "Image upload returned an invalid response. Check the backend upload route.",
            )
        }

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    "Failed to upload image.",
            )
        }

        return (
            result.image_url ||
            result.data?.image_url
        )
    }

    // ============================================================
    // UPDATE COMMON CONTENT
    // ============================================================

    const handleSaveCommonContent = async () => {
        try {
            setSaving(true)
            setError("")
            setSuccess("")

            if (!commonContent.title.trim()) {
                throw new Error(
                    "Hero title is required.",
                )
            }

            if (slides.length === 0) {
                throw new Error(
                    "No hero slides are available.",
                )
            }

            // ====================================================
            // UPDATE ALL SLIDES
            // Image URL is preserved.
            // ====================================================

            for (const slide of slides) {
                const response = await fetch(
                    `${API_URL}/home/hero-slides/${slide.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            image_url:
                                slide.image_url,

                            eyebrow:
                                commonContent.eyebrow.trim() ||
                                null,

                            title:
                                commonContent.title.trim(),

                            description:
                                commonContent.description.trim() ||
                                null,

                            display_order:
                                slide.display_order,

                            is_active:
                                slide.is_active,
                        }),
                    },
                )

                const contentType =
                    response.headers.get(
                        "content-type",
                    ) || ""

                if (
                    !contentType.includes(
                        "application/json",
                    )
                ) {
                    throw new Error(
                        "Update returned an invalid server response.",
                    )
                }

                const result =
                    await response.json()

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                            `Failed to update slide ${slide.id}.`,
                    )
                }
            }

            setSuccess(
                "Eyebrow, title and description updated for all hero slides.",
            )

            await loadHeroSlides()
        } catch (err) {
            console.error(
                "Common hero content update error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to update hero content.",
            )
        } finally {
            setSaving(false)
        }
    }

    // ============================================================
    // UPDATE INDIVIDUAL HERO IMAGE
    // ============================================================

    const updateSlideImage = async (slide) => {
        const selectedFile =
            selectedFiles[slide.id]

        if (!selectedFile) {
            setError(
                "Please select an image first.",
            )
            return
        }

        try {
            setUploadingId(slide.id)
            setError("")
            setSuccess("")

            // ====================================================
            // STEP 1
            // Upload selected image to Supabase Storage
            // ====================================================

            const imageUrl =
                await uploadImage(selectedFile)

            if (!imageUrl) {
                throw new Error(
                    "Image URL was not returned by the server.",
                )
            }

            // ====================================================
            // STEP 2
            // Update database image_url
            // Common content remains unchanged.
            // ====================================================

            const response = await fetch(
                `${API_URL}/home/hero-slides/${slide.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        image_url: imageUrl,

                        eyebrow:
                            commonContent.eyebrow.trim() ||
                            null,

                        title:
                            commonContent.title.trim(),

                        description:
                            commonContent.description.trim() ||
                            null,

                        display_order:
                            slide.display_order,

                        is_active:
                            slide.is_active,
                    }),
                },
            )

            const contentType =
                response.headers.get(
                    "content-type",
                ) || ""

            if (
                !contentType.includes(
                    "application/json",
                )
            ) {
                throw new Error(
                    "Image update returned an invalid server response.",
                )
            }

            const result =
                await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to update hero image.",
                )
            }

            clearSelectedFile(slide.id)

            setSuccess(
                `Hero image ${slides.indexOf(slide) + 1} updated successfully.`,
            )

            await loadHeroSlides()
        } catch (err) {
            console.error(
                "Hero image update error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to update hero image.",
            )
        } finally {
            setUploadingId(null)
        }
    }

    // ============================================================
    // DELETE HERO SLIDE
    // ============================================================

    const handleDeleteSlide = async (slide) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this hero image?",
            )

        if (!confirmed) {
            return
        }

        try {
            setError("")
            setSuccess("")

            const response = await fetch(
                `${API_URL}/home/hero-slides/${slide.id}`,
                {
                    method: "DELETE",
                },
            )

            const contentType =
                response.headers.get(
                    "content-type",
                ) || ""

            if (
                !contentType.includes(
                    "application/json",
                )
            ) {
                throw new Error(
                    "Delete returned an invalid server response.",
                )
            }

            const result =
                await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to delete hero slide.",
                )
            }

            clearSelectedFile(slide.id)

            setSuccess(
                "Hero slide deleted successfully.",
            )

            await loadHeroSlides()
        } catch (err) {
            console.error(
                "Delete hero slide error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to delete hero slide.",
            )
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-100 p-5 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading Home settings...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <main className="min-h-screen bg-stone-100 p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                                Website Management
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
                                Home
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                                Manage the Home page
                                hero section, including
                                common content and hero
                                images.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadHeroSlides}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>

                    </div>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div>
                            <p className="font-semibold text-red-800">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="rounded-lg p-1 text-red-500 transition hover:bg-red-100"
                            aria-label="Close error"
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (
                    <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <p className="text-sm font-semibold text-green-700">
                            {success}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccess("")
                            }
                            className="rounded-lg p-1 text-green-600 transition hover:bg-green-100"
                            aria-label="Close success message"
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}

                {/* ==================================================
                    COMMON HERO CONTENT
                ================================================== */}

                <section className="mb-8 rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                            Hero Content
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-stone-950">
                            Common Hero Content
                        </h2>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
                            Eyebrow, title and
                            description are common
                            across all hero images.
                            Edit them once and save
                            to apply the changes to
                            every slide.
                        </p>

                    </div>

                    <div className="space-y-6 p-6 sm:p-8">

                        {/* EYEBROW */}

                        <div>
                            <label
                                htmlFor="eyebrow"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Eyebrow
                            </label>

                            <input
                                id="eyebrow"
                                name="eyebrow"
                                type="text"
                                value={
                                    commonContent.eyebrow
                                }
                                onChange={
                                    handleCommonContentChange
                                }
                                placeholder="Premium Musical Instruments"
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        {/* TITLE */}

                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={
                                    commonContent.title
                                }
                                onChange={
                                    handleCommonContentChange
                                }
                                placeholder="Bring Your Music To Life"
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
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
                                rows={5}
                                value={
                                    commonContent.description
                                }
                                onChange={
                                    handleCommonContentChange
                                }
                                placeholder="Write the common hero description..."
                                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        {/* SAVE */}

                        <div className="flex justify-end border-t border-stone-100 pt-6">

                            <button
                                type="button"
                                onClick={
                                    handleSaveCommonContent
                                }
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />

                                        Save Common Content
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                </section>

                {/* ==================================================
                    HERO IMAGES
                ================================================== */}

                <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                            Hero Images
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-stone-950">
                            Manage Hero Images
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-stone-500">
                            Existing images are loaded
                            from Supabase. Select a
                            new image from File Explorer
                            to replace an individual
                            hero image.
                        </p>

                    </div>

                    <div className="p-6 sm:p-8">

                        {slides.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">

                                <ImagePlus
                                    size={35}
                                    className="mx-auto text-stone-400"
                                />

                                <h3 className="mt-4 font-semibold text-stone-800">
                                    No hero images found
                                </h3>

                                <p className="mt-2 text-sm text-stone-500">
                                    Add a hero slide to
                                    display an image
                                    here.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-6 lg:grid-cols-2">

                                {slides.map(
                                    (
                                        slide,
                                        index,
                                    ) => {
                                        const selectedFile =
                                            selectedFiles[
                                                slide.id
                                            ]

                                        const previewUrl =
                                            previewUrls[
                                                slide.id
                                            ]

                                        const isUploading =
                                            uploadingId ===
                                            slide.id

                                        return (
                                            <div
                                                key={
                                                    slide.id
                                                }
                                                className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
                                            >

                                                {/* ==================================================
                                                    IMAGE
                                                ================================================== */}

                                                <div className="relative aspect-[16/8] overflow-hidden bg-stone-200">

                                                    {slide.image_url ? (
                                                        <img
                                                            src={
                                                                slide.image_url
                                                            }
                                                            alt={
                                                                slide.title ||
                                                                `Hero slide ${
                                                                    index +
                                                                    1
                                                                }`
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <ImagePlus
                                                                size={
                                                                    35
                                                                }
                                                                className="text-stone-400"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* SLIDE NUMBER */}

                                                    <div className="absolute left-4 top-4 rounded-lg bg-stone-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                                                        Slide{" "}
                                                        {index +
                                                            1}
                                                    </div>

                                                    {/* ACTIVE */}

                                                    <div
                                                        className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                                                            slide.is_active
                                                                ? "bg-green-500/90 text-white"
                                                                : "bg-stone-950/80 text-stone-300"
                                                        }`}
                                                    >
                                                        {slide.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </div>

                                                </div>

                                                {/* ==================================================
                                                    CONTENT
                                                ================================================== */}

                                                <div className="space-y-5 p-5">

                                                    <div>
                                                        <p className="text-sm font-semibold text-stone-800">
                                                            Hero
                                                            Image{" "}
                                                            {index +
                                                                1}
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-stone-500">
                                                            Select a
                                                            new image
                                                            from your
                                                            computer
                                                            to replace
                                                            this image.
                                                        </p>
                                                    </div>

                                                    {/* ==================================================
                                                        FILE INPUT
                                                    ================================================== */}

                                                    <input
                                                        id={`hero-image-${slide.id}`}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleFileSelect(
                                                                event,
                                                                slide.id,
                                                            )
                                                        }
                                                        className="hidden"
                                                    />

                                                    <label
                                                        htmlFor={`hero-image-${slide.id}`}
                                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-stone-950"
                                                    >
                                                        <Upload
                                                            size={
                                                                17
                                                            }
                                                        />

                                                        Select Image
                                                        from File
                                                        Explorer
                                                    </label>

                                                    {/* ==================================================
                                                        NEW IMAGE PREVIEW
                                                    ================================================== */}

                                                    {selectedFile &&
                                                        previewUrl && (
                                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">

                                                                <div className="mb-3 flex items-center justify-between">

                                                                    <p className="text-xs font-semibold text-amber-800">
                                                                        New
                                                                        image
                                                                        selected
                                                                    </p>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            clearSelectedFile(
                                                                                slide.id,
                                                                            )
                                                                        }
                                                                        className="rounded-lg p-1 text-amber-700 transition hover:bg-amber-100"
                                                                    >
                                                                        <X
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </button>

                                                                </div>

                                                                <img
                                                                    src={
                                                                        previewUrl
                                                                    }
                                                                    alt="Selected preview"
                                                                    className="h-32 w-full rounded-lg object-cover"
                                                                />

                                                                <p className="mt-2 truncate text-xs text-amber-700">
                                                                    {
                                                                        selectedFile.name
                                                                    }
                                                                </p>

                                                            </div>
                                                        )}

                                                    {/* ==================================================
                                                        UPDATE IMAGE
                                                    ================================================== */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isUploading ||
                                                            !selectedFile
                                                        }
                                                        onClick={() =>
                                                            updateSlideImage(
                                                                slide,
                                                            )
                                                        }
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {isUploading ? (
                                                            <>
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                                Uploading &
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                Update
                                                                Image
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* ==================================================
                                                        DELETE
                                                    ================================================== */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteSlide(
                                                                slide,
                                                            )
                                                        }
                                                        disabled={
                                                            isUploading
                                                        }
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />

                                                        Delete Hero
                                                        Image
                                                    </button>

                                                </div>
                                            </div>
                                        )
                                    },
                                )}

                            </div>
                        )}

                    </div>

                </section>

            </div>
        </main>
    )
}

export default AdminHome