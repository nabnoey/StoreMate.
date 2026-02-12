import type { Product } from "../types/product"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { removeQuantity } from "../redux/products/ProductReducer"
import { addToCart } from "../redux/carts/CartReducer"

type Props = {
  product: Product
}

function Card({ product }: Props) {

  
  const dispatch = useDispatch<AppDispatch>() 


  const handleAddToCart = () => {

    console.log("product ก่อนส่ง =", product)

    dispatch(addToCart(product))
    dispatch(removeQuantity(product.id))
   
  }

  return (
    <div className="card bg-base-100 w-93 shadow-sm">
      <figure>
        <img src={product.image} />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-primary">
            ฿{product.price}
          </span>
          <span className="text-sm text-gray-400">
            เหลือ {product.quantity} ชิ้น
          </span>
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.quantity <= 0}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card