import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  products: [],
  wishlistProducts: [],
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        if(item.quantity >= 1) {
          item.quantity += action.payload.quantity;
        }
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    setWishlist: (state, action) => {
      state.wishlistProducts = action.payload;
    },
    addToWishlist : (state , action)=> {
      const exists = state.wishlistProducts.find((item) => item._id === action.payload._id);
      if(!exists){
        state.wishlistProducts.push(action.payload);
      }
    },
    removeFromWishList : (state , action) => {
      state.wishlistProducts = state.wishlistProducts.filter((item) => item._id !== action.payload)
    },
    resetWishlist: (state) => {
      state.wishlistProducts = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  addToWishlist,
  removeFromWishList,
  resetWishlist,
  setWishlist,
} = orebiSlice.actions;
export default orebiSlice.reducer;
