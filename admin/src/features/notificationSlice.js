import api from "utils/axiosintance";

import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";

export const getNotification = createAsyncThunk(
    "notification/fetch",
    async (sellerId , {rejectWithValue}) => {
        try {
            const response = await api.get(`/api/notifications/${sellerId}`)
            return response.data || [];
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const markAsRead = createAsyncThunk(
    "notification/markAsRead",
    async (notificationId , {rejectWithValue}) => {
        try {
            await api.put(`/api/notifications/mark-as-read/${notificationId}`)
            return notificationId
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteNotification = createAsyncThunk(
    "notification/delete",
    async (notificationId , {rejectWithValue}) => {
        try {
            await api.delete(`/api/notifications/${notificationId}`);
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const markAsAllRead = createAsyncThunk(
    "notification/allRead",
    async(_, {rejectWithValue}) => {
        try {
            const response = await api.put('/api/notifications/mark-as-all-read'); // Ensure API call works
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    notification : [],
    loading : false,
    error : null
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers:{
        resetNotifications: (state) => {
            state.notification = [];
            state.loading = false;
            state.error = null; // Clears notifications on logout
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(getNotification.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getNotification.fulfilled, (state , action) => {
            state.loading = false;
            state.notification = action.payload;
        })
        .addCase(getNotification.rejected, (state) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch notifications";
            state.notification = [];
        })
        .addCase(markAsRead.fulfilled, (state, action) => {
            state.notification = state.notification.filter(
                (notification) => notification._id !== action.payload
            );
        })        
        .addCase(deleteNotification.fulfilled, (state , action) => {
            state.loading = false;
            state.notification = state.notification.filter((notification) => notification._id !== action.payload);
        })
        .addCase(markAsAllRead.fulfilled, (state ) => {
            state.notification = [];
        })
    }
})

export const {resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;