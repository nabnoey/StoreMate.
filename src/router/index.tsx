import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import GuestRoute from "./GuestRoute";
import ProtectedRout from "./ProtectedRout";
import AdminRoute from "./AdminRoute";
import { lazyDelay } from "../utils/lazyDelay";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ModeratorRoute from "./ModeratorRoute";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Home = lazy(() => lazyDelay(() => import("../pages/HomePage"), 3000));
const ShoppingCartPage = lazy(() =>
  lazyDelay(() => import("../pages/users/carts/ShoppingCart"), 1200),
);
const RegisterPage = lazy(() =>
  lazyDelay(() => import("../pages/auth/RegisterPage"), 1200),
);
const LoginPage = lazy(() =>
  lazyDelay(() => import("../pages/auth/LoginPage"), 1200),
);
const ForgotPassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ForgotPassword"), 1200),
);
const Profile = lazy(() =>
  lazyDelay(() => import("../pages/users/Profile"), 1200),
);
const ResetPassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ResetPassword"), 1200),
);
const ChangePassword = lazy(() =>
  lazyDelay(() => import("../pages/auth/ChangePassword"), 1200),
);
const ProductDetailPage = lazy(() =>
  lazyDelay(() => import("../pages/ProductDetails"), 1200),
);
const PaymentShoping = lazy(() =>
  lazyDelay(() => import("../pages/users/payment/PaymentShoping"), 1200),
);
const SearchPage = lazy(() =>
  lazyDelay(() => import("../pages/SearchPage"), 1200),
);
const CategoryPage = lazy(() =>
  lazyDelay(() => import("../pages/CategoryPage"), 1200),
);
const AddressProfile = lazy(() =>
  lazyDelay(() => import("../pages/users/AddreesProfile"), 1200),
);
const AboutUs = lazy(() => lazyDelay(() => import("../pages/AboutAs"), 1200));
const Contact = lazy(() => lazyDelay(() => import("../pages/Contact")));
const MainLayout = lazy(() =>
  lazyDelay(() => import("../layouts/MainLayout"), 1200),
);

const AddCreditCard = lazy(() =>
  lazyDelay(() => import("../pages/users/payment/AddCreditCard"), 1200),
);

const AdminLayout = lazy(() =>
  lazyDelay(() => import("../layouts/AdminLayout"), 1200),
);

const PaymentQR = lazy(() =>
  lazyDelay(() => import("../pages/users/payment/PaymentQR"), 1200),
);

const HistoryPage = lazy(() =>
  lazyDelay(() => import("../pages/users/orders/HistoryShop"), 1200),
);

const OderDetails = lazy(() =>
  lazyDelay(() => import("../pages/users/orders/OrderDetails"), 1200),
);
const CancelOrderPage = lazy(() =>
  lazyDelay(() => import("./../pages/users/orders/CancelOrder"), 1200),
);
import Stock from "../pages/admin/Stock";
import Dashboard from "../pages/admin/Dashboard";
import RefundModeratorPage from "../pages/moderator/RefundModeratorPage";
import Order from "../pages/admin/Orders";
import OrderDetail from "../pages/admin/OrderDetail";
import UserEdit from "../pages/admin/UserEdit";
import StoreEdit from "../pages/admin/StoreEdit";

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
            <Elements stripe={stripePromise}>
              <PaymentShoping />
            </Elements>
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
    ),
    children: [
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
      {
        path: "ordersMod",
        element: <Order />,
      },
      {
        path: "ordersMod/:orderNo",
        element: <OrderDetail />,
      },
      {
        path: "refund",
        element: <RefundModeratorPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
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
      {
        path: "ordersMod",
        element: <Order />,
      },
      {
        path: "ordersMod/:orderNo",
        element: <OrderDetail />,
      },
      {
        path: "refund",
        element: <RefundModeratorPage />,
      },
      {
        path: "user-edit",
        element: <UserEdit />,
      },
      {
        path: "store-edit",
        element: <StoreEdit />,
      },
    ],
  },
]);

export default router;
