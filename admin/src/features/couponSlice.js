import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "utils/axiosintance";

// Fetch all coupons
export const fetchCoupons = createAsyncThunk("coupon/fetchCoupons", async (_, {rejectWithValue}) => {
    try {
        const response = await api.get("/get-coupons");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error feching coupon")
    }
});

// Create a new coupon
export const createCoupon = createAsyncThunk("coupon/createCoupon", async (couponData, { rejectWithValue }) => {
    try {
        const response = await api.post("/create-coupon", couponData);
        return response.data.coupon;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error creating coupon");
    }
});

// Delete a coupon
export const deleteCoupon = createAsyncThunk("coupon/deleteCoupon", async (couponId, { rejectWithValue }) => {
    try {
        await api.delete(`/delete-coupon/${couponId}`);
        return couponId;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error deleting coupon");
    }
});

const couponSlice = createSlice({
    name: "coupon",
    initialState: { coupons: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending,(state) => {
                state.loading = true;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(createCoupon.pending, (state ) => {
                state.loading = true;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons.push(action.payload);
            })
            .addCase(createCoupon.rejected, (state) => {
                state.loading = false;
            })
            .addCase(deleteCoupon.pending, (state ) => {
                state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;  
                state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload);
            });
    }
});

export default couponSlice.reducer;
