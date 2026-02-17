import type { Product } from "../types/product";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { addToCart } from "../redux/carts/CartReducer";
import { removeQuantity } from "../redux/products/productReducer";
import { MdAddShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (e: React.MouseEvent) => {
    // 2. ใช้ stopPropagation เพื่อไม่ให้ event ไหลไปโดน Link ของ Card
    e.preventDefault();
    e.stopPropagation();
    
    if (product.quantity > 0) {
      dispatch(addToCart(product));
      dispatch(removeQuantity(product.id));
    }
  };

  return (
    <div className="card bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-3 text-black w-full max-w-[280px] h-[450px] relative">
      
      {/* 3. ครอบส่วนเนื้อหาด้วย Link ไปยัง path รายละเอียดสินค้า */}
      <Link to={`/product/${product.id}`} className="block group">
        <figure className="px-2 pt-2 overflow-hidden rounded-2xl h-[250px]">
          <img
            src={product.image}
            alt={product.productName}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          />
        </figure>
        
        <div className="card-body p-4 flex flex-col justify-between">
          <div>
            <h2 className="card-title text-base line-clamp-1 group-hover:text-blue-600 transition-colors" title={product.productName}>
              {product.productName}
            </h2>
            <p className="font-extralight text-[#5C6B5F] text-sm line-clamp-2 mt-2">
              {product.description}
            </p>
          </div>
        </div>
      </Link>

      {/* 4. ส่วน Actions (ราคาและปุ่ม) วางแยกไว้เพื่อให้กดแยกกันได้ */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-lg text-[#D4AF37]">
            ฿{product.price.toLocaleString()}
          </p>

          <button
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-[#E5E7EB] shadow-sm hover:bg-gray-100 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            title={product.quantity <= 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
          >
            <MdAddShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
