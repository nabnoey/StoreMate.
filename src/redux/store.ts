import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import addressReducer from "./address/addressReducer";
import reviewsReducer from "./reviews/reviewsReducer"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        carts: cartReducer,
        products: productsReducer,
        address: addressReducer,
        reviews: reviewsReducer,
    },
devTools: true

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch