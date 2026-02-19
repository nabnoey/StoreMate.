import type { Product } from "../types/product"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { addToCart } from "../redux/carts/CartReducer"
import { MdAddShoppingCart } from "react-icons/md"

type Props = {
  product: Product
}

function ProductCard({ product }: Props) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  return (
    <div className="card bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-3 text-black w-full max-w-[280px] h-[420px]">

      {/* รูป */}
      <figure className="px-2 pt-2 overflow-hidden rounded-2xl h-[220px]">
        <img
          src={product.imageUrl || "https://via.placeholder.com/300x200"}
          alt={product.productName}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-110"
        />
      </figure>

      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          {/* ชื่อ */}
          <h2 className="card-title text-base line-clamp-1">
            {product.productName}
          </h2>

          {/* summary */}
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {product.summary}
          </p>
        </div>

        <div className="card-actions justify-between items-center mt-4">
          <p className="font-extrabold text-lg text-[#D4AF37]">
            ฿{product.price}
          </p>

          <button
            onClick={handleAddToCart}
             className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-[#E5E7EB] shadow-sm hover:bg-gray-100 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdAddShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
