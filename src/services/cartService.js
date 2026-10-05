import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

const getAccessToken = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
        throw new Error("Please login to access your cart")
    }

    return session.access_token
}

export const getCart = async () => {
    const token = await getAccessToken()

    const response = await axios.get(
        `${API_URL}/cart`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}

export const updateCartItem = async (
    cartItemId,
    quantity,
) => {
    const token = await getAccessToken()

    const response = await axios.patch(
        `${API_URL}/cart/${cartItemId}`,
        {
            quantity,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}

export const removeCartItem = async (
    cartItemId,
) => {
    const token = await getAccessToken()

    const response = await axios.delete(
        `${API_URL}/cart/${cartItemId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}

export const clearCart = async () => {
    const token = await getAccessToken()

    const response = await axios.delete(
        `${API_URL}/cart`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}