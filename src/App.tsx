import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./router";

import { getAccessToken } from "./utils/auth";
import { setToken } from "./redux/auth/authReducer";
import usePaymentSocket from "./hooks/usePaymentSocket";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();

    console.log("🔑 INIT TOKEN:", token);

    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  usePaymentSocket();
  return <RouterProvider router={router} />;
}

export default App;
