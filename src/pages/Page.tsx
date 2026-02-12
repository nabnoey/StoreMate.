import { useSelector } from "react-redux"
import type { RootState } from "../redux/store";
import HomePage from "./HomePage"
import MyProductCart from "../components/MyProductCard";

const Page = () => {
 const page = useSelector((state: RootState) => state.pages)
  return (

   
    <div>{page.home ? <HomePage/> : <MyProductCart />}</div>
  )
}

export default Page