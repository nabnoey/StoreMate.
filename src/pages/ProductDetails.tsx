import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Icons
import { MdStar, MdStarBorder, MdLocalShipping, MdReplay } from "react-icons/md";

// Redux & Actions
import type { RootState } from '../redux/store'; 
import { removeQuantity } from '../redux/products/productReducer';
import { addToCart } from '../redux/carts/CartReducer'; 

// Services & Types
import { ProductService } from '../services/product.service';
import type { ProductDetail, Product } from '../types/product'; 

// Components
import ProductCard from '../components/ProductCard'; 

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  // State
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>(""); 
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Redux Logic
  const productInStore = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === Number(id))
  );
  const currentStock = productInStore ? productInStore.stockQuantity : (productDetail?.quantity || 0);

  // Fetch Data
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
            // 1. ดึงข้อมูลสินค้าหลัก
            const data = await ProductService.getProductById(Number(id));
            setProductDetail(data);
            
            // ตั้งค่ารูปแรกเป็นรูป default
            if(data.productImages && data.productImages.length > 0) {
                setActiveImage(data.productImages[0].imageUrl);
            }

            // 2. ดึงสินค้าแนะนำ (เพิ่มการเช็ค Array เพื่อกัน Error)
            try {
                const allProducts = await ProductService.getAllCategories();
                
                // --- FIX: เช็คว่าเป็น Array หรือไม่ ก่อน filter ---
                if (Array.isArray(allProducts)) {
                  setRelatedProducts(
  allProducts
    .filter((p: Product) => p.id !== Number(id))
    .slice(0, 4)
);
                } else {
                    console.warn("API getAllProducts ไม่ได้คืนค่าเป็น Array:", allProducts);
                    setRelatedProducts([]); // ใส่ค่าว่างกัน App พัง
                }
            } catch (err) {
                console.error("Error fetching related products", err);
                setRelatedProducts([]);
            }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
    setBuyQuantity(1);
    window.scrollTo(0, 0); 
  }, [id]);

  // Handlers
  const handleIncrease = () => { if (buyQuantity < currentStock) setBuyQuantity(prev => prev + 1); };
  const handleDecrease = () => { if (buyQuantity > 1) setBuyQuantity(prev => prev - 1); };

  const handleAddToCart = () => {
  if (!productDetail) return;

  const productForCart: Product = {
    id: productDetail.id,
    productName: productDetail.productName,
    imageUrl: productDetail.productImages?.[0]?.imageUrl,
    categoryId: 0, // เพราะ ProductDetail ไม่มี field นี้
    
    price: productDetail.price,
    summary: "",   // Product บังคับให้มี
    stockQuantity: buyQuantity,
    status: currentStock > 0 ? "available" : "out"
  };

  for (let i = 0; i < buyQuantity; i++) {
    dispatch(addToCart(productForCart));
    dispatch(removeQuantity(productDetail.id));
  }

  setBuyQuantity(1);
  alert("เพิ่มลงตะกร้าเรียบร้อย!");
};

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!productDetail) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

   return (
    <div className="bg-white min-h-screen pb-20 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
        
        {/* --- ส่วนบน (Top Section) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* ฝั่งซ้าย: รูปภาพ */}
          <div>
            <div className="aspect-[4/5] w-full max-h-[500px] flex items-center justify-center mb-4 relative bg-gray-50 rounded-lg">
              <img 
                src={activeImage || 'https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/631033255_1486282403500023_4710477623864277946_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=LVsLjxBcDngQ7kNvwFmpYeP&_nc_oc=AdmHGAm1Ibg5tetmmBOuVUnoW_F2a1qp7KhZsXxMvcnSR7A5c33a3gZ1xUjWiQ_TpjoNQHOLqHy16moZpzcR1Kzo&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=byhROHe1c6lbVBOBQwjGhw&oh=00_AfvmSssPV69WDuHi2p-gcgpsU1WcdQhqEid0bw71o-2qmQ&oe=699E715D'} 
                alt={productDetail.productName}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productDetail.productImages?.map((img) => (
                <div 
                    key={img.id} 
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-16 h-20 flex-shrink-0 border rounded cursor-pointer transition-all overflow-hidden
                        ${activeImage === img.imageUrl ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}
                    `}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* ฝั่งขวา: รายละเอียด */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                {productDetail.productName}
            </h1>

            {/* ดาวรีวิว */}
            <div className="flex items-center gap-1 mb-6">
                <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                        i < Math.round(productDetail.ratingScore || 5) 
                        ? <MdStar key={i} /> 
                        : <MdStarBorder key={i} className="text-gray-300"/>
                    ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">({productDetail.reviews?.length || 0} รีวิว)</span>
            </div>

            {/* กล่องราคา */}
            <div className="bg-gray-100 px-6 py-5 rounded-lg flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-700">ราคา</span>
                <span className="text-3xl font-bold text-gray-900">
                    {Number(productDetail.price || 0).toLocaleString()}฿
                </span>
            </div>

            {/* ข้อมูลการจัดส่ง */}
            <div className="flex gap-10 mb-8 px-1">
                <div className="flex gap-3 items-start">
                    <MdLocalShipping className="text-xl text-gray-600 mt-1" />
                    <div className="text-sm">
                        <p className="font-bold text-gray-700">ส่งฟรี</p>
                        <p className="text-gray-500">ถึงใน 2-3 วัน</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start">
                    <MdReplay className="text-xl text-gray-600 mt-1" />
                    <div className="text-sm">
                        <p className="font-bold text-gray-700">คืนสินค้า</p>
                        <p className="text-gray-500">ภายใน 7 วัน</p>
                    </div>
                </div>
            </div>

            {/* ตัวเลือกจำนวน */}
            <div className="flex items-center gap-6 mb-8">
                <span className="font-bold text-gray-700">จำนวน</span>
                <div className="flex items-center border border-gray-200 rounded bg-white h-10 w-32">
                    <button 
                        onClick={handleDecrease}
                        className="flex-1 h-full hover:bg-gray-50 text-gray-500 text-lg"
                        disabled={buyQuantity <= 1}
                    >−</button>
                    <div className="flex-1 text-center font-bold text-gray-700">{buyQuantity}</div>
                    <button 
                        onClick={handleIncrease}
                        className="flex-1 h-full hover:bg-gray-50 text-gray-500 text-lg"
                        disabled={buyQuantity >= currentStock}
                    >+</button>
                </div>
                <span className="text-sm text-gray-500">มีสินค้า {currentStock} ชิ้น</span>
            </div>

            {/* ปุ่มกด */}
            <div className="flex gap-4">
                <button 
                    onClick={handleAddToCart}
                    disabled={currentStock <= 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md shadow-sm transition disabled:bg-gray-300"
                >
                    Add To Cart
                </button>
                <button 
                    disabled={currentStock <= 0}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-md shadow-sm transition disabled:bg-gray-300"
                >
                    Buy Now
                </button>
            </div>
          </div>
        </div>

        {/* --- ส่วนรายละเอียด --- */}
        <div className="bg-gray-50 p-8 rounded-lg mb-12 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">รายละเอียด</h3>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {productDetail.description || "-"}
            </div>
        </div>

        {/* --- ส่วนรีวิว --- */}
        <div className="mb-16">
            <h3 className="text-xl font-bold mb-6 text-gray-800">รีวิว ({productDetail.reviews?.length || 0})</h3>
            
            <div className="flex flex-col gap-6">
                {productDetail.reviews && productDetail.reviews.length > 0 ? (
                    productDetail.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 flex gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                                <img 
                                    src={review.reviewer?.imageUrl || "https://ui-avatars.com/api/?name=User"} 
                                    alt="user" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900">{review.reviewer?.name}</span>
                                </div>
                                <div className="flex text-yellow-400 text-xs mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        i < review.reviewScore ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-gray-300"/>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm">{review.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">ยังไม่มีรีวิว</p>
                )}
            </div>

            {/* Pagination */}
            {productDetail.reviews && productDetail.reviews.length > 0 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded text-sm">2</button>
                    <span className="flex items-end px-2 text-gray-400">...</span>
                </div>
            )}
        </div>

        {/* --- ส่วนคุณอาจสนใจ (Related Products) --- */}
        <div className="border-t pt-10">
            <h3 className="text-xl font-bold mb-8 text-gray-800">คุณอาจสนใจ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((product) => (
                        <div key={product.id} className="flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <p className="col-span-4 text-center text-gray-400">
                        {loading ? "กำลังโหลดสินค้าแนะนำ..." : "ไม่มีสินค้าแนะนำ"}
                    </p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;