import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { Icon } from "@iconify/react";
import { fetchProducts } from "../redux/products/productReducer";
import { useEffect } from "react";
import banner from "../assets/banner2.webp";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/user/ProductCard";

const SectionHeader = ({
  title,
  subTitle,
  category,
}: {
  title: string;
  subTitle: string;
  category: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between pr-5  items-center mb-5 mt-20 ">
      <div>
        <h2 className="text-[24px] md:text-[32px] -ml-4 font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-[14px] md:text-[16px] -ml-4 text-gray-500 mt-1 font-light opacity-80">
          {subTitle}
        </p>
      </div>

      <button
        className="flex items-center mt-10 gap-2 text-blue-500 cursor-pointer "
        data-test="see-all-link"
        onClick={() => navigate(`/search?category=${category}`)}
      >
        <span className="text-[14px] md:text-[16px] font-semibold whitespace-nowrap">
          ดูทั้งหมด
        </span>

        <span className="text-xl">›</span>
      </button>
    </div>
  );
};

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const groupedProduct = useSelector(
    (state: RootState) => state.products.groupedProducts,
  );


  const getCategoryProducts = (category:string) => {
    return (
      groupedProduct.find(
        (group) => group.categoryName.toLowerCase() === category,
      )?.products || []
    );
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="w-full pb-24 bg-white" id="home-page">
      <section
        className="relative w-full min-h-150 md:h-150 bg-[#14261C] overflow-hidden flex items-center mb-10 py-10 md:py-0"
        id="hero-banner"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="w-full md:w-1/2 text-left">
            <span
              id="hero-otop-badge"
              className="inline-block bg-[#3D4221] text-[#E5C67C] text-[12px] px-5 py-1.5 rounded-full border border-[#E5C67C]/30 mb-8 font-bold tracking-widest uppercase"
              data-testid="otop-badge"
            >
              OTOP ราชบุรี
            </span>
            <h1
              id="hero-title"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-6"
            >
              สมุนไพร <br />
              <span className="text-[#D4AF37]">มะม่วงหาวมะนาวโห่</span> <br />
              ตรา พัดทอง
            </h1>
            <p
              id="hero-description"
              className="text-gray-300 max-w-lg text-base md:text-lg font-light leading-relaxed mb-10 opacity-90"
            >
              คัดสรรวัตถุดิบคุณภาพจากธรรมชาติ เพื่อสุขภาพที่ดีของคุณ
              ด้วยกรรมวิธีผลิตที่สะอาด ปลอดภัย ได้มาตรฐานสากล
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                id="btn-hero-see-all"
                className="bg-[#D4AF37] text-[#14261C] px-8 md:px-10 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-xl cursor-pointer"
                onClick={() => navigate("/search")}
              >
                ดูสินค้าทั้งหมด
              </button>
              <button
                onClick={() => navigate(`/about-us`)}
                id="btn-hero-about-us"
                className="border border-white/30 bg-white/5 text-white px-8 py-3 rounded-full font-bold w-fit hover:bg-white/10 transition-colors cursor-pointer"
              >
                เกี่ยวกับเรา
              </button>
            </div>
          </div>

          {/* Right: Image Showcase */}
          <div
            id="hero-image-container"
            className="w-full md:w-[37%] bg-white rounded-2xl shadow-2xl p-6"
          >
            <img
              id="hero-image"
              src={banner}
              alt="Promotion Banner"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Promotion Section */}
        <section
          id="promotion-section"
          className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32 "
        >
          {/* <ContentWrapper> */}
          <SectionHeader
            title="โปรโมชั่นสุดพิเศษ"
            subTitle="น้ำสมุนไพรเพื่อสุขภาพ รสชาติกลมกล่อม ดื่มง่าย"
            category="promotion"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
            {getCategoryProducts("promotion").map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* </ContentWrapper> */}

          {/* เงื่อนไข: ถ้าไม่มีสินค้า ให้แสดงกรอบเส้นประ "ไม่พบรายการสินค้า" */}
          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-100 border-2 border-solid border-gray-200 rounded-4xl flex flex-col items-center justify-center p-10 bg-white text-black">
              {/* วงกลมรองหลัง Icon */}
              <div className="w-24 h-24  rounded-full flex items-center justify-center mb-5">
                {/* Icon กล่อง (ใช้ HiOutlineInbox หรือ Icon อื่นๆ ที่สื่อความหมาย) */}
                <Icon
                  icon="icon-park:ad-product"
                  className="text-7xl text-black"
                />
              </div>
              {/* ข้อความ */}
              <h3 className="text-xl font-md text-black">ไม่พบรายการสินค้า</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-2"></div>
          )}
        </section>

        {/* Soap Section */}
        <section
          id="soap-section"
          className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32"
        >
          {/* <ContentWrapper> */}
          <SectionHeader
            title="สบู่สมุนไพร"
            subTitle="ดูแลและบำรุงผิวพรรณด้วยคุณค่าจากธรรมชาติแท้ 100%"
            category="soap"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
            {getCategoryProducts("soap").map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* เงื่อนไข: ถ้าไม่มีสินค้า ให้แสดงกรอบเส้นประ "ไม่พบรายการสินค้า" */}
          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-100 border-2 border-solid border-gray-200 rounded-4xl flex flex-col items-center justify-center p-10 bg-white text-black">
              {/* วงกลมรองหลัง Icon */}
              <div className="w-24 h-24  rounded-full flex items-center justify-center mb-5">
                {/* Icon กล่อง (ใช้ HiOutlineInbox หรือ Icon อื่นๆ ที่สื่อความหมาย) */}
                <Icon
                  icon="icon-park:ad-product"
                  className="text-7xl text-black"
                />
              </div>
              {/* ข้อความ */}
              <h3 className="text-xl font-md text-black">ไม่พบรายการสินค้า</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-2"></div>
          )}
        </section>

        {/* Soap Section */}
        <section
          id="soap-section"
          className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32"
        >
          {/* <ContentWrapper> */}
          <SectionHeader
            title="เครื่องดื่ม"
            subTitle="ดูแลผิวผันให้สดใสจากธรรมชาติ"
            category="drinks"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
            {getCategoryProducts("drinks").map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* เงื่อนไข: ถ้าไม่มีสินค้า ให้แสดงกรอบเส้นประ "ไม่พบรายการสินค้า" */}
          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-100 border-2 border-solid border-gray-200 rounded-4xl flex flex-col items-center justify-center p-10 bg-white text-black">
              {/* วงกลมรองหลัง Icon */}
              <div className="w-24 h-24  rounded-full flex items-center justify-center mb-5">
                {/* Icon กล่อง (ใช้ HiOutlineInbox หรือ Icon อื่นๆ ที่สื่อความหมาย) */}
                <Icon
                  icon="icon-park:ad-product"
                  className="text-7xl text-black"
                />
              </div>
              {/* ข้อความ */}
              <h3 className="text-xl font-md text-black">ไม่พบรายการสินค้า</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-2"></div>
          )}
          {/* </ContentWrapper> */}
        </section>

        <section
          id="soap-section"
          className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32"
        >
          <SectionHeader
            title="แชมพูสมุนไพร"
            subTitle="ดูแลเส้นผมและหนังศีรษะด้วยธรรมชาติ"
            category="shampoo"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
            {getCategoryProducts("shampoo").map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* เงื่อนไข: ถ้าไม่มีสินค้า ให้แสดงกรอบเส้นประ "ไม่พบรายการสินค้า" */}
          {groupedProduct.length === 0 ? (
            <div className="w-full min-h-100 border-2 border-solid border-gray-200 rounded-4xl flex flex-col items-center justify-center p-10 bg-white text-black">
              {/* วงกลมรองหลัง Icon */}
              <div className="w-24 h-24  rounded-full flex items-center justify-center mb-5">
                {/* Icon กล่อง (ใช้ HiOutlineInbox หรือ Icon อื่นๆ ที่สื่อความหมาย) */}
                <Icon
                  icon="icon-park:ad-product"
                  className="text-7xl text-black"
                />
              </div>
              {/* ข้อความ */}
              <h3 className="text-xl font-md text-black">ไม่พบรายการสินค้า</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-2"></div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
