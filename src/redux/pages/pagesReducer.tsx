import { createSlice } from "@reduxjs/toolkit";
type PagesState = {
  home: boolean;
};

const initialState: PagesState = {
  home: true,
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    Home(state) {
      state.home = true;
    },
    Cart(state) {
      state.home = false;
    },
  },
});

export const { Home, Cart } = pagesSlice.actions;
export default pagesSlice.reducer;