import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: API_URL,
})

// ============================================================
// ADD SUPABASE ACCESS TOKEN TO EVERY REQUEST
// ============================================================

api.interceptors.request.use(
    async (config) => {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (session?.access_token) {
            config.headers.Authorization =
                `Bearer ${session.access_token}`
        }

        return config
    },
    (error) => Promise.reject(error),
)

// ============================================================
// CUSTOMER ORDERS
// ============================================================

export const createOrder = async ({
    address_id,
    payment_method = "Cash on Delivery",
}) => {
    const response = await api.post("/orders", {
        address_id,
        payment_method,
    })

    return response.data
}

export const getOrders = async () => {
    const response = await api.get("/orders")

    return response.data
}

export const getOrderById = async (orderId) => {
    const response = await api.get(
        `/orders/${orderId}`,
    )

    return response.data
}

// ============================================================
// ADMIN ORDERS
// ============================================================

export const getAdminOrders = async ({
    search = "",
    status = "",
} = {}) => {
    const response = await api.get(
        "/admin/orders",
        {
            params: {
                search,
                status,
            },
        },
    )

    return response.data
}

export const getAdminOrderStats = async () => {
    const response = await api.get(
        "/admin/orders/stats",
    )

    return response.data
}

export const getAdminOrderById = async (
    orderId,
) => {
    const response = await api.get(
        `/admin/orders/${orderId}`,
    )

    return response.data
}

export const updateAdminOrderStatus = async (
    orderId,
    status,
) => {
    const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
            status,
        },
    )

    return response.data
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    createOrder,
    getOrders,
    getOrderById,
    getAdminOrders,
    getAdminOrderStats,
    getAdminOrderById,
    updateAdminOrderStatus,
}