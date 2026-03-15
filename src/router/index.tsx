import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import GuestRoute from "./GuestRoute";
import { lazyDelay } from "../utils/lazyDelay";

const Home = lazy(() => lazyDelay(() => import("../pages/HomePage"), 3000));
const ShoppingCartPage = lazy(() =>
  lazyDelay(() => import("../pages/users/carts/ShoppingCart"), 1200)
);
const RegisterPage = lazy(() =>
  lazyDelay(() => import("../pages/auth/RegisterPage"), 1200)
);
const LoginPage = lazy(() =>
  lazyDelay(() => import("../pages/auth/LoginPage"), 1200)
);
const ForgotPassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ForgotPassword"), 1200)
);
const Profile = lazy(() =>
  lazyDelay(() => import("../pages/users/Profile"), 1200)
);
const ResetPassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ResetPassword"), 1200)
);
const ChangePassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ChangePassword"), 1200)
);
const ProductDetailPage = lazy(() =>
  lazyDelay(() => import("../pages/ProductDetails"), 1200)
);
const PaymentShoping = lazy(() =>
  lazyDelay(() => import("../pages/users/carts/PaymentShoping"), 1200)
);
const SearchPage = lazy(() =>
  lazyDelay(() => import("../pages/SearchPage"), 1200)
);
const CategoryPage = lazy(() =>
  lazyDelay(() => import("../pages/users/CategoryPage"), 1200)
);
const AddressProfile = lazy(() =>
  lazyDelay(() => import("../pages/users/AddreesProfile"), 1200)
);
const AboutUs = lazy(() =>
  lazyDelay(() => import("../pages/AboutAs"), 1200)
);
const MainLayout = lazy(() =>
  lazyDelay(() => import("../layouts/MainLayout"), 1200)
);



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shopping-cart",
        element: <ShoppingCartPage />,
      },
      {
        path: "payment",
        element: <PaymentShoping />,
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "category/:category",
        element: <CategoryPage />,
      },
      {
        path: "address-profile",
        element: <AddressProfile />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },

    ],
  },
]);

export default router;