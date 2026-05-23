import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import authReducer from "./auth/authReducer";
import cartReducer from "./carts/CartReducer";
import productsReducer from "./products/productReducer";
import reviewsReducer from "./reviews/reviewsReducer";
import addressReducer from "./address/addressReducer";
import paymentReducer from "./payment/paymentReducer";
import orderReducer from "./orders/orderReducer";
import moderatorReducer from "./moderator/ModeratorReducer";
import refundReducer from "./moderator/refundReducer";

const storage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

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
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["carts", "payment", "orders"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,

  // ✅ กัน error non-serializable
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
