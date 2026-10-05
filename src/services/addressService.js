import { supabase } from "../lib/supabase"

const API_URL = "http://localhost:5000/api"

// Get current user's access token
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
    }
}


// ============================================================
// GET ADDRESSES
// ============================================================

export const getAddresses = async () => {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_URL}/addresses`,
        {
            method: "GET",
            headers,
        },
    )

    const result = await response.json()

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch addresses",
        )
    }

    return result
}


// ============================================================
// GET SINGLE ADDRESS
// ============================================================

export const getAddressById = async (id) => {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_URL}/addresses/${id}`,
        {
            method: "GET",
            headers,
        },
    )

    const result = await response.json()

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch address",
        )
    }

    return result
}


// ============================================================
// CREATE ADDRESS
// ============================================================

export const createAddress = async (addressData) => {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_URL}/addresses`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(addressData),
        },
    )

    const result = await response.json()

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to create address",
        )
    }

    return result
}


// ============================================================
// UPDATE ADDRESS
// ============================================================

export const updateAddress = async (
    id,
    addressData,
) => {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_URL}/addresses/${id}`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(addressData),
        },
    )

    const result = await response.json()

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to update address",
        )
    }

    return result
}


// ============================================================
// DELETE ADDRESS
// ============================================================

export const deleteAddress = async (id) => {
    const headers = await getAuthHeaders()

    const response = await fetch(
        `${API_URL}/addresses/${id}`,
        {
            method: "DELETE",
            headers,
        },
    )

    const result = await response.json()

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to delete address",
        )
    }

    return result
}