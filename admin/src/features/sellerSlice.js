import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "utils/axiosintance";

// Fetch all seller requests
export const fetchSellers = createAsyncThunk("seller/fetchSellers", async () => {
    const response = await api.get("/api/admin/seller-request");
    return response.data; 
});

// Approve or Reject seller request
export const updateSellerStatus = createAsyncThunk(
    "sellers/updateSellerStatus",
    async ({ sellerId, action }) => {
        await api.put(`/api/admin/approve-request`, { sellerId, action });
        return { sellerId, status: action === "approve" ? "approved" : "rejected" };
    }
);


const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        sellers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.sellers = action.payload;
                state.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(updateSellerStatus.fulfilled, (state, action) => {
                state.sellers = state.sellers.map((seller) =>
                    seller._id === action.payload.sellerId
                        ? { ...seller, status: action.payload.status }
                        : seller
                );
            });
    },
});

export default sellerSlice.reducer;
