import axios from "axios"
import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

// ==========================================================
// GET PRODUCTS
// ==========================================================

export const getProducts = async ({
    search = "",
    category = "",
    sort = "newest",
    page = 1,
    limit = 12,
    featured = false,
} = {}) => {
    const response = await axios.get(
        `${API_URL}/products`,
        {
            params: {
                search,
                category,
                sort,
                page,
                limit,
                featured,
            },
        },
    )

    return response.data
}

// ==========================================================
// GET PRODUCT BY SLUG
// ==========================================================

export const getProductBySlug = async (slug) => {
    const response = await axios.get(
        `${API_URL}/products/details/${slug}`,
    )

    return response.data
}

// ==========================================================
// ADD TO CART
// ==========================================================

export const addToCart = async (
    productId,
    quantity = 1,
) => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
        throw new Error(
            "Please login to add products to your cart",
        )
    }

    const response = await axios.post(
        `${API_URL}/cart`,
        {
            product_id: productId,
            quantity,
        },
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        },
    )

    return response.data
}