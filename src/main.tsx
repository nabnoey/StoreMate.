import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store";
import router from "./router";
import Loading from "./components/loading/Loading";
import "./index.css";
import { Toaster } from 'react-hot-toast' 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loading />}> 
       <Toaster position="top-center" reverseOrder={false} /> 
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);