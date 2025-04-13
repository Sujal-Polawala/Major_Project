import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosintance";

// Asynchronous action for seller sign-up
export const signSeller = createAsyncThunk(
  "registration/signup",
  async (FormData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/seller-register",
        FormData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  loading: false,
  message: null,
  error: null,
  email: null,
};

const registrationSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    // Reset registration state
    resetRegistration: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signSeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(signSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.email = action.payload.email;
      })
      .addCase(signSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Handle error here
      });
  },
});

export const { resetRegistration } = registrationSlice.actions;
export default registrationSlice.reducer;
