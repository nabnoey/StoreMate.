import { createBrowserRouter } from "react-router";

// import Home from "../pages/HomePage";
// import CartPage from "../pages/CartPage"
// import RegisterPage from "../pages/auth/RegisterPage";
// import MainLayout from "../layouts/MainLayout";
// import LoginPage from "../pages/auth/LoginPage";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import Profile from "../pages/users/Profile"
// import ResetPassword from "../pages/auth/ResetPassword";


import {lazy} from "react";
const Home = lazy(() => import("../pages/HomePage"));
// const CartPage = lazy(() => import("../pages/CartPage"));
const ShoppingCartPage = lazy(() => import("../pages/users/carts/ShoppingCart"));
const RegisterPage = lazy  (() => import("../pages/auth/RegisterPage"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Profile = lazy(() => import("../pages/users/Profile"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetails"));
const PaymentShoping = lazy(() => import("../pages/users/carts/PaymentShoping"));


const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[


        {
            path:"/",
            element:<Home/>


        },
        {
  path: "/shopping-cart",
  element: <ShoppingCartPage /> 
},

{
path:"/payment",
element:<PaymentShoping/>
},

         {
    path:"/register",
    element:<RegisterPage/>
    },
    {
        path:"/login",
        element:<LoginPage/>
    },
    {
        path:"/forgot-password",
        element:<ForgotPassword/>
    },

    {
        path:"/reset-password",
        element:<ResetPassword/>

    },
    {
        path:"/change-password",
        element:<ChangePassword/>

    },
    {
        path:"/profile",
        element:<Profile/>

    },
    {
        path:"/product/:id",
        element:<ProductDetailPage/>
    }


        ]

        
    }

    
   

])

export default router;