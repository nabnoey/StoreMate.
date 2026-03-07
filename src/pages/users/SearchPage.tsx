import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchProducts, search } from "../../redux/products/productReducer";
import ProductCard from "../../components/user/ProductCard";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleClearFilter = () => {
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const searchResult = useSelector((state: RootState) => state.products.items);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all",
  );

  useEffect(() => {
    if (keyword.trim() !== "") {
      dispatch(search(keyword));
    }
  }, [keyword, dispatch]);

  const displayProducts = searchResult.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      p.categoryName?.toLowerCase() === selectedCategory;

    const matchPrice =
      (!minPrice || p.price >= Number(minPrice)) &&
      (!maxPrice || p.price <= Number(maxPrice));

    return matchCategory && matchPrice;
  });

  const [inputValue, setInputValue] = useState(keyword);
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-6 md:mt-10 px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-[320px] pt-6 lg:pt-16">
        <div className="relative w-full">
          <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            data-test="input-search"
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full h-[40px] text-black border border-gray-300 rounded pl-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <div className="flex items-center justify-between mt-5 mb-4 ">
          <h3 className="text-xl font-bold flex items-center gap-2 text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 20q-.425 0-.712-.288T10 19v-6L4.2 5.6q-.375-.5-.112-1.05T5 4h14q.65 0 .913.55T19.8 5.6L14 13v6q0 .425-.288.713T13 20z"
              />
            </svg>
            ตัวกรอง
          </h3>

          <button
            data-test="clear-filter"
            onClick={handleClearFilter}
            className="text-gray-500 hover:text-black"
          >
            ล้างค่า
          </button>
        </div>
        <div className="border-b border-gray-300 my-4"></div>
        <p className="text-black text-[16px]">หมวดหมู่</p>

        <div className="space-y-2 mt-2 text-black">
          <p
            data-test="category-all"
            onClick={() => setSelectedCategory("all")}
            className={`cursor-pointer ${
              selectedCategory === "all"
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            ทั้งหมด
          </p>

          <p
            data-test="category-promotion"
            onClick={() => setSelectedCategory("promotion")}
            className={`cursor-pointer ${
              selectedCategory === "promotion"
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            โปรโมชั่น
          </p>

          <p
            data-test="category-soap"
            onClick={() => setSelectedCategory("soap")}
            className={`cursor-pointer ${
              selectedCategory === "soap"
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            สบู่
          </p>

          <p
            data-test="category-shampoo"
            onClick={() => setSelectedCategory("shampoo")}
            className={`cursor-pointer ${
              selectedCategory === "shampoo"
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            แชมพู
          </p>

          <p
            data-test="category-drink"
            onClick={() => setSelectedCategory("drink")}
            className={`cursor-pointer ${
              selectedCategory === "drink"
                ? "text-black font-medium"
                : "text-gray-400"
            }`}
          >
            เครื่องดื่ม
          </p>
        </div>

        <div className="border-b border-gray-300 my-4"></div>

        <p className="text-[16px] text-black">ช่วงราคา (฿)</p>
        <div className="flex items-center gap-3 mt-1 text-black">
          <input
            data-test="input-min-price"
            type="number"
            placeholder="฿"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full max-w-[120px] border border-gray-300 rounded p-2  text-black"
          />
          <span className="text-lg py-1">—</span>
          <input
            data-test="input-max-price"
            type="number"
            placeholder="฿"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full max-w-[120px] border border-gray-300 rounded p-2 text-black"
          />
        </div>
      </div>

      <div className="flex-1 px-5 py-15 md:py lg:mt-0">
        <div className="flex justify-between items-center w-full border h-[48px] border-gray-200 rounded-xl px-4 py-3 bg-white  mb-6">
          <p className="text-black">พบสินค้า {displayProducts.length} รายการ</p>

          <div className="bg-gray-200 w-full md:w-[162px] h-[36px] px-4 py-1 rounded-lg text-gray-700 ">
            เรียงโดย
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <p className="text-gray-500 text-center text-[24px] mt-10 ">
            ไม่พบสินค้าที่คุณค้นหา
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8 justify-items-center">
            {displayProducts.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
