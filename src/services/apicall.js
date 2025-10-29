import axios from 'axios';

// 1. DEFINE THE DEPLOYMENT VARIABLE FIRST (This handles local vs. live URL)
// This checks the environment. It uses the Netlify-injected variable, or falls back to localhost.
//const DEPLOYED_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 2. CREATE THE AXIOS INSTANCE
const API = axios.create({
    // Use the dynamic variable for the base URL
    baseURL: 'http://localhost:5000', 
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
            window.location.href = '/login';
        }
        // For all other errors, pass them on
        return Promise.reject(error);
    }
);

export default API;