import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.message || (err?.message === "Network Error" ? "Cannot reach the server." : fallback);

export const FACILITIES = ["WiFi", "Food", "AC", "Laundry", "Parking", "CCTV", "Power Backup", "Housekeeping"];

export const getHostels = async () => (await api.get("/hostels")).data.hostels;
export const getHostel = async (id) => (await api.get(`/hostels/${id}`)).data.hostel;
export const createHostel = async (data) => (await api.post("/hostels", data)).data;
export const updateHostel = async (id, data) => (await api.put(`/hostels/${id}`, data)).data;
export const deleteHostel = async (id) => (await api.delete(`/hostels/${id}`)).data;
export const registerUser = async (data) => (await api.post("/auth/register", data)).data;

export default api;
