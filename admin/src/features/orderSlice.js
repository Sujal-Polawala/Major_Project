import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'utils/axiosintance';

export const fetchOrderBySeller = createAsyncThunk('order/fetchOrderBySeller', async (sellerId, { rejectWithValue }) => {
    try {
        if (!sellerId) return;
        const response = await api.get(`/api/orders?sellerId=${sellerId}`);
        return response.data;
    } catch (error)
    {
        return rejectWithValue(error.response.data);
    }
});

export const fetchAllOrder = createAsyncThunk('order/fetchAllOrder', async () => {
    try {
        const response = await api.get('/api/orders');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/orders/update-status`, { orderId, status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Initial state
const initialState = {
    orders: [],
    loading: false,
    error: null,
    message: null
};

// Slice
const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.error = null;
            state.message = null;
            state.orders = [];
        }
    },
    extraReducers: (builder) => {
        builder
        // fetch order by seller
        .addCase(fetchOrderBySeller.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchOrderBySeller.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchOrderBySeller.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // fetch all order
        .addCase(fetchAllOrder.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchAllOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // update order status
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateOrderStatus.fulfilled, (state) => {
            state.loading = false;
            state.message = 'Order status updated successfully';
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

// Export Actions and reducer
export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;