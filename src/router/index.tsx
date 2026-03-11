import { createBrowserRouter } from "react-router";
import {lazy} from "react";
const Home = lazy(() => import("../pages/HomePage"));
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
const SearchPage = lazy(() => import("../pages/SearchPage"));
const CategoryPage = lazy(() => import("../pages/users/CategoryPage"));




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
    },
    {
        path:"/search",
        element:<SearchPage/>
    },
    {
        path:"/category/:category",
        element:<CategoryPage/>
    }


        ]

        
    }

    
   

])

export default router;