import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "utils/axiosintance";
import { resetNotifications } from "./notificationSlice";
import { resetProduct } from "./productSlice";
import { resetOrderState } from "./orderSlice";

// Sign in seller
export const signInSeller = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/seller-login", formData);
            const { accessToken, seller, message, refreshToken } = response.data;

            return { accessToken, seller, message, role: seller.role, refreshToken };

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Invalid Credentials");
        }
    }
);

// Refresh access token
export const refreshAccessToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { refreshToken } = getState().auth;  // Get refreshToken from Redux state
            if (!refreshToken) {
                return rejectWithValue("No refresh token available. Please log in again.");
            }

            const response = await api.post("/seller-refreshtoken", { refreshToken }, { withCredentials: true });
            return response.data.accessToken;
        } catch (error) {
            return rejectWithValue("Session expired. Please log in again.");
        }
    }
);

// Logout seller
export const logoutSeller = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue , dispatch }) => {
        try {
            await api.post("/seller-logout", {}, { withCredentials: true });
            dispatch(resetNotifications());
            dispatch(resetProduct());
            dispatch(resetOrderState());
            return {};
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);


// Check authentication status
export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthStatus",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/seller-protected");
            return response.data; // Assuming the response contains seller data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Authentication check failed");
        }
    }
);

// Initial state
const initialState = {
    loading: false,
    seller: null,
    accessToken: null,
    refreshToken: null,   // Store refreshToken in Redux
    role: localStorage.getItem("sellerRole") || null,
    error: null,
    message: null,
    isAuthenticated: false, 
};

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearAccessToken: (state) => {
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload.seller;
                state.message = action.payload.message;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.role = action.payload.role;
                state.isAuthenticated = true; // Set authenticated to true
                localStorage.setItem("sellerRole", state.role);
            })
            .addCase(signInSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false; // Set authenticated to false
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                state.loading = false;
                state.isAuthenticated = true; // Set authenticated to true
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.seller = null;
                state.role = null;
                state.isAuthenticated = false; // Set authenticated to false
            })
            .addCase(logoutSeller.fulfilled, (state) => {
                state.seller = null;
                state.loading = false;
                state.accessToken = null;
                state.refreshToken = null;
                state.message = "Logout Successfully";
                state.role = null;
                state.isAuthenticated = false; // Set authenticated to false
                localStorage.removeItem("sellerRole");
            })
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true; // Set authenticated to true
                state.seller = action.payload.seller; // Update seller data if needed
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false; // Set authenticated to false
            });
    }
});

// Export actions and reducer
export const { resetAuthState, setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
