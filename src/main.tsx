import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store, persistor } from "./redux/store";
import router from "./router";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <Suspense fallback={<Loading />}>  */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            // ตั้งค่าให้ toast ธรรมดาหายไปใน 3 วินาที
            duration: 3000,
            // ถ้าเป็น error อาจจะให้อยู่นานหน่อย เช่น 5 วินาที
            error: {
              duration: 5000,
            },
          }}
        />
        <RouterProvider router={router} />

        {/* </Suspense> */}
      </PersistGate>
    </Provider>
  </StrictMode>,
);
