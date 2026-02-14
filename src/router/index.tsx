import { createBrowserRouter } from "react-router";
import Home from "../pages/HomePage";
import CartPage from "../pages/CartPage"
import RegisterPage from "../pages/auth/RegisterPage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/users/Profile"



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
        path:"/profile",
        element:<Profile/>

    }


        ]

        
    }

    
   

])

export default router;