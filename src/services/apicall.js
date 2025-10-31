import axios from 'axios';

// 1. DEFINE THE DEPLOYMENT VARIABLE
// This uses the Netlify-injected environment variable (VITE_API_URL) for production,
// and falls back to http://localhost:5000 for local development.
const DEPLOYED_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. CREATE THE AXIOS INSTANCE
const API = axios.create({
    // This is now dynamic and will correctly point to:
    // - http://localhost:5000 when running locally
    // - https://fit-server-3.onrender.com when deployed on Netlify (if VITE_API_URL is set)
    baseURL: DEPLOYED_API_URL, 
    withCredentials: true,
});

// --- Request Interceptor ---
// This runs before every request is sent. It checks for a token
// and automatically adds it to the Authorization header.
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
// This runs for every response. It checks for a 401 Unauthorized error
// and redirects the user to the login page.
API.interceptors.response.use(
    (response) => {
        // If the request was successful, just return the response
        return response;
    },
    (error) => {
        // If the server responds with a 401 Unauthorized error,
        // it means the token is expired or invalid.
        if (error.response && error.response.status === 401) {
            console.log('Token expired or unauthorized. Redirecting to login.');
            // Clear the invalid token and user data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect the user to the login page
            // Note: This assumes you are using React Router or similar.
            window.location.href = '/login'; 
        }
        // For all other errors, pass them on
        return Promise.reject(error);
    }
);

export default API;