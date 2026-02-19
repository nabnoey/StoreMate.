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
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Profile = lazy(() => import("../pages/users/Profile"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const Stock = lazy(() => import("../pages/admin/Stock"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const SalesReport = lazy(() => import("../pages/admin/SalesReport"));
const StoreEdit = lazy(() => import("../pages/admin/StoreEdit"));
const UserEdit = lazy(() => import("../pages/admin/UserEdit"));
const Orders = lazy(() => import("../pages/admin/Orders"));



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

        
    },

    {
        path:"/admin",
        element:<AdminLayout/>,
        children:[
            {
                path:"stock",
                element:<Stock/>

            },
            {
                path:"dashboard",
                element:<Dashboard/>

            },
            {
                path:"sales-report",
                element:<SalesReport/>

            
            },
            {
                path:"store-edit",
                element:<StoreEdit/>

            
            },
            {
                path:"user-edit",
                element:<UserEdit/>

            
            },
            {
                path:"orders",
                element:<Orders/>

            
            
            }

        ]
    }
   

])

export default router;