import axios from "axios";
import { setAccessToken, logoutSeller } from "../features/authSlice";

const api = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true,
});

// Lazy load Redux store to prevent circular dependency
const getStore = () => require("../store").store;

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

// Request Interceptor: Attach access token
api.interceptors.request.use(
    (config) => {
        const { accessToken } = getStore().getState().auth;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 403 errors (expired tokens)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is a 403 (Token Expired) and we haven’t retried yet
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried

            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newAccessToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        resolve(api(originalRequest)); // Retry the request
                    });
                });
            }

            isRefreshing = true;

            try {
                const oldRefreshToken = getStore().getState().auth.refreshToken;

                // Call refresh API only once
                const response = await axios.post("http://localhost:5000/seller-refreshtoken", {
                    refreshToken: oldRefreshToken,
                });

                const newAccessToken = response.data.accessToken;

                // Update store with new token
                getStore().dispatch(setAccessToken(newAccessToken));

                // Apply the new token to all queued requests
                onRefreshed(newAccessToken);

                // Retry the original request with new token
                return api(originalRequest);
            } catch (refreshError) {
                getStore().dispatch(logoutSeller());
                
                alert("Your session expired login again")
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
