import axios from "axios"
import { supabase } from "../lib/supabase"

// ============================================================
// API
// ============================================================

const API_URL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: API_URL,
})

// ============================================================
// AUTH TOKEN
// ============================================================

const getAccessToken = async () => {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error) {
        throw error
    }

    return session?.access_token || null
}

// ============================================================
// AUTH CONFIG
// ============================================================

const getAuthConfig = async () => {
    const token = await getAccessToken()

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

// ============================================================
// CUSTOMER — GET ACTIVE TESTIMONIALS
// ============================================================

export const getTestimonials = async () => {
    const response = await api.get(
        "/testimonials",
    )

    return response.data
}


// ============================================================
// ADMIN — GET ALL TESTIMONIALS
// ============================================================

export const getAdminTestimonials = async (
    params = {},
) => {
    const config = await getAuthConfig()

    const response = await api.get(
        "/admin/testimonials",
        {
            ...config,
            params,
        },
    )

    return response.data
}


// ============================================================
// ADMIN — GET SINGLE TESTIMONIAL
// ============================================================

export const getAdminTestimonialById = async (
    id,
) => {
    const config = await getAuthConfig()

    const response = await api.get(
        `/admin/testimonials/${id}`,
        config,
    )

    return response.data
}


// ============================================================
// ADMIN — CREATE TESTIMONIAL
// ============================================================

export const createTestimonial = async (
    testimonialData,
) => {
    const config = await getAuthConfig()

    const response = await api.post(
        "/admin/testimonials",
        testimonialData,
        config,
    )

    return response.data
}


// ============================================================
// ADMIN — UPDATE TESTIMONIAL
// ============================================================

export const updateTestimonial = async (
    id,
    testimonialData,
) => {
    const config = await getAuthConfig()

    const response = await api.put(
        `/admin/testimonials/${id}`,
        testimonialData,
        config,
    )

    return response.data
}


// ============================================================
// ADMIN — TOGGLE STATUS
// ============================================================

export const toggleTestimonialStatus =
    async (id) => {
        const config =
            await getAuthConfig()

        const response = await api.patch(
            `/admin/testimonials/${id}/status`,
            {},
            config,
        )

        return response.data
    }


// ============================================================
// ADMIN — DELETE TESTIMONIAL
// ============================================================

export const deleteTestimonial = async (
    id,
) => {
    const config = await getAuthConfig()

    const response = await api.delete(
        `/admin/testimonials/${id}`,
        config,
    )

    return response.data
}


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
    getTestimonials,
    getAdminTestimonials,
    getAdminTestimonialById,
    createTestimonial,
    updateTestimonial,
    toggleTestimonialStatus,
    deleteTestimonial,
}