import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import GuestRoute from "./GuestRoute";
import ProtectedRout from "./ProtectedRout";
import AdminRoute from "./AdminRoute";
import { lazyDelay } from "../utils/lazyDelay";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ModeratorRoute from "./ModeratorRoute";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const Home = lazy(() => import("../pages/HomePage"));
const ShoppingCartPage = lazy(
  () => import("../pages/users/carts/ShoppingCart"),
);
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Profile = lazy(() => import("../pages/users/Profile"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetails"));
const PaymentShoping = lazy(
  () => import("../pages/users/payment/PaymentShoping"),
);
const SearchPage = lazy(() => import("../pages/SearchPage"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const AddressProfile = lazy(() => import("../pages/users/AddreesProfile"));
const AboutUs = lazy(() => import("../pages/AboutAs"));
const Contact = lazy(() => import("../pages/Contact"));
const AddCreditCard = lazy(
  () => import("../pages/users/payment/AddCreditCard"),
);
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const PaymentQR = lazy(() => import("../pages/users/payment/PaymentQR"));
const HistoryPage = lazy(() => import("../pages/users/orders/HistoryShop"));
const OderDetails = lazy(() => import("../pages/users/orders/OrderDetails"));
const CancelOrderPage = lazy(
  () => import("./../pages/users/orders/CancelOrder"),
);
import Stock from "../pages/admin/Stock";
import Dashboard from "../pages/admin/Dashboard";
import RefundModeratorPage from "../pages/moderator/RefundModeratorPage";
import Order from "../pages/admin/Orders";
import OrderDetail from "../pages/admin/OrderDetail";
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
        element: (
          <ProtectedRout>
            <ShoppingCartPage />
          </ProtectedRout>
        ),
      },
      {
        path: "payment",
        element: (
          <ProtectedRout>
            <PaymentShoping />
          </ProtectedRout>
        ),
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
        element: (
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRout>
            <ChangePassword />
          </ProtectedRout>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRout>
            <Profile />
          </ProtectedRout>
        ),
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
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "add-credit-card",
        element: <AddCreditCard />,
      },
      {
        path: "/payment-qr",
        element: <PaymentQR />,
      },
      {
        path: "history-shop",
        element: (
          <ProtectedRout>
            <HistoryPage />
          </ProtectedRout>
        ),
      },

      {
        path: "/orders",
        element: (
          <ProtectedRout>
            <HistoryPage />
          </ProtectedRout>
        ),
      },

      {
        path: "/orders/:orderNo",
        element: (
          <ProtectedRout>
            <OderDetails />
          </ProtectedRout>
        ),
      },
      {
        path: "cancel-orders/:orderNo",
        element: (
          <ProtectedRout>
            <CancelOrderPage />
          </ProtectedRout>
        ),
      },
    ],
  },

  {

    path: "/moderator",

    element: (
      <ModeratorRoute>
        <AdminLayout />
      </ModeratorRoute>
      ,


    ),

    children: [
      {
        path: "ordersMod",
        element: <Order />,
      },
      {
        path: "ordersMod/:orderNo",
        element: <OrderDetail />,
      },
      {
        index: true,
        element: <Navigate to="dashboard" replace />
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "stock",
        element: <Stock />,
      },

      // {
      //   path: "orders",
      //   element: <Order />,
      // },
      {
        path: "refund",
        element: <RefundModeratorPage />,
      },
    ],
  },
]);

export default router;
