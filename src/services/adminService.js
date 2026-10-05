import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

// ============================================================
// GET AUTH HEADERS
// ============================================================

const getAuthHeaders = async () => {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error) {
        throw new Error(error.message)
    }

    if (!session?.access_token) {
        throw new Error("Authentication required")
    }

    return {
        Authorization: `Bearer ${session.access_token}`,
    }
}

// ============================================================
// GET ADMIN PROFILE
// ============================================================

export const getAdminProfile = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        throw new Error(error.message)
    }

    if (!user) {
        throw new Error("Authentication required")
    }

    const {
        data,
        error: profileError,
    } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (profileError) {
        throw new Error(profileError.message)
    }

    if (data?.role !== "admin") {
        throw new Error("Admin access required")
    }

    return data
}

// ============================================================
// GET ADMIN DASHBOARD STATISTICS
// ============================================================

export const getDashboardStats = async () => {
    const headers = await getAuthHeaders()

    const response = await axios.get(
        `${API_URL}/admin/dashboard`,
        {
            headers,
        },
    )

    return response.data
}

// ============================================================
// CREATE PRODUCT
// ============================================================
//
// Sends FormData because product creation includes
// an image file.
//

export const createProduct = async (productData) => {
    const headers = await getAuthHeaders()

    const response = await axios.post(
        `${API_URL}/admin/products`,
        productData,
        {
            headers,
        },
    )

    return response.data
}

// ============================================================
// GET SINGLE ADMIN PRODUCT
// ============================================================

export const getAdminProductById = async (productId) => {
    const headers = await getAuthHeaders()

    const response = await axios.get(
        `${API_URL}/admin/products/${productId}`,
        {
            headers,
        },
    )

    return response.data
}

// ============================================================
// UPDATE PRODUCT
// ============================================================
//
// Sends FormData because the admin may upload a new image.
//

export const updateProduct = async (
    productId,
    productData,
) => {
    const headers = await getAuthHeaders()

    const response = await axios.put(
        `${API_URL}/admin/products/${productId}`,
        productData,
        {
            headers,
        },
    )

    return response.data
}

// ============================================================
// DELETE PRODUCT
// ============================================================

export const deleteProduct = async (productId) => {
    const headers = await getAuthHeaders()

    const response = await axios.delete(
        `${API_URL}/admin/products/${productId}`,
        {
            headers,
        },
    )

    return response.data
}