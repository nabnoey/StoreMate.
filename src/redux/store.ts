import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import productReducer from "./products/productReducer";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        product:productReducer
    },
devTools: true

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch