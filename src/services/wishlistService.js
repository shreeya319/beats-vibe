import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

const getAccessToken = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
        throw new Error(
            "Please login to access your wishlist",
        )
    }

    return session.access_token
}

export const getWishlist = async () => {
    const token = await getAccessToken()

    const response = await axios.get(
        `${API_URL}/wishlist`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}

export const addToWishlist = async (
    productId,
) => {
    const token = await getAccessToken()

    const response = await axios.post(
        `${API_URL}/wishlist`,
        {
            product_id: productId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}

export const removeFromWishlist = async (
    productId,
) => {
    const token = await getAccessToken()

    const response = await axios.delete(
        `${API_URL}/wishlist/${productId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )

    return response.data
}