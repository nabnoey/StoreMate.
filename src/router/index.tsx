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
const CartPage = lazy(() => import("../pages/CartPage"));
const RegisterPage = lazy  (() => import("../pages/auth/RegisterPage"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Profile = lazy(() => import("../pages/users/Profile"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
import ChangePassword from "../pages/auth/ChangePassword";


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
  path: "/cart",
  element: <CartPage /> 
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

    }


        ]

        
    }

    
   

])

export default router;