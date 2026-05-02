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
   
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-3 flex flex-col h-full">
  
  {/* รูป */}
  <div className="aspect-square overflow-hidden rounded-xl">
    <img
      src={product.imageUrl}
      className="w-full h-full object-cover"
    />
  </div>

  
  <div className="flex flex-col flex-grow mt-2">
    
    <h2 className="text-sm text-black font-semibold line-clamp-2">
      {product.productName}
    </h2>

    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
      {product.description}
    </p>

    
    <div className="mt-auto pt-2">
      <p className="font-bold text-blue-500">
        ฿{product.price}
      </p>
    </div>

  </div>
</div>
    </Link>
  );
}

export default ProductCard;