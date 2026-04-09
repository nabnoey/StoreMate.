import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import reviewsReducer from "./reviews/reviewsReducer";
import addressReducer from "./address/addressReducer";

//import middleware จาก payment มาด้วยเลย
import paymentReducer, {
  paymentLocalStorageMiddleware,
} from "./payment/paymentReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carts: cartReducer,
    products: productsReducer,
    reviews: reviewsReducer,
    address: addressReducer,
    payment: paymentReducer,
  },
  devTools: true,

  //เสียบ middleware ของ payment ในนระบบเลย
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(paymentLocalStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
