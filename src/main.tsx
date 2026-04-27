import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            error: { duration: 5000 },
          }}
        />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
