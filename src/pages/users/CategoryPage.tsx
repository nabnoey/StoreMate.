import { useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ProductCard from "../../components/user/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const categoryName: Record<string, string> = {
    promotion: "โปรโมชั่น",
    soap: "สบู่สมุนไพร",
    shampoo: "แชมพูสมุนไพร",
    drinks: "เครื่องดื่ม",
  };

  const items = useSelector((state: RootState) => state.products.items);

  const categoryProducts = items.filter(
    (p) =>
      p.categoryName?.toLocaleLowerCase() === category?.toLocaleLowerCase(),
  );

  return (
    <div className="max-w-[1440px] mx-auto p-15  mt-8">
      <h1 className="text-3xl font-medium mb-8 text-black">
        สินค้า{" "}
        <span className=" text-blue-500">{categoryName[category || ""]}</span>
      </h1>

      {categoryProducts.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">
          ไม่มีสินค้าในหมวดนี้
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
