import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineInbox } from "react-icons/hi";

import ProductCard from "../components/user/ProductCard";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProducts, setSearchResult } from "../redux/products/productReducer";
import { ProductService } from "../services/product.service";
import banner from "../assets/banner2.png";

const SectionHeader = ({
  title,
  subTitle,
  testId,
}: {
  title: string;
  subTitle: string;
  testId: string;
}) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 mt-16 gap-4">
  <div>
    <h2
      className="text-[24px] md:text-[32px] font-bold text-gray-900 leading-tight"
      data-testid={`${testId}-title`}
    >
      {title}
    </h2>
    <p className="text-[14px] md:text-[16px] text-gray-600 mt-1 font-light opacity-80">
      {subTitle}
    </p>
  </div>


  <button
    className="flex items-center gap-2 text-[#D4AF37] transition-all group shrink-0 self-start md:self-auto"
    data-testid={`${testId}-see-all`}
  >
    <span className="text-[14px] md:text-[16px] font-semibold">
      ดูทั้งหมด
    </span>
    <span className="text-xl group-hover:translate-x-1 transition-transform">
      ›
    </span>
  </button>
</div>
);

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const groupedProduct = useSelector(
    (state: RootState) => state.products.groupedProducts
  );


  const keyword = useSelector(
    (state: RootState) => state.products.search
  );

  const searchResult = useSelector(
    (state: RootState) => state.products.searchResult || []
  );

<<<<<<< HEAD

 useEffect(()=> {
  dispatch(fetchProducts())
 },[dispatch])
=======
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
>>>>>>> HomePage


  useEffect(() => {
    if (!keyword) return;

    ProductService.searchProducts(keyword).then((res) => {
      dispatch(setSearchResult(res.data || res || []));
    });
  }, [keyword, dispatch]);

  // ================= SEARCH MODE =================
  if (keyword) {
    return (
      <div className="w-full mt-10 px-28">
        <h2 className="text-3xl font-bold mb-6 text-black">
          ผลการค้นหา: "{keyword}"
        </h2>

<<<<<<< HEAD
const keyword = useSelector((state:RootState)=> state.products.search)
const isSearching = keyword.trim() !== ''


 console.log("keyword", keyword)



    if (isSearching) {
  return (
    <div className="w-full mt-10 px-28">
      <h2 className="text-3xl font-bold mb-6 text-black">
        ผลการค้นหา:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {searchResult.map((product) => (
          
          <ProductCard key={product.id} product={product} />
          
         
        ))}

=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResult.length > 0 ? (
            searchResult.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p
                className="text-gray-400 text-lg"
                data-testid="no-product-found"
              >
                ไม่พบสินค้าที่คุณต้องการ
              </p>
            </div>
          )}
        </div>
>>>>>>> HomePage
      </div>
   
  );
}

  // ================= NORMAL MODE =================
  return (

    <div className="w-full pb-24 bg-white" id="home-page">
      {/* HERO */}
      <section className="relative w-full min-h-[600px] bg-[#14261C] flex items-center mb-10 py-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="w-full md:w-1/2">
            <span className="inline-block bg-[#3D4221] text-[#E5C67C] text-xs px-5 py-1.5 rounded-full mb-6 font-bold uppercase">
              OTOP ราชบุรี
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              สมุนไพร <br />
              <span className="text-[#D4AF37]">
                มะม่วงหาวมะนาวโห่
              </span>{" "}
              <br />
              ตรา พัดทอง
            </h1>

            <p className="text-gray-300 mb-8">
              คัดสรรวัตถุดิบคุณภาพจากธรรมชาติ เพื่อสุขภาพที่ดีของคุณ ด้วยกรรมวิธีผลิตที่สะอาด ปลอดภัย ได้มาตรฐาน
            </p>

           <div className="flex flex-col md:flex-row gap-4 mt-6 items-start">
  <button className="bg-[#D4AF37] text-[#14261C] px-8 py-3 rounded-full font-bold w-fit hover:bg-[#c29f32] transition-colors">
    ดูสินค้าทั้งหมด
  </button>

  <button className="border border-white/30 bg-white/5 text-white px-8 py-3 rounded-full font-bold w-fit hover:bg-white/10 transition-colors">
    เกี่ยวกับเรา
  </button>
</div>
          </div>


          <div className="w-full md:w-[45%] bg-white rounded-3xl shadow-2xl p-6">
            <img
              src={banner}
              alt="Promotion Banner"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">

        {/* PROMOTION */}
        <section className="mb-20">
          <SectionHeader
            title="โปรโมชั่นสุดพิเศษ"
            subTitle="น้ำสมุนไพรเพื่อสุขภาพ รสชาติกลมกล่อม ดื่มง่าย"
            testId="promotion"
          />

          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-10">
              <HiOutlineInbox className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">
                ไม่พบรายการสินค้า
              </h3>
              <p className="text-gray-400 mt-2">
                ขออภัย ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedProduct.map(
                (group) =>
                  group.categoryName.toLowerCase() === "promotion" &&
                  group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          )}
        </section>

        {/* SOAP */}
        <section className="mb-20">
          <SectionHeader
            title="สบู่สมุนไพร"
            subTitle="ดูแลและบำรุงผิวพรรณด้วยธรรมชาติแท้ 100%"
            testId="soap"
          />

          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-10">
              <HiOutlineInbox className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">
                ไม่พบรายการสินค้า
              </h3>
              <p className="text-gray-400 mt-2">
                ขออภัย ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedProduct.map(
                (group) =>
                  group.categoryName.toLowerCase() === "soap" &&
                  group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          )}
        </section>

        {/* DRINKS */}
        <section className="mb-20">
          <SectionHeader
            title="เครื่องดื่ม"
            subTitle="ดูแลสุขภาพให้สดใสจากธรรมชาติ"
            testId="drinks"
          />

         {groupedProduct.length === 0 ? (
            <div className="w-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-10">
              <HiOutlineInbox className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">
                ไม่พบรายการสินค้า
              </h3>
              <p className="text-gray-400 mt-2">
                ขออภัย ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedProduct.map(
                (group) =>
                  group.categoryName.toLowerCase() === "drinks" &&
                  group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          )}
        </section>

        {/* SHAMPOO */}
        <section className="mb-20">
          <SectionHeader
            title="แชมพูสมุนไพร"
            subTitle="ดูแลเส้นผมและหนังศีรษะด้วยธรรมชาติ"
            testId="shampoo"
          />

          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-10">
              <HiOutlineInbox className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">
                ไม่พบรายการสินค้า
              </h3>
              <p className="text-gray-400 mt-2">
                ขออภัย ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedProduct.map(
                (group) =>
                  group.categoryName.toLowerCase() === "shampoo" &&
                  group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default HomePage;