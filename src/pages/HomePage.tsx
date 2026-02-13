
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

function HomePage() {
  // ดึงแค่ข้อมูลสินค้าพอ ไม่ต้องเช็ค isHome แล้ว
  const products = useSelector((state: RootState) => state.products || []);


  return (
    <div className="w-full mt-6 flex flex-col ">
      {/* Carousel */}
      <div className="carousel w-2/3 h-full">
        <div className="carousel-item relative w-full">
          <img
            src="https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-6/475814878_1153008693494064_4029239289864672932_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGBV730DK8906AMrEp2-PRifP9NtagBx0R8_021qAHHRE8Ee1AcZueGpR8eXLOC6JJunUiPRGXoKwofnyOzCFqn&_nc_ohc=tTKwayP65ZcQ7kNvwE5WkjA&_nc_oc=AdkLghdC_rI-kOJxC4rAzyBnHvntr4YNbypziCzqRe04bnSXuhx1H8Fu4WiFw30xH7ALYtN8XUqb_-deMUBJ6QNb&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=Enp-gqcadvRpGmEAOSWtJg&oh=00_Afu-me6QDroAuNMgkFHP7Z0Vl9b4JYH3QvWDQskIQ6EA3g&oe=699279CA"
            className="w-full h-full object-contain"
            alt="Promotion"
          />
        </div>
      </div>

    <h2 className="text-[30px] mx-30 font-bold  text-left text-black mb-10 mt-30">
  โปรโมชั่น
   <p className="text-[14px] text-[#5C6B5F] font-light">น้ำสมุนไพรเพื่อสุขภาพ รสชาติกลมกล่อม</p>
</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1 w-full  px-28 justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>


    <h2 className="text-[30px] mx-30 font-bold  text-left text-black mb-10 mt-30">
  สบู่
   <p className="text-[14px] text-[#5C6B5F] font-light">ดูแลเส้นผมและหนังศีรษะด้วยธรรมชาติ</p>
</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1 w-full  px-28 justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>


    <h2 className="text-[30px] mx-30 font-bold  text-left text-black mb-10 mt-30">
 เครื่องดื่ม
   <p className="text-[14px] text-[#5C6B5F] font-light">ดูแลผิวผันให้สดใสจากธรรมชาติ</p>
</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1 w-full  px-28 justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    <h2 className="text-[30px] mx-30 font-bold  text-left text-black mb-10 mt-30">
 แชมพูสมุนไพร
   <p className="text-[14px] text-[#5C6B5F] font-light">ดูแลเส้นผมและหนังศีรษะด้วยธรรมชาติ</p>
</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1 w-full  px-28 justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}

export default HomePage;