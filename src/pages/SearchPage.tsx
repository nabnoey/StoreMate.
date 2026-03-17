import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { search } from "../../src/redux/products/productReducer";
import ProductCard from "../components/user/ProductCard";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const categoryMap: Record<string, number> = {
  promotion: 1,
  soap: 2,
  drinks: 3,
  shampoo: 4,
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const keyword: string = searchParams.get("keyword") || "";
  const category = searchParams.get("category")?.toLowerCase() || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  const searchResult = useSelector(
    (state: RootState) => state.products.searchResult,
  );

  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);
  const [openFilter, setOpenFilter] = useState(false);

  const handleClearFilter = () => {
    setMaxPriceInput("");
    setMinPriceInput("");
    setSearchParams();
    setInputValue("");
  };

  useEffect(() => {
    const categoryId = category ? (categoryMap[category] ?? null) : null;
    dispatch(
      search({
        keyword,
        categoryId: categoryId,
        minPrice: minPriceParam ? Number(minPriceParam) : 0,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : 100000,
        page: 0,
        size: 1000,
      }),
    );
  }, [keyword, category, minPriceParam, maxPriceParam, dispatch]);



  
  const handleApplyPrice = () => {
    const params: any = {};
    if (keyword !== "") params.keyword = keyword;
    if (category !== "") params.category = category;

    if (minPriceInput !== "") params.minPrice = minPriceInput;
    if (maxPriceInput !== "") params.maxPrice = maxPriceInput;

    setSearchParams(params);
  };

  const [inputValue, setInputValue] = useState(keyword);
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = inputValue.trim();

      if (value) {
        navigate(
          `/search?keyword=${encodeURIComponent(value)}&category=${category}`,
        );
      } else {
        navigate("/search");
      }
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-6 md:mt-10 px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-[320px] pt-6 lg:pt-16 ">
        <div className="flex items-center gap-10 justify-between w-full lg:w-full">
          <div className="relative flex-1 w-full pl-5 lg:pl-0 md:left-1">
            <GoSearch className="absolute lg:left-4 left-8  top-1/2 -translate-y-1/2 text-gray-500 " />

            <input
              data-test="input-search"
              type="text"
              placeholder="ค้นหาสินค้า..."
              className="w-full h-[40px]  text-black border border-gray-300 rounded pl-10 "
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <button
            onClick={() => setOpenFilter(!openFilter)}
            className="p-2   rounded-md lg:hidden text-black "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="4 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 20q-.425 0-.712-.288T10 19v-6L4.2 5.6q-.375-.5-.112-1.05T5 4h14q.65 0 .913.55T19.8 5.6L14 13v6q0 .425-.288.713T13 20z"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${openFilter ? "block" : "hidden"} lg:block w-full lg:w-[320px] pt-6 lg:pt-16`}
        >
          <div className="flex items-center justify-between mb-4 ">
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
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              ล้างค่า
            </button>
          </div>
          <div className="border-b border-gray-300 my-4"></div>
          <p className="text-black text-[16px]">หมวดหมู่</p>


          <div className="space-y-2 mt-2 indent-3">
            <p
              data-test="category-all"
              onClick={() => {
                setSearchParams({
                  keyword: keyword,
                  minPrice: minPriceParam,
                  maxPrice: maxPriceParam,
                  // category: "",
                });
              }}
              className={`cursor-pointer ${
                category === ""
                  ? "text-black font-medium"
                  : "text-gray-400 text-[16px] "
              }`}
            >
              ทั้งหมด
            </p>

            <p
              data-test="category-soap"
              onClick={() => {
                setSearchParams({
                  keyword: keyword,
                  category: "soap",
                  minPrice: minPriceParam,
                  maxPrice: maxPriceParam,
                });
              }}
              className={`cursor-pointer ${
                category === "soap"
                  ? "text-black font-medium"
                  : "text-gray-400  text-[14px]"
              }`}
            >
              สบู่
            </p>

            <p
              data-test="category-shampoo"
              onClick={() => {
                setSearchParams({
                  keyword: keyword,
                  category: "shampoo",
                  minPrice: minPriceParam,
                  maxPrice: maxPriceParam,
                });
              }}
              className={`cursor-pointer ${
                category === "shampoo"
                  ? "text-black font-medium"
                  : "text-gray-400  text-[14px]"
              }`}
            >
              แชมพู
            </p>

            <p
              data-test="category-drink"
              onClick={() => {
                setSearchParams({
                  keyword: keyword,
                  category: "drinks",
                  minPrice: minPriceParam,
                  maxPrice: maxPriceParam,
                });
              }}
              className={`cursor-pointer ${
                category === "drinks"
                  ? "text-black font-medium"
                  : "text-gray-400  text-[14px]"
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
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={() => handleApplyPrice()}
              className="w-full max-w-[120px] border border-gray-300 rounded p-2  text-black"
            />
            <span className="text-lg py-1">—</span>
            <input
              data-test="input-max-price"
              type="number"
              placeholder="฿"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={() => handleApplyPrice()}
              className="w-full max-w-[120px] border border-gray-300 rounded p-2 text-black"
            />
          </div>

          <div className="border-b border-gray-300 my-4 mt-2"></div>
        </div>
      </div>

      <div className="flex-1 px-5 py-15 md:py -mt-10 lg:mt-0">
        <div className="flex justify-between items-center w-full border h-[48px] border-gray-200 rounded-xl px-4 py-3 bg-white  mb-6">
          <p className="text-black">พบสินค้า {searchResult.length} รายการ</p>

          {/* <div className="bg-gray-200 w-full md:w-[162px] h-[36px] px-4 py-1 rounded-lg text-gray-700 ">
            เรียงโดย
          </div> */}
        </div>

        {searchResult.length === 0 ? (
          <p className="text-gray-500 text-center text-[24px] mt-10 ">
            ไม่พบสินค้าที่คุณค้นหา
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-8 md:gap-8  md:ml-3 justif-center pl-3">
            {searchResult.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
