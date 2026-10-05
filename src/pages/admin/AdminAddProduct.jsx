
import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
  LoaderCircle,
  RefreshCw,
} from "lucide-react"
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom"

import { getCategories } from "../../services/categoryService"
import {
  createProduct,
  getAdminProductById,
  updateProduct,
} from "../../services/adminService"

function AdminAddProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)

  // ============================================================
  // MODE
  // ============================================================

  const isEditMode = Boolean(id)

  // ============================================================
  // STATE
  // ============================================================

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] =
    useState(true)

  const [loadingProduct, setLoadingProduct] =
    useState(isEditMode)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // ------------------------------------------------------------
  // IMAGE STATE
  // ------------------------------------------------------------

  const [image, setImage] = useState(null)

  const [imagePreview, setImagePreview] =
    useState("")

  const [existingImage, setExistingImage] =
    useState("")

  const [changingImage, setChangingImage] =
    useState(false)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    brand: "",
    description: "",
    category_id: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    is_featured: false,
    is_active: true,
  })

  const [specifications, setSpecifications] =
    useState([
      {
        name: "",
        value: "",
      },
    ])

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)

        const result = await getCategories()

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to load categories.",
          )
        }

        setCategories(result.data || [])
      } catch (err) {
        console.error(
          "Failed to load categories:",
          err,
        )

        setError(
          err.message ||
            "Failed to load categories.",
        )
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // ============================================================
  // GET PRODUCT IMAGE
  // ============================================================

  const getProductImage = (product) => {
    if (!product) {
      return ""
    }

    // Direct image_url
    if (product.image_url) {
      return product.image_url
    }

    // product_images array
    if (
      Array.isArray(product.product_images) &&
      product.product_images.length > 0
    ) {
      const primaryImage =
        product.product_images.find(
          (item) => item.is_primary,
        )

      if (primaryImage?.image_url) {
        return primaryImage.image_url
      }

      const sortedImages = [
        ...product.product_images,
      ].sort(
        (a, b) =>
          (a.display_order || 0) -
          (b.display_order || 0),
      )

      return sortedImages[0]?.image_url || ""
    }

    // Alternative images array
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const primaryImage =
        product.images.find(
          (item) => item.is_primary,
        )

      if (primaryImage?.image_url) {
        return primaryImage.image_url
      }

      return product.images[0]?.image_url || ""
    }

    return ""
  }

  // ============================================================
  // NORMALIZE SPECIFICATIONS
  // ============================================================

  const normalizeSpecifications = (
    product,
  ) => {
    let specs =
      product?.specifications

    // JSON string
    if (typeof specs === "string") {
      try {
        specs = JSON.parse(specs)
      } catch {
        specs = []
      }
    }

    // Array
    if (Array.isArray(specs)) {
      const normalized = specs
        .map((item) => ({
          name:
            item?.name ??
            item?.specification_name ??
            "",
          value:
            item?.value ??
            item?.specification_value ??
            "",
        }))
        .filter(
          (item) =>
            String(item.name).trim() ||
            String(item.value).trim(),
        )

      if (normalized.length > 0) {
        return normalized
      }
    }

    // Object
    if (
      specs &&
      typeof specs === "object" &&
      !Array.isArray(specs)
    ) {
      return Object.entries(specs)
        .map(([name, value]) => ({
          name: String(name),
          value:
            value === null ||
            value === undefined
              ? ""
              : String(value),
        }))
        .filter(
          (item) =>
            item.name.trim() ||
            item.value.trim(),
        )
    }

    // Alternative API field
    if (
      Array.isArray(
        product?.product_specifications,
      )
    ) {
      return product.product_specifications
        .map((item) => ({
          name:
            item?.name ??
            item?.specification_name ??
            "",
          value:
            item?.value ??
            item?.specification_value ??
            "",
        }))
        .filter(
          (item) =>
            item.name.trim() ||
            item.value.trim(),
        )
    }

    return []
  }

  // ============================================================
  // LOAD EXISTING PRODUCT
  // ============================================================

  useEffect(() => {
    if (!isEditMode) {
      setLoadingProduct(false)
      return
    }

    const loadProduct = async () => {
      try {
        setLoadingProduct(true)
        setError("")

        const result =
          await getAdminProductById(id)

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to load product.",
          )
        }

        const product =
          result.data?.product ||
          result.data

        if (!product) {
          throw new Error(
            "Product information was not found.",
          )
        }

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          sku: product.sku || "",
          brand: product.brand || "",
          description:
            product.description || "",
          category_id:
            product.category_id ??
            product.categories?.id ??
            "",
          price:
            product.price !== null &&
            product.price !== undefined
              ? String(product.price)
              : "",
          discount_price:
            product.discount_price !==
              null &&
            product.discount_price !==
              undefined
              ? String(
                  product.discount_price,
                )
              : "",
          stock_quantity:
            product.stock_quantity !==
              null &&
            product.stock_quantity !==
              undefined
              ? String(
                  product.stock_quantity,
                )
              : "",
          is_featured:
            Boolean(product.is_featured),
          is_active:
            product.is_active === undefined
              ? true
              : Boolean(product.is_active),
        })

        // --------------------------------------------------------
        // EXISTING IMAGE
        // --------------------------------------------------------

        const productImage =
          getProductImage(product)

        if (productImage) {
          setExistingImage(productImage)
          setImagePreview(productImage)
        }

        // --------------------------------------------------------
        // EXISTING SPECIFICATIONS
        // --------------------------------------------------------

        const existingSpecifications =
          normalizeSpecifications(product)

        if (
          existingSpecifications.length > 0
        ) {
          setSpecifications(
            existingSpecifications,
          )
        } else {
          setSpecifications([
            {
              name: "",
              value: "",
            },
          ])
        }
      } catch (err) {
        console.error(
          "Load product error:",
          err,
        )

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product.",
        )
      } finally {
        setLoadingProduct(false)
      }
    }

    loadProduct()
  }, [id, isEditMode])

  // ============================================================
  // CLEAN OBJECT URL
  // ============================================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }))

    setError("")
    setSuccess("")
  }

  // ============================================================
  // OPEN FILE EXPLORER
  // ============================================================

  const openFileExplorer = () => {
    if (saving) {
      return
    }

    setChangingImage(true)

    // Reset the input first.
    // This allows selecting the same file again.
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  // ============================================================
  // HANDLE IMAGE
  // ============================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    setChangingImage(false)

    if (!file) {
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed.",
      )

      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be 5 MB or less.",
      )

      event.target.value = ""
      return
    }

    // Revoke previous preview URL if it was a blob
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview)
    }

    // Store the actual File object.
    // This is what will be uploaded to Supabase
    // through the backend.
    setImage(file)

    // Create temporary browser preview.
    setImagePreview(
      URL.createObjectURL(file),
    )

    setError("")
    setSuccess("")
  }

  // ============================================================
  // REMOVE / RESET IMAGE
  // ============================================================

  const removeImage = () => {
    if (saving) {
      return
    }

    // Revoke temporary blob preview
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview)
    }

    setImage(null)

    // In edit mode, restore existing image.
    if (isEditMode && existingImage) {
      setImagePreview(existingImage)
    } else {
      setImagePreview("")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setError("")
    setSuccess("")
  }

  // ============================================================
  // GENERATE SLUG
  // ============================================================

  const generateSlug = () => {
    const slug = form.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    setForm((current) => ({
      ...current,
      slug,
    }))
  }

  // ============================================================
  // ADD SPECIFICATION
  // ============================================================

  const addSpecification = () => {
    setSpecifications((current) => [
      ...current,
      {
        name: "",
        value: "",
      },
    ])
  }

  // ============================================================
  // UPDATE SPECIFICATION
  // ============================================================

  const updateSpecification = (
    index,
    field,
    value,
  ) => {
    setSpecifications((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )

    setError("")
    setSuccess("")
  }

  // ============================================================
  // REMOVE SPECIFICATION
  // ============================================================

  const removeSpecification = (index) => {
    setSpecifications((current) => {
      const updated = current.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      )

      if (updated.length === 0) {
        return [
          {
            name: "",
            value: "",
          },
        ]
      }

      return updated
    })

    setError("")
    setSuccess("")
  }

  // ============================================================
  // VALIDATE FORM
  // ============================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required."
    }

    if (!form.slug.trim()) {
      return "Product slug is required."
    }

    if (!form.sku.trim()) {
      return "Product SKU is required."
    }

    if (!form.category_id) {
      return "Please select a category."
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price))
    ) {
      return "Please enter a valid price."
    }

    if (Number(form.price) < 0) {
      return "Price cannot be negative."
    }

    if (
      form.discount_price !== "" &&
      Number.isNaN(
        Number(form.discount_price),
      )
    ) {
      return "Please enter a valid discount price."
    }

    if (
      form.discount_price !== "" &&
      Number(form.discount_price) < 0
    ) {
      return "Discount price cannot be negative."
    }

    if (
      form.discount_price !== "" &&
      Number(form.discount_price) >
        Number(form.price)
    ) {
      return "Discount price cannot be greater than the original price."
    }

    if (
      form.stock_quantity === "" ||
      Number.isNaN(
        Number(form.stock_quantity),
      )
    ) {
      return "Please enter stock quantity."
    }

    if (Number(form.stock_quantity) < 0) {
      return "Stock quantity cannot be negative."
    }

    // Image is required for new products.
    if (!isEditMode && !image) {
      return "Please select a product image."
    }

    // Edit mode is allowed to keep the existing image.
    if (
      isEditMode &&
      !image &&
      !existingImage
    ) {
      return "Please select a product image."
    }

    return ""
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    const validationError =
      validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      // --------------------------------------------------------
      // BASIC INFORMATION
      // --------------------------------------------------------

      formData.append(
        "name",
        form.name.trim(),
      )

      formData.append(
        "slug",
        form.slug.trim(),
      )

      formData.append(
        "sku",
        form.sku.trim(),
      )

      formData.append(
        "brand",
        form.brand.trim(),
      )

      formData.append(
        "description",
        form.description.trim(),
      )

      formData.append(
        "category_id",
        form.category_id,
      )

      // --------------------------------------------------------
      // PRICE
      // --------------------------------------------------------

      formData.append(
        "price",
        form.price,
      )

      if (
        form.discount_price !== ""
      ) {
        formData.append(
          "discount_price",
          form.discount_price,
        )
      } else {
        // Explicitly clear discount price when
        // editing an existing product.
        formData.append(
          "discount_price",
          "",
        )
      }

      // --------------------------------------------------------
      // STOCK
      // --------------------------------------------------------

      formData.append(
        "stock_quantity",
        form.stock_quantity,
      )

      // --------------------------------------------------------
      // STATUS
      // --------------------------------------------------------

      formData.append(
        "is_featured",
        String(form.is_featured),
      )

      formData.append(
        "is_active",
        String(form.is_active),
      )

      // --------------------------------------------------------
      // SPECIFICATIONS
      // --------------------------------------------------------

      const validSpecifications =
        specifications
          .map((item) => ({
            name: item.name.trim(),
            value: item.value.trim(),
          }))
          .filter(
            (item) =>
              item.name &&
              item.value,
          )

      formData.append(
        "specifications",
        JSON.stringify(
          validSpecifications,
        ),
      )

      // --------------------------------------------------------
      // IMAGE
      //
      // IMPORTANT:
      //
      // Only append "image" when a NEW File was selected.
      //
      // The backend should then:
      // 1. Upload this file to the
      //    "product-images" Supabase Storage bucket.
      //
      // 2. Get the public URL.
      //
      // 3. Update product_images.image_url.
      //
      // 4. Keep the product_images record as
      //    the primary image.
      //
      // If no new file is selected, the existing
      // Supabase image remains unchanged.
      // --------------------------------------------------------

      if (image instanceof File) {
        formData.append(
          "image",
          image,
        )
      }

      // --------------------------------------------------------
      // CREATE
      // --------------------------------------------------------

      if (!isEditMode) {
        const result =
          await createProduct(
            formData,
          )

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to create product.",
          )
        }

        setSuccess(
          "Product created successfully.",
        )

        setTimeout(() => {
          navigate("/admin/products")
        }, 800)

        return
      }

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------

      const result =
        await updateProduct(
          id,
          formData,
        )

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to update product.",
        )
      }

      setSuccess(
        image
          ? "Product updated and image replaced successfully."
          : "Product updated successfully.",
      )

      setTimeout(() => {
        navigate("/admin/products")
      }, 1000)
    } catch (err) {
      console.error(
        isEditMode
          ? "Update product error:"
          : "Create product error:",
        err,
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          (isEditMode
            ? "Failed to update product."
            : "Failed to create product."),
      )
    } finally {
      setSaving(false)
    }
  }

  // ============================================================
  // LOADING PRODUCT
  // ============================================================

  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-stone-100">
        <section className="border-b border-stone-200 bg-white">
          <div className="px-5 py-7 sm:px-8">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-950"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>
          </div>
        </section>

        <section className="flex min-h-[500px] items-center justify-center px-5">
          <div className="text-center">
            <LoaderCircle
              size={38}
              className="mx-auto animate-spin text-amber-500"
            />

            <p className="mt-4 text-sm font-medium text-stone-500">
              Loading product details...
            </p>
          </div>
        </section>
      </main>
    )
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-stone-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <Link
                to="/admin/products"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-950"
              >
                <ArrowLeft size={17} />
                Back to Products
              </Link>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-600">
                Store Management
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
                {isEditMode
                  ? "Edit Product"
                  : "Add Product"}
              </h1>

              <p className="mt-2 text-stone-500">
                {isEditMode
                  ? "Update product information, image and specifications."
                  : "Add a new musical instrument to your store."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          FORM
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              ALERTS
          ================================================== */}

          {error && (
            <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="shrink-0 rounded-lg p-1 transition hover:bg-red-100"
              >
                <X size={17} />
              </button>

            </div>
          )}

          {success && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

              <p>{success}</p>

              <button
                type="button"
                onClick={() =>
                  setSuccess("")
                }
                className="rounded-lg p-1 transition hover:bg-green-100"
              >
                <X size={17} />
              </button>

            </div>
          )}

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-950">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Enter the main details of the product.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Product Name */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Yamaha F310 Acoustic Guitar"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

              {/* Slug */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Slug *
                </label>

                <div className="flex gap-2">

                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="yamaha-f310-acoustic-guitar"
                    className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />

                  <button
                    type="button"
                    onClick={generateSlug}
                    className="rounded-xl border border-stone-300 px-4 text-xs font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-600"
                  >
                    Generate
                  </button>

                </div>

              </div>

              {/* SKU */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  SKU *
                </label>

                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="GTR-YAM-F310"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

              {/* Brand */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Brand
                </label>

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Yamaha"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

              {/* Category */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Category *
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:bg-stone-100"
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ),
                  )}

                </select>

              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the instrument, its features and important details..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

            </div>

          </div>

          {/* ==================================================
              PRICE & INVENTORY
          ================================================== */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-950">
                Price & Inventory
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Set pricing and available stock.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* Price */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Price (₹) *
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="25000"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

              {/* Discount */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Discount Price (₹)
                </label>

                <input
                  name="discount_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discount_price}
                  onChange={handleChange}
                  placeholder="22000"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

              {/* Stock */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Stock Quantity *
                </label>

                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

              </div>

            </div>

            {/* Toggles */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">

                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-amber-500"
                />

                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Featured Product
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Show this product in featured sections.
                  </p>
                </div>

              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 accent-amber-500"
                />

                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Active Product
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Make this product visible in the store.
                  </p>
                </div>

              </label>

            </div>

          </div>

          {/* ==================================================
              PRODUCT IMAGE
          ================================================== */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-stone-950">
                  Product Image
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {isEditMode
                    ? "View the current image or choose a new image to replace it."
                    : "Upload the primary product image."}
                </p>
              </div>

              {/* CHANGE IMAGE BUTTON */}

              {isEditMode &&
                imagePreview && (
                  <button
                    type="button"
                    onClick={
                      openFileExplorer
                    }
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {changingImage ? (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <RefreshCw
                        size={17}
                      />
                    )}

                    Change Image
                  </button>
                )}

            </div>

            {!imagePreview ? (

              <button
                type="button"
                onClick={
                  openFileExplorer
                }
                disabled={saving}
                className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center transition hover:border-amber-400 hover:bg-amber-50/30 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-stone-500 shadow-sm">
                  <ImagePlus size={28} />
                </div>

                <p className="mt-4 text-sm font-semibold text-stone-800">
                  Click to upload product image
                </p>

                <p className="mt-2 text-xs text-stone-500">
                  JPG, JPEG, PNG or WEBP • Maximum 5 MB
                </p>

              </button>

            ) : (

              <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">

                <img
                  src={imagePreview}
                  alt={
                    image
                      ? "New product image preview"
                      : "Current product image"
                  }
                  className="mx-auto h-80 w-full object-contain p-6"
                />

                {/* IMAGE ACTIONS */}

                <div className="absolute right-4 top-4 flex items-center gap-2">

                  {/* CHANGE */}

                  <button
                    type="button"
                    onClick={
                      openFileExplorer
                    }
                    disabled={saving}
                    className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-800 shadow-lg ring-1 ring-stone-200 transition hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Choose another image"
                  >
                    <RefreshCw
                      size={16}
                    />
                    Change
                  </button>

                  {/* RESET */}

                  {image && (
                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      disabled={saving}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Cancel new image"
                      title="Keep current image"
                    >
                      <X size={18} />
                    </button>
                  )}

                </div>

                <div className="border-t border-stone-200 bg-white px-4 py-3">

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                    <p className="truncate text-sm font-medium text-stone-700">

                      {image
                        ? image.name
                        : "Existing product image"}

                    </p>

                    <p className="text-xs text-stone-400">

                      {image
                        ? `${(
                            image.size /
                            1024 /
                            1024
                          ).toFixed(
                            2,
                          )} MB`
                        : "Current image"}

                    </p>

                  </div>

                  {image && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      New image selected. Click
                      "Update Product" to upload
                      it to Supabase.
                    </p>
                  )}

                </div>

              </div>

            )}

            {/* HIDDEN FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              className="hidden"
            />

            {/* EDIT MODE INFORMATION */}

            {isEditMode &&
              existingImage &&
              !image && (
                <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">

                  <p className="text-xs leading-5 text-stone-500">
                    The current image will remain
                    unchanged unless you select a
                    new image using{" "}
                    <span className="font-semibold text-stone-700">
                      Change Image
                    </span>
                    .
                  </p>

                </div>
              )}

          </div>

          {/* ==================================================
              SPECIFICATIONS
          ================================================== */}

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-stone-950">
                  Specifications
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {isEditMode
                    ? "Edit existing specifications, add new ones or remove specifications."
                    : "Add technical details about the instrument."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  addSpecification
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
              >
                <Plus size={17} />
                Add Specification
              </button>

            </div>

            <div className="space-y-3">

              {specifications.map(
                (
                  specification,
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:flex-row"
                  >

                    <input
                      value={
                        specification.name
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSpecification(
                          index,
                          "name",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Specification name"
                      className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />

                    <input
                      value={
                        specification.value
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSpecification(
                          index,
                          "value",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Specification value"
                      className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSpecification(
                          index,
                        )
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove specification"
                      title="Remove specification"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                ),
              )}

            </div>

            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

              <p className="text-xs leading-5 text-amber-800">
                <span className="font-semibold">
                  Tip:
                </span>{" "}
                Existing specifications are loaded
                automatically in edit mode. You can
                change, add or remove them.
              </p>

            </div>

          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />

                  {isEditMode
                    ? "Updating Product..."
                    : "Creating Product..."}
                </>
              ) : (
                <>
                  <Save size={18} />

                  {isEditMode
                    ? "Update Product"
                    : "Create Product"}
                </>
              )}

            </button>

          </div>

        </form>

      </section>

    </main>
  )
}

export default AdminAddProduct

