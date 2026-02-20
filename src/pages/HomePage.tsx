import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { ProductService } from "../services/product.service";
import { HiOutlineInbox } from "react-icons/hi";
import banner from "../assets/banner.png";
import { fetchProducts, setSearchResult } from "../redux/products/productReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


  const SectionHeader = ({ title, subTitle, testId }: { title: string; subTitle: string; testId: string }) => (
    <div className="flex justify-between items-center mb-8 mt-16">
      <div>
        <h2 className="text-[24px] md:text-[32px] font-bold text-gray-900 leading-tight" data-testid={`${testId}-title`}>
          {title}
        </h2>
        <p className="text-[14px] md:text-[16px] text-gray-500 mt-1 font-light opacity-80">
          {subTitle}
        </p>
      </div>
      <button
        className="flex items-center gap-2 text-[#C5A353] hover:text-[#A68942] transition-all group shrink-0"
        data-testid={`${testId}-see-all`}
      >
        <span className="text-[14px] md:text-[16px] font-semibold">ดูทั้งหมด</span>
        <span className="text-xl leading-none transform group-hover:translate-x-1 transition-transform">›</span>
      </button>
    </div>
  );


function HomePage() {
 const dispatch = useDispatch<AppDispatch>();

 const groupedProduct = useSelector((state:RootState) => state.products.groupedProducts)

 useEffect(()=> {
  dispatch(fetchProducts())
 },[dispatch])


  //ดึงคำค้นหา
const keyword = useSelector((state:RootState)=>state.products.search)
  
  //filter สินค้า
const searchResult = useSelector(
 (state:RootState)=>state.products.searchResult || []
)

useEffect(()=>{

 if(!keyword) return

 ProductService.searchProducts(keyword)
 .then(res=>{
  

    // เช็คโครงสร้างก่อน
    dispatch(setSearchResult(res.data || res || []))
 })

},[keyword,dispatch])





    if(keyword){
    return(
      <div className="w-full mt-10 px-28">
         {/* <ContentWrapper> */}
        <h2 className="text-3xl font-bold mb-6 text-black">
          ผลการค้นหา: "{keyword}"
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {searchResult.length > 0 ? (
            searchResult.map((product)=>(
              <ProductCard key={product.id} product={product}/>
            ))
          ): (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-lg" data-testid="no-product-found">ไม่พบสินค้าที่คุณต้องการ</p>
              </div>
            )}
          </div>
      </div>
    );
  }


  return (
     <div className="w-full pb-24 bg-white" id="home-page">

     
      <section className="relative w-full min-h-150 md:h-150 bg-[#14261C] overflow-hidden flex items-center mb-10 py-10 md:py-0" id="hero-banner">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="/path-to-leaf-pattern.png" alt="" className="w-full h-full object-cover" />
        </div>

        
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full px-6 md:px-12 lg:px-24 xl:px-32">
          <div className="w-full md:w-1/2 text-left">
            <span
              className="inline-block bg-[#3D4221] text-[#E5C67C] text-[12px] px-5 py-1.5 rounded-full border border-[#E5C67C]/30 mb-8 font-bold tracking-widest uppercase"
              data-testid="otop-badge"
            >
              OTOP ราชบุรี
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-6">
              สมุนไพร <br />
              <span className="text-[#E5C67C]">มะม่วงหาวมะนาวโห่</span> <br />
              ตรา พัดทอง
            </h1>
            <p className="text-gray-300 max-w-lg text-base md:text-lg font-light leading-relaxed mb-10 opacity-90">
              คัดสรรวัตถุดิบคุณภาพจากธรรมชาติ เพื่อสุขภาพที่ดีของคุณ ด้วยกรรมวิธีผลิตที่สะอาด ปลอดภัย ได้มาตรฐานสากล
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#E5C67C] hover:bg-[#D4B56B] text-[#14261C] px-8 md:px-10 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-xl">
                ดูสินค้าทั้งหมด
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/30 text-white px-8 md:px-10 py-3 rounded-full transition-all backdrop-blur-md font-medium">
                เกี่ยวกับเรา
              </button>
            </div>
          </div>

          {/* Right: Image Showcase */}
          <div className="flex w-full md:w-[45%] lg:w-125 bg-white rounded-4xl shadow-2xl p-6 lg:p-10 items-center justify-center relative transform md:rotate-2 hover:rotate-0 transition-transform duration-500 mt-10 md:mt-0">
            <img src={banner} alt="Promotion Banner" className="w-full h-auto object-contain scale-105" data-testid="hero-image" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full pt-4">

        {/* Promotion Section */}
        <section id="promotion-section" className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32 ">
          {/* <ContentWrapper> */}
            <SectionHeader
              title="โปรโมชั่นสุดพิเศษ"
              subTitle="น้ำสมุนไพรเพื่อสุขภาพ รสชาติกลมกล่อม ดื่มง่าย"
              testId="promo"
            />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
  {groupedProduct.map((group) =>
    group.categoryName.toLowerCase() === "promotion" &&
    group.products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  )}
  </div>
          {/* </ContentWrapper> */}
        </section>

   
        {/* Soap Section */}
        <section id="soap-section" className="mb-20 max-w-360 mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
          {/* <ContentWrapper> */}
            <SectionHeader
              title="สบู่สมุนไพร"
              subTitle="ดูแลและบำรุงผิวพรรณด้วยคุณค่าจากธรรมชาติแท้ 100%"
              testId="soap"
            />
            
               
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
  {groupedProduct.map((group) =>
    group.categoryName.toLowerCase() === "soap" &&
    group.products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  )}
  </div>


    {/* Soap Section */}
        <section id="soap-section" className="mb-20 ">
          {/* <ContentWrapper> */}
            <SectionHeader
              title="เครื่องดื่ม"
              subTitle="ดูแลผิวผันให้สดใสจากธรรมชาติ"
              testId="soap"
            />
            
               
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
  {groupedProduct.map((group) =>
    group.categoryName.toLowerCase() === "drinks" &&
    group.products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  )}
  </div>
          {/* </ContentWrapper> */}
        </section>

  <section id="soap-section" className="mb-20 ">
          
            <SectionHeader
              title="แชมพูสมุนไพร"
              subTitle="ดูแลเส้นผมและหนังศีรษะด้วยธรรมชาติ"
              testId="soap"
            />
            
               
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-16">
  {groupedProduct.map((group) =>
    group.categoryName.toLowerCase() === "shampoo" &&
    group.products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  )}
  </div>
          {/* </ContentWrapper> */}
        </section>

       





          

 
            
            {/* เงื่อนไข: ถ้าไม่มีสินค้า ให้แสดงกรอบเส้นประ "ไม่พบรายการสินค้า" */}
            {groupedProduct.length === 0 ? (
              <div className="w-full min-h-100 border-2 border-dashed border-gray-200 rounded-4xl flex flex-col items-center justify-center p-10 bg-gray-50/30">
                {/* วงกลมรองหลัง Icon */}
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  {/* Icon กล่อง (ใช้ HiOutlineInbox หรือ Icon อื่นๆ ที่สื่อความหมาย) */}
                  <HiOutlineInbox className="text-4xl text-gray-300" />
                </div>
                {/* ข้อความ */}
                <h3 className="text-xl font-bold text-[#14261C]">
                  ไม่พบรายการสินค้า
                </h3>
                <p className="text-gray-400 mt-2 font-light">
                  ขออภัย ขณะนี้ยังไม่มีสินค้าในหมวดหมู่นี้
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 ml-0 md:-ml-2">
              
              </div>
            )}
         
        </section>
                
      </main>
    </div>
  );
}

export default HomePage;
