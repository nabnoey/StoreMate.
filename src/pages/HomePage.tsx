
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import banner from "../assets/banner.png";


function HomePage() {
  // ดึงแค่ข้อมูลสินค้าพอ ไม่ต้องเช็ค isHome แล้ว
  const products = useSelector((state: RootState) => state.products.items || []);
 

  
  //ดึงคำค้นหา
const keyword = useSelector((state:RootState)=>state.products.search)

  //filter สินค้า
  const filteredProducts = products.filter((item)=>
  item.title.toLowerCase().includes(keyword.toLowerCase()))

    if(keyword){
    return(
      <div className="w-full mt-10 px-28">
        
        <h2 className="text-3xl font-bold mb-6 text-black">
          ผลการค้นหา: "{keyword}"
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product)=>(
              <ProductCard key={product.id} product={product}/>
            ))
          ):(
            <p className="text-gray-500">ไม่พบสินค้า</p>
          )}
        </div>

      </div>
    )
  }


  return (
    <div className="w-full mt-6  ">
      {/* Carousel */}
      <div className="carousel w-full mt-6 ">
  <div className="carousel-item w-full ">

    <img
      src={banner}
      alt="promotion"
      className="w-full h-130 object-cover rounded-2xl"
    />

       <div className="absolute top-62 mx-10 left-20 text-white ">
        {/* <p className="text-sm bg-yellow-500 text-black px-3 py-1 rounded-full w-fit mb-3">
          OTOP ราชบุรี 
        </p> */}

        <h1 className="text-5xl font-bold leading-tight">
          สมุนไพร <br />
          <span className="text-yellow-400">
            มะม่วงหาวมะนาวโห่
          </span><br/>
          ตรา พัดทอง
        </h1>

           <p className="mt-4 text-gray-200 max-w-md">
          คัดสรรวัตถุดิบคุณภาพจากธรรมชาติ
          เพื่อสุขภาพที่ดีของคุณ ด้วยกรรมวิธีสะอาด ปลอดภัย
        </p>

        <div className="flex gap-4 mt-6">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold">
            ดูสินค้าทั้งหมด
          </button>

 <button className="border border-white text-white px-6 py-3 rounded-full">
            เกี่ยวกับเรา
          </button>
        </div>
      </div>
   
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
