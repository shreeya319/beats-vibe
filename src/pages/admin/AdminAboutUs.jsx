import { useEffect, useRef, useState } from "react"
import {
    ImagePlus,
    Save,
    Upload,
    RefreshCw,
    X,
    FileText,
    Target,
    Megaphone,
} from "lucide-react"

const API_URL = "http://localhost:5000/api"

function AdminAboutUs() {
    // ============================================================
    // ABOUT DATA
    // ============================================================

    const [about, setAbout] = useState(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingHero, setUploadingHero] = useState(false)
    const [uploadingStory, setUploadingStory] = useState(false)

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // ============================================================
    // IMAGE FILES
    // ============================================================

    const [heroFile, setHeroFile] = useState(null)
    const [heroPreview, setHeroPreview] = useState("")

    const [storyFile, setStoryFile] = useState(null)
    const [storyPreview, setStoryPreview] = useState("")

    const heroInputRef = useRef(null)
    const storyInputRef = useRef(null)

    // ============================================================
    // FETCH ABOUT US
    // ============================================================

    const loadAbout = async () => {
        try {
            setLoading(true)
            setError("")
            setSuccess("")

            const response = await fetch(
                `${API_URL}/about/admin`,
            )

            const contentType =
                response.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Server returned an invalid response. Make sure the backend is running on port 5000 and the About routes are connected.",
                )
            }

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to load About Us content.",
                )
            }

            setAbout(result.data || null)
        } catch (err) {
            console.error(
                "Admin About Us loading error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to load About Us content.",
            )
        } finally {
            setLoading(false)
        }
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadAbout()
    }, [])

    // ============================================================
    // TEXT FIELD CHANGE
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target

        setAbout((current) => ({
            ...current,
            [name]: value,
        }))
    }

    // ============================================================
    // FILE VALIDATION
    // ============================================================

    const validateImage = (file) => {
        if (!file) {
            return false
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.")
            return false
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Image size must be less than 10 MB.")
            return false
        }

        return true
    }

    // ============================================================
    // HERO IMAGE SELECT
    // ============================================================

    const handleHeroFileSelect = (event) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setError("")
        setSuccess("")

        if (!validateImage(file)) {
            event.target.value = ""
            return
        }

        if (heroPreview) {
            URL.revokeObjectURL(heroPreview)
        }

        setHeroFile(file)

        const preview = URL.createObjectURL(file)

        setHeroPreview(preview)
    }

    // ============================================================
    // STORY IMAGE SELECT
    // ============================================================

    const handleStoryFileSelect = (event) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setError("")
        setSuccess("")

        if (!validateImage(file)) {
            event.target.value = ""
            return
        }

        if (storyPreview) {
            URL.revokeObjectURL(storyPreview)
        }

        setStoryFile(file)

        const preview = URL.createObjectURL(file)

        setStoryPreview(preview)
    }

    // ============================================================
    // CLEAR HERO FILE
    // ============================================================

    const clearHeroFile = () => {
        if (heroPreview) {
            URL.revokeObjectURL(heroPreview)
        }

        setHeroFile(null)
        setHeroPreview("")

        if (heroInputRef.current) {
            heroInputRef.current.value = ""
        }
    }

    // ============================================================
    // CLEAR STORY FILE
    // ============================================================

    const clearStoryFile = () => {
        if (storyPreview) {
            URL.revokeObjectURL(storyPreview)
        }

        setStoryFile(null)
        setStoryPreview("")

        if (storyInputRef.current) {
            storyInputRef.current.value = ""
        }
    }

    // ============================================================
    // UPLOAD IMAGE
    // ============================================================

    const uploadImage = async (file) => {
        if (!file) {
            return null
        }

        const formData = new FormData()

        formData.append("image", file)

        const response = await fetch(
            `${API_URL}/about/upload`,
            {
                method: "POST",
                body: formData,
            },
        )

        const contentType =
            response.headers.get("content-type") || ""

        if (!contentType.includes("application/json")) {
            throw new Error(
                "Image upload returned an invalid server response. Check the About image upload route.",
            )
        }

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    "Failed to upload image.",
            )
        }

        return result.image_url
    }

    // ============================================================
    // UPDATE HERO IMAGE
    // ============================================================

    const handleHeroUpload = async () => {
        if (!heroFile) {
            setError("Please select a Hero image first.")
            return
        }

        if (!about?.id) {
            setError("About Us record was not found.")
            return
        }

        try {
            setUploadingHero(true)
            setError("")
            setSuccess("")

            const imageUrl = await uploadImage(heroFile)

            if (!imageUrl) {
                throw new Error(
                    "Hero image URL was not returned by the server.",
                )
            }

            const response = await fetch(
                `${API_URL}/about/${about.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hero_image_url: imageUrl,
                    }),
                },
            )

            const contentType =
                response.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Hero image update returned an invalid server response.",
                )
            }

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to update Hero image.",
                )
            }

            clearHeroFile()

            setAbout(result.data)

            setSuccess(
                "Hero image updated successfully.",
            )
        } catch (err) {
            console.error(
                "Hero image update error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to update Hero image.",
            )
        } finally {
            setUploadingHero(false)
        }
    }

    // ============================================================
    // UPDATE STORY IMAGE
    // ============================================================

    const handleStoryUpload = async () => {
        if (!storyFile) {
            setError("Please select a Story image first.")
            return
        }

        if (!about?.id) {
            setError("About Us record was not found.")
            return
        }

        try {
            setUploadingStory(true)
            setError("")
            setSuccess("")

            const imageUrl = await uploadImage(storyFile)

            if (!imageUrl) {
                throw new Error(
                    "Story image URL was not returned by the server.",
                )
            }

            const response = await fetch(
                `${API_URL}/about/${about.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        story_image_url: imageUrl,
                    }),
                },
            )

            const contentType =
                response.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Story image update returned an invalid server response.",
                )
            }

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to update Story image.",
                )
            }

            clearStoryFile()

            setAbout(result.data)

            setSuccess(
                "Story image updated successfully.",
            )
        } catch (err) {
            console.error(
                "Story image update error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to update Story image.",
            )
        } finally {
            setUploadingStory(false)
        }
    }

    // ============================================================
    // SAVE ALL TEXT CONTENT
    // ============================================================

    const handleSave = async () => {
        if (!about?.id) {
            setError("About Us record was not found.")
            return
        }

        if (!about.hero_title?.trim()) {
            setError("Hero title is required.")
            return
        }

        if (!about.story_title?.trim()) {
            setError("Story title is required.")
            return
        }

        try {
            setSaving(true)
            setError("")
            setSuccess("")

            const response = await fetch(
                `${API_URL}/about/${about.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hero_eyebrow:
                            about.hero_eyebrow?.trim() || null,

                        hero_title:
                            about.hero_title?.trim(),

                        hero_description:
                            about.hero_description?.trim() ||
                            null,

                        story_eyebrow:
                            about.story_eyebrow?.trim() ||
                            null,

                        story_title:
                            about.story_title?.trim(),

                        story_paragraph_1:
                            about.story_paragraph_1?.trim() ||
                            null,

                        story_paragraph_2:
                            about.story_paragraph_2?.trim() ||
                            null,

                        story_paragraph_3:
                            about.story_paragraph_3?.trim() ||
                            null,

                        why_eyebrow:
                            about.why_eyebrow?.trim() || null,

                        why_title:
                            about.why_title?.trim(),

                        why_description:
                            about.why_description?.trim() ||
                            null,

                        mission_title:
                            about.mission_title?.trim(),

                        mission_description:
                            about.mission_description?.trim() ||
                            null,

                        cta_title:
                            about.cta_title?.trim(),

                        cta_description:
                            about.cta_description?.trim() ||
                            null,

                        cta_button_text:
                            about.cta_button_text?.trim() ||
                            null,
                    }),
                },
            )

            const contentType =
                response.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Save returned an invalid server response. Check the backend About route.",
                )
            }

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to save About Us content.",
                )
            }

            setAbout(result.data)

            setSuccess(
                "About Us content updated successfully.",
            )
        } catch (err) {
            console.error(
                "About Us save error:",
                err,
            )

            setError(
                err.message ||
                    "Unable to save About Us content.",
            )
        } finally {
            setSaving(false)
        }
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-stone-100 p-5 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[500px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />

                            <p className="mt-4 text-sm text-stone-500">
                                Loading About Us settings...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // ============================================================
    // NO DATA
    // ============================================================

    if (!about) {
        return (
            <main className="min-h-screen bg-stone-100 p-5 sm:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                        <h2 className="text-xl font-bold text-red-800">
                            About Us data not found
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            Make sure your `about_us` table
                            contains at least one record.
                        </p>

                        <button
                            type="button"
                            onClick={loadAbout}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                        >
                            <RefreshCw size={17} />
                            Try Again
                        </button>
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
                                About Us
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                                Manage all About Us page content,
                                images, story, mission and call
                                to action from one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadAbout}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-950 hover:text-white"
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
                            onClick={() => setError("")}
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
                            onClick={() => setSuccess("")}
                            className="rounded-lg p-1 text-green-600 transition hover:bg-green-100"
                            aria-label="Close success message"
                        >
                            <X size={18} />
                        </button>

                    </div>
                )}

                {/* ==================================================
                    HERO SECTION
                ================================================== */}

                <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <ImagePlus size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                                    Hero Section
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-stone-950">
                                    Hero Content & Image
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">

                        {/* HERO IMAGE */}

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-stone-800">
                                Hero Image
                            </label>

                            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                                <img
                                    src={
                                        heroPreview ||
                                        about.hero_image_url
                                    }
                                    alt="About hero"
                                    className="h-72 w-full object-cover"
                                />
                            </div>

                            <input
                                ref={heroInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleHeroFileSelect
                                }
                                className="hidden"
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() =>
                                        heroInputRef.current?.click()
                                    }
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-stone-950"
                                >
                                    <Upload size={17} />
                                    Choose Hero Image
                                </button>

                                {heroFile && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleHeroUpload
                                        }
                                        disabled={
                                            uploadingHero
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {uploadingHero ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={17} />
                                                Update Hero Image
                                            </>
                                        )}
                                    </button>
                                )}

                            </div>

                            {heroFile && (
                                <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

                                    <p className="truncate text-xs font-medium text-amber-800">
                                        {heroFile.name}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            clearHeroFile
                                        }
                                        className="ml-3 rounded-lg p-1 text-amber-700 hover:bg-amber-100"
                                    >
                                        <X size={16} />
                                    </button>

                                </div>
                            )}
                        </div>

                        {/* HERO CONTENT */}

                        <div className="space-y-5">

                            <div>
                                <label
                                    htmlFor="hero_eyebrow"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Hero Eyebrow
                                </label>

                                <input
                                    id="hero_eyebrow"
                                    name="hero_eyebrow"
                                    value={
                                        about.hero_eyebrow ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="About Us"
                                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="hero_title"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Hero Title
                                </label>

                                <input
                                    id="hero_title"
                                    name="hero_title"
                                    value={
                                        about.hero_title ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Music begins with the right instrument."
                                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="hero_description"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Hero Description
                                </label>

                                <textarea
                                    id="hero_description"
                                    name="hero_description"
                                    rows={6}
                                    value={
                                        about.hero_description ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Write your Hero description..."
                                    className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                        </div>

                    </div>
                </section>

                {/* ==================================================
                    STORY SECTION
                ================================================== */}

                <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <FileText size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                                    Our Story
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-stone-950">
                                    Story Content & Image
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">

                        {/* STORY CONTENT */}

                        <div className="space-y-5">

                            <div>
                                <label
                                    htmlFor="story_eyebrow"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Story Eyebrow
                                </label>

                                <input
                                    id="story_eyebrow"
                                    name="story_eyebrow"
                                    value={
                                        about.story_eyebrow ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Our Story"
                                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="story_title"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Story Title
                                </label>

                                <input
                                    id="story_title"
                                    name="story_title"
                                    value={
                                        about.story_title ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Bringing instruments closer to musicians"
                                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="story_paragraph_1"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Story Paragraph 1
                                </label>

                                <textarea
                                    id="story_paragraph_1"
                                    name="story_paragraph_1"
                                    rows={4}
                                    value={
                                        about.story_paragraph_1 ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="story_paragraph_2"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Story Paragraph 2
                                </label>

                                <textarea
                                    id="story_paragraph_2"
                                    name="story_paragraph_2"
                                    rows={5}
                                    value={
                                        about.story_paragraph_2 ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="story_paragraph_3"
                                    className="mb-2 block text-sm font-semibold text-stone-800"
                                >
                                    Story Paragraph 3
                                </label>

                                <textarea
                                    id="story_paragraph_3"
                                    name="story_paragraph_3"
                                    rows={5}
                                    value={
                                        about.story_paragraph_3 ||
                                        ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                                />
                            </div>

                        </div>

                        {/* STORY IMAGE */}

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-stone-800">
                                Story Image
                            </label>

                            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                                <img
                                    src={
                                        storyPreview ||
                                        about.story_image_url
                                    }
                                    alt="Our story"
                                    className="h-72 w-full object-cover"
                                />
                            </div>

                            <input
                                ref={storyInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleStoryFileSelect
                                }
                                className="hidden"
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() =>
                                        storyInputRef.current?.click()
                                    }
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-stone-950"
                                >
                                    <Upload size={17} />
                                    Choose Story Image
                                </button>

                                {storyFile && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleStoryUpload
                                        }
                                        disabled={
                                            uploadingStory
                                        }
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {uploadingStory ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={17} />
                                                Update Story Image
                                            </>
                                        )}
                                    </button>
                                )}

                            </div>

                            {storyFile && (
                                <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

                                    <p className="truncate text-xs font-medium text-amber-800">
                                        {storyFile.name}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            clearStoryFile
                                        }
                                        className="ml-3 rounded-lg p-1 text-amber-700 hover:bg-amber-100"
                                    >
                                        <X size={16} />
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>
                </section>

                {/* ==================================================
                    WHY CHOOSE US
                ================================================== */}

                <section className="mb-8 rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                            Why Choose Us
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-stone-950">
                            Why Choose Us Content
                        </h2>
                    </div>

                    <div className="grid gap-5 p-6 sm:p-8">

                        <div>
                            <label
                                htmlFor="why_eyebrow"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Eyebrow
                            </label>

                            <input
                                id="why_eyebrow"
                                name="why_eyebrow"
                                value={
                                    about.why_eyebrow || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="why_title"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Title
                            </label>

                            <input
                                id="why_title"
                                name="why_title"
                                value={
                                    about.why_title || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="why_description"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Description
                            </label>

                            <textarea
                                id="why_description"
                                name="why_description"
                                rows={4}
                                value={
                                    about.why_description ||
                                    ""
                                }
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    MISSION
                ================================================== */}

                <section className="mb-8 rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Target size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                                    Mission
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-stone-950">
                                    Our Mission
                                </h2>
                            </div>

                        </div>
                    </div>

                    <div className="grid gap-5 p-6 sm:p-8">

                        <div>
                            <label
                                htmlFor="mission_title"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Mission Title
                            </label>

                            <input
                                id="mission_title"
                                name="mission_title"
                                value={
                                    about.mission_title ||
                                    ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="mission_description"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                Mission Description
                            </label>

                            <textarea
                                id="mission_description"
                                name="mission_description"
                                rows={5}
                                value={
                                    about.mission_description ||
                                    ""
                                }
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    CTA
                ================================================== */}

                <section className="mb-8 rounded-2xl border border-stone-200 bg-white shadow-sm">

                    <div className="border-b border-stone-200 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Megaphone size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                                    Call To Action
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-stone-950">
                                    CTA Section
                                </h2>
                            </div>

                        </div>
                    </div>

                    <div className="grid gap-5 p-6 sm:p-8">

                        <div>
                            <label
                                htmlFor="cta_title"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                CTA Title
                            </label>

                            <input
                                id="cta_title"
                                name="cta_title"
                                value={
                                    about.cta_title || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="cta_description"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                CTA Description
                            </label>

                            <textarea
                                id="cta_description"
                                name="cta_description"
                                rows={4}
                                value={
                                    about.cta_description ||
                                    ""
                                }
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="cta_button_text"
                                className="mb-2 block text-sm font-semibold text-stone-800"
                            >
                                CTA Button Text
                            </label>

                            <input
                                id="cta_button_text"
                                name="cta_button_text"
                                value={
                                    about.cta_button_text ||
                                    ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                            />
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    SAVE ALL CONTENT
                ================================================== */}

                <div className="sticky bottom-5 z-20 flex justify-end">

                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-xl backdrop-blur">

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save About Us Changes
                                </>
                            )}
                        </button>

                    </div>

                </div>

            </div>
        </main>
    )
}

export default AdminAboutUs