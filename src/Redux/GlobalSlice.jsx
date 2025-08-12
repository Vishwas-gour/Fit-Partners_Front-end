import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
  wishlistCount: 0,
  orderCount: 0,
  search : false, // for visibility
};

const GlobalSlice = createSlice({
  name: "counts",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    setWishlistCount: (state, action) => {
      state.wishlistCount = action.payload;
    },
    setOrderCount: (state, action) => {
      state.orderCount = action.payload;
    },
    setSearchBoxIsVisible:(state, {payload})=>{
      state.search = payload;
    },

  },
});

export const { setCartCount, setWishlistCount, setOrderCount, setSearchBoxIsVisible } = GlobalSlice.actions;
export default GlobalSlice.reducer;
