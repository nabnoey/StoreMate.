import type { Product } from "../types/product"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { addToCart } from "../redux/carts/CartReducer"
import {removeQuantity} from "../redux/products/productReducer"
import { MdAddShoppingCart } from "react-icons/md";


type Props = {
  product :Product
}

function ProductCard ({product}:Props) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
       dispatch(removeQuantity(product.id))
  }

  return (
    
    <div className="">
        
        <div className="card bg-white rounded-2xl gap-5 shadow-md -mt-5 p-2 text-black w-[280px] h-[432px]  shadow-xl">
  <figure>
    <img
      src={product.image}
      alt="Shoes"
      className="w-53.25 h-53.25 p-1"
      />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{product.title}</h2>
     <p className="font-extralight text-[#5C6B5F]">{product.description}</p>
  
   
   <div className="card-actions justify-between items-center mt-2">
  
  <p className="font-extrabold text-[17px] text-[#D4AF37]">
    ฿{product.price}
  </p>

<button 
  className="w-8 h-10 rounded-full bg-white text-black flex items-center justify-center border border-[#E5E7EB] shadow-sm hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  onClick={handleAddToCart}
  disabled={product.quantity<=0}
>
  <MdAddShoppingCart className="text-xl"/>
</button>


</div>
  </div>
</div>
</div>
  )
}


export default ProductCard

