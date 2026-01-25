import { createBrowserRouter } from "react-router";
import Home from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";

const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[


        {
            path:"/",
            element:<Home/>


        }


        ]
    }
])

export default router;