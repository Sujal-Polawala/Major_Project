import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'utils/axiosintance';

// fetch all products
export const fetchAllProducts = createAsyncThunk('products/fetchAllProducts', async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const AddProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/products", newProduct);
      return response.data.product; // API should return the new product
    } catch (error) {
      return rejectWithValue(error.response?.data?.message );
    }
  }
);

// Fetch all products
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (sellerId, { rejectWithValue }) => {
    try {
      if (!sellerId) return rejectWithValue("Seller ID is required");

      const response = await api.get(`/api/products?sellerId=${sellerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Delete a product by ID
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id; // Return the deleted product ID so we can remove it from state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/products/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.updatedProduct; // Return only the updated product object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message );
    }
  }
);

export const uploadProduct = createAsyncThunk(
  "products/uploadProduct",
  async(formData , {rejectWithValue}) => {
    try {
      const response = await api.post("/upload-csv", formData)
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
)
// Initial state
const initialState = {
  loading: false,
  products: [],
  error: null,
  message: null
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProduct : (state ) => {
        state.products = [];
        state.message= null;
    },
    resetProductState : (state) => {
        state.loading = false;
        state.message = null;
        state.error = null;
    }
    },
    extraReducers: (builder) => {
    builder
      // Add Product
        .addCase(AddProduct.pending, (state) => {
        state.loading = true;
        })
        .addCase(AddProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Add new product to list
        state.message = "Product Added Successfully";
      })
      .addCase(AddProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Products
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product._id !== action.payload);
        state.message = "Product Deleted Successfully";

      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.message = "Product Updated Successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProduct.fulfilled, (state, action) => {
        state.loading = false;
        if(Array.isArray(action.payload)){
          state.products = [...state.products , ...action.payload];
        }else{
          state.products = [...state.products, action.payload]; 
        }
        state.message = "Product Uploaded Successfully";
      })
      .addCase(uploadProduct.rejected, (state , action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

// Export actions and reducer
export const {  updateProductInState , resetProduct ,resetProductState} = productSlice.actions;
export default productSlice.reducer;
