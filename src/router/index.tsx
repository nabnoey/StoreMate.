import { createBrowserRouter } from "react-router";
import Home from "../pages/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import MainLayout from "../layouts/MainLayout";

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
    path:"/register",
    element:<RegisterPage/>
    }


        ]
    }
   

])

export default router;