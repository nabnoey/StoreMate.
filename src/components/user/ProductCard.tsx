import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

type Props = { product: Product };

function ProductCard({ product }: Readonly<Props>) {
  return (
    <Link
      to={`/product/${product.id}`}
      state={{ categoryName: product.categoryName }}
      className="block group"
      data-test="product-card"
    >
   
      <div className="card bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-3 text-black w-full max-w-[280px] h-[450px] relative">
        
      
        <figure className="overflow-hidden rounded-xl h-[220px] w-full"> 
          <img
            src={product.imageUrl}
            alt="สินค้า"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </figure>
        
        
        <div className="card-body p-4 flex flex-col justify-between">
          <div>
            <h2 className="card-title text-base w-full whitespace-normal break-words line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.productName}
            </h2>
            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
              {product.description}
            </p>
          </div>
        </div>
        
        
        <div className="px-4 pb-4 mt-auto">
          <div className="flex justify-between items-center">
            <p className="font-extrabold text-lg text-blue-500">
              ฿{product.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;