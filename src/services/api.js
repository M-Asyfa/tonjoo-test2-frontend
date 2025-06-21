import axios from 'axios';

// ✅ Adjust this base URL to match your Laravel backend
const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`, // Use environment variable for base URL
  withCredentials: true, // Enable cookies for CSRF protection
});

export default API;