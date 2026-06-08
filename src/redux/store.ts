import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import reviewsReducer from "./reviews/reviewsReducer";
import addressReducer from "./address/addressReducer";
import paymentReducer from "./payment/paymentReducer";
import orderReducer from "./orders/orderReducer";
import moderatorReducer from "./moderator/ModeratorReducer";
import refundReducer from "./moderator/refundReducer";
import notificationReducer from "./notification/notificationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  carts: cartReducer,
  products: productsReducer,
  reviews: reviewsReducer,
  address: addressReducer,
  payment: paymentReducer,
  orders: orderReducer,
  moderator: moderatorReducer,
  refunds: refundReducer,
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
