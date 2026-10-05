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
// CUSTOMER — SUBMIT CONTACT MESSAGE
// ============================================================

export const createContactMessage = async ({
    name,
    email,
    phone = "",
    subject,
    message,
}) => {
    const response = await api.post(
        "/contact",
        {
            name,
            email,
            phone,
            subject,
            message,
        },
    )

    return response.data
}


// ============================================================
// ADMIN — GET ALL CONTACT MESSAGES
// ============================================================

export const getAdminContactMessages = async (
    params = {},
) => {
    const config = await getAuthConfig()

    const response = await api.get(
        "/contact/admin",
        {
            ...config,
            params,
        },
    )

    return response.data
}


// ============================================================
// ADMIN — GET MESSAGE STATISTICS
// ============================================================

export const getAdminContactMessageStats =
    async () => {
        const config = await getAuthConfig()

        const response = await api.get(
            "/contact/admin/stats",
            config,
        )

        return response.data
    }


// ============================================================
// ADMIN — GET SINGLE CONTACT MESSAGE
// ============================================================

export const getAdminContactMessageById =
    async (id) => {
        const config = await getAuthConfig()

        const response = await api.get(
            `/contact/admin/${id}`,
            config,
        )

        return response.data
    }


// ============================================================
// ADMIN — UPDATE MESSAGE STATUS
// ============================================================

export const updateContactMessageStatus =
    async (id, status) => {
        const config = await getAuthConfig()

        const response = await api.patch(
            `/contact/admin/${id}/status`,
            {
                status,
            },
            config,
        )

        return response.data
    }


// ============================================================
// ADMIN — DELETE CONTACT MESSAGE
// ============================================================

export const deleteContactMessage =
    async (id) => {
        const config = await getAuthConfig()

        const response = await api.delete(
            `/contact/admin/${id}`,
            config,
        )

        return response.data
    }


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    createContactMessage,

    getAdminContactMessages,
    getAdminContactMessageStats,
    getAdminContactMessageById,
    updateContactMessageStatus,
    deleteContactMessage,
}