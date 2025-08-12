import { configureStore } from "@reduxjs/toolkit";
import GlobalSlice from "./GlobalSlice.jsx"
const Store = configureStore({
  reducer: {
    counts: GlobalSlice,
  },
});

export default Store;
