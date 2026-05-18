import api from "./api";

const getAllOrders = async () => {
    const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders`)
    return res.data
}

export const ModeratorService = {
    getAllOrders
}