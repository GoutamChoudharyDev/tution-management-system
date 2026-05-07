import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an unauthorized access and we haven't already tried refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await api.get("/api/auth/refresh-token");
                // If successful, retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                // If token refresh fails, redirect to login
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;