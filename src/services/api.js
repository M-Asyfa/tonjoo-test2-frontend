import axios from 'axios';

// ✅ Adjust this base URL to match your Laravel backend
const API = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  // baseURL: 'http://localhost:8000/api',
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default API;