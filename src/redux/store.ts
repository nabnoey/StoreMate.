import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/ProductReducer";
import pagesReducer from "./pages/pagesReducer";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        pages: pagesReducer,
        carts: cartReducer,
        products: productsReducer
    },
devTools: true

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch