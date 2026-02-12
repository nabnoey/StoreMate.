import type { Product } from "../types/product"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import {removeQuantity} from "../redux/products/productReducer.ts"

type Props = {
  product :Product
}

function ProductCard ({product}:Props) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAddToCart = () => {
       dispatch(removeQuantity(product.id))
  }

  return (
    
    <div>
        
        <div className="card bg-white text-black w-85 shadow-sm">
  <figure>
    <img
      src={product.image}
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{product.title}</h2>
    <p>Price: ${product.price}</p>
    <p>{product.description}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.quantity<=0}>Buy Now</button>
    </div>
  </div>
</div>
</div>
  )
}


export default ProductCard