import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL =
    "http://localhost:5000/api"

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
        throw new Error(
            "Authentication required",
        )
    }

    return {
        Authorization: `Bearer ${session.access_token}`,
    }
}

// ============================================================
// GET ACTIVE CATEGORIES
// ============================================================

export const getCategories =
    async () => {
        const response =
            await axios.get(
                `${API_URL}/categories`,
            )

        return response.data
    }

// ============================================================
// GET ADMIN CATEGORIES
// ============================================================

export const getAdminCategories =
    async (params = {}) => {
        const headers =
            await getAuthHeaders()

        const response =
            await axios.get(
                `${API_URL}/admin/categories`,
                {
                    params,
                    headers,
                },
            )

        return response.data
    }

// ============================================================
// GET SINGLE ADMIN CATEGORY
// ============================================================

export const getAdminCategoryById =
    async (categoryId) => {
        const headers =
            await getAuthHeaders()

        const response =
            await axios.get(
                `${API_URL}/admin/categories/${categoryId}`,
                {
                    headers,
                },
            )

        return response.data
    }

// ============================================================
// CREATE CATEGORY
// ============================================================

export const createCategory =
    async (categoryData) => {
        const headers =
            await getAuthHeaders()

        const response =
            await axios.post(
                `${API_URL}/admin/categories`,
                categoryData,
                {
                    headers,
                },
            )

        return response.data
    }

// ============================================================
// UPDATE CATEGORY
// ============================================================

export const updateCategory =
    async (
        categoryId,
        categoryData,
    ) => {
        const headers =
            await getAuthHeaders()

        const response =
            await axios.put(
                `${API_URL}/admin/categories/${categoryId}`,
                categoryData,
                {
                    headers,
                },
            )

        return response.data
    }

// ============================================================
// DELETE CATEGORY
// ============================================================

export const deleteCategory =
    async (categoryId) => {
        const headers =
            await getAuthHeaders()

        const response =
            await axios.delete(
                `${API_URL}/admin/categories/${categoryId}`,
                {
                    headers,
                },
            )

        return response.data
    }