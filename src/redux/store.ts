import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import reviewsReducer from "./reviews/reviewsReducer"
import addressReducer from "./address/addressReducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        carts: cartReducer,
        products: productsReducer,
        reviews: reviewsReducer,
        address: addressReducer
    },
devTools: true

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch