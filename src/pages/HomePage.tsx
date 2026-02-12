import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store"

function HomePage() {

  const products = useSelector((state:RootState) => state.product)
  return (
    <div className="w-full mt-6 flex flex-col items-center">

 
      <div className="carousel w-2/3 h-full">
        <div className="carousel-item relative w-full">
          <img
            src="https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-6/475814878_1153008693494064_4029239289864672932_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGBV730DK8906AMrEp2-PRifP9NtagBx0R8_021qAHHRE8Ee1AcZueGpR8eXLOC6JJunUiPRGXoKwofnyOzCFqn&_nc_ohc=tTKwayP65ZcQ7kNvwE5WkjA&_nc_oc=AdkLghdC_rI-kOJxC4rAzyBnHvntr4YNbypziCzqRe04bnSXuhx1H8Fu4WiFw30xH7ALYtN8XUqb_-deMUBJ6QNb&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=Enp-gqcadvRpGmEAOSWtJg&oh=00_Afu-me6QDroAuNMgkFHP7Z0Vl9b4JYH3QvWDQskIQ6EA3g&oe=699279CA"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
 <h2 className="text-3xl font-bold text-center text-black mb-10 mt-30">
    เครื่องดื่ม
  </h2>
     
      <div className="grid grid-cols-4  mt-10 w-full mx-auto justify-center">

        {products.map((product) => (
          <ProductCard key={product.id} product={product}
          />
        ))}
      </div>

    </div>
  );
}

export default HomePage;
