import axios from "axios";

const FALLBACK_API_URL = "http://localhost:5000/api/users";
const API_URL = import.meta.env.VITE_API_URL?.trim() || FALLBACK_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
