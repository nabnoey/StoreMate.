
import type { Product } from "../../types/product"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../redux/store"
import { addToCart } from "../../redux/carts/CartReducer"
import { removeQuantity } from "../../redux/products/productReducer"
import { MdAddShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";


type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart(product))
       dispatch(removeQuantity(product.id))
  }


  return (
    <div className="card bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-3 text-black w-full max-w-[280px] h-[450px] relative">

      <Link to={`/product/${product.id}`} className="block group">
        <figure className="px-2 pt-2 overflow-hidden rounded-2xl h-[250px]">
          <img
            src={product.imageUrl || "https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/631033255_1486282403500023_4710477623864277946_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=LVsLjxBcDngQ7kNvwFmpYeP&_nc_oc=AdmHGAm1Ibg5tetmmBOuVUnoW_F2a1qp7KhZsXxMvcnSR7A5c33a3gZ1xUjWiQ_TpjoNQHOLqHy16moZpzcR1Kzo&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=byhROHe1c6lbVBOBQwjGhw&oh=00_AfvmSssPV69WDuHi2p-gcgpsU1WcdQhqEid0bw71o-2qmQ&oe=699E715D"}
            alt={product.productName}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
          />
        </figure>

        <div className="card-body p-4 flex flex-col justify-between">
          <div>
            <h2
              className="card-title text-base line-clamp-1 group-hover:text-blue-600 transition-colors"
              title={product.productName}
            >
              {product.productName}
            </h2>

            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
              {product.summary}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 mt-auto">
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-lg text-[#D4AF37]">
            ฿{product.price}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-[#E5E7EB] shadow-sm hover:bg-gray-100 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdAddShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;