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
// ADMIN CUSTOMERS
// ============================================================

// GET ALL CUSTOMERS
export const getAdminCustomers = async ({
    search = "",
} = {}) => {
    const response = await api.get(
        "/admin/customers",
        {
            params: {
                search,
            },
        },
    )

    return response.data
}

// GET SINGLE CUSTOMER
export const getAdminCustomerById = async (
    customerId,
) => {
    const response = await api.get(
        `/admin/customers/${customerId}`,
    )

    return response.data
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    getAdminCustomers,
    getAdminCustomerById,
}