import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";

import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import loadingReducer from "./loading/loadingReducer";
import addressReducer from "./address/addressReducer";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        carts: cartReducer,
        products: productsReducer,
        loading: loadingReducer,
        address: addressReducer,
    },
devTools: true

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch