import axios from "axios"

const API = "http://localhost:5000/api/contact-information"

// ============================================================
// GET CONTACT INFORMATION
// ============================================================

export const getContactInformation = async () => {
    const response = await axios.get(API)

    return response.data
}