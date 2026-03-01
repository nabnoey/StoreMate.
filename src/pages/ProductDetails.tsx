import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// Icons
import { MdStar, MdStarBorder, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Redux & Actions
import type { RootState } from '../redux/store'; 
import { removeQuantity } from '../redux/products/productReducer';
import { addToCart } from '../redux/carts/CartReducer'; 

// Services & Types (ดึง Type ของคุณมาใช้)
import { ProductService } from '../services/product.service';
import type { ProductDetail, Product, Review } from '../types/product'; 

// Components

import ProductCard from "../components/user/ProductCard"; 


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

  // เช็คสต๊อกคงเหลือ
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

            // 2. ดึงสินค้าแนะนำ
            try {
                // สมมติว่าคืนค่าเป็น Product[] ตาม Type ใหม่
                const allProducts = await ProductService.getAllCategories(); 
                
                if (Array.isArray(allProducts)) {
                  setRelatedProducts(

  allProducts
    .filter((p: Product) => p.id !== Number(id))
    .slice(0, 4)
);
                } else {
                    setRelatedProducts([]); 
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

    // --- แก้ไขให้ตรงกับ Type Product ล่าสุด ---
    const productForCart: Product = {
      id: productDetail.id,
      productName: productDetail.productName,
      imageUrl: productDetail.productImages?.[0]?.imageUrl || null,
      categoryName: "", // ProductDetail ไม่มีฟิลด์นี้มาให้
      price: productDetail.price,
      summary: productDetail.description?.substring(0, 50) || "", // ดึง description มาย่อใส่ summary
      status: currentStock > 0 ? "available" : "out",
      stockQuantity: buyQuantity
    };

    for (let i = 0; i < buyQuantity; i++) {
      dispatch(addToCart(productForCart));
      dispatch(removeQuantity(productDetail.id));
    }

    setBuyQuantity(1);
    return toast.success("เพิ่มลงตะกร้าเรียบร้อย!");
  };

  for (let i = 0; i < buyQuantity; i++) {
    dispatch(addToCart(productForCart));
    dispatch(removeQuantity(productDetail.id));
  }

  setBuyQuantity(1);
  return toast.success("เพิ่มลงตะกร้าเรียบร้อย!");
};

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!productDetail) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
        
        {/* --- ส่วนบน (Top Section) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          {/* ฝั่งซ้าย: รูปภาพ */}
          <div>
            <div className="aspect-[4/5] w-full max-h-[600px] flex items-center justify-center mb-4 relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
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
                    className={`w-20 h-24 flex-shrink-0 border cursor-pointer transition-all overflow-hidden rounded
                        ${activeImage === img.imageUrl ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-200 hover:border-gray-400'}
                    `}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt={img.imageName || "thumb"} />
                </div>
              ))}
            </div>
          </div>

          {/* ฝั่งขวา: รายละเอียด */}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 leading-normal">
                {productDetail.productName}
            </h1>

            {/* ดาวรีวิว */}
            <div className="flex items-center gap-1 mb-4">
                <div className="flex text-gray-800 text-sm">
                    {[...Array(5)].map((_, i) => (
                        i < Math.round(productDetail.ratingScore || 0) 
                        ? <MdStar key={i} /> 
                        : <MdStarBorder key={i} />
                    ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">({productDetail.reviews?.length} รีวิว)</span>
            </div>

            {/* กล่องราคา */}

            <div className="bg-gray-100 px-6 py-4 rounded flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-800">ราคา</span>
                <span className="text-2xl font-bold text-gray-900">
                    ฿ {Number(productDetail.price).toLocaleString()}
                </span>
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-3 text-gray-800">รายละเอียดสินค้า</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {productDetail.description || "-"}
                </div>
            </div>

            {/* ตัวเลือกจำนวน และ ปุ่มสั่งซื้อ */}
            <div className="flex flex-col items-end gap-4 mt-auto">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">จำนวน</span>
                    <div className="flex items-center border border-gray-300 rounded bg-white h-9 w-28">
                        <button 
                            onClick={handleDecrease}
                            className="flex-1 h-full hover:bg-gray-50 text-gray-600 text-lg"
                            disabled={buyQuantity <= 1}
                        >−</button>
                        <div className="flex-1 text-center font-medium text-gray-800">{buyQuantity}</div>
                        <button 
                            onClick={handleIncrease}
                            className="flex-1 h-full hover:bg-gray-50 text-gray-600 text-lg"
                            disabled={buyQuantity >= currentStock}
                        >+</button>
                    </div>
                </div>
                <span className="text-xs text-gray-500 w-full text-right">มีสินค้า {currentStock} ชิ้น</span>


                {/* ปุ่มกด */}
                <div className="flex gap-2 w-full md:w-auto mt-2 flex-col md:flex-row">
                    <button 
                        onClick={handleAddToCart}
                        disabled={currentStock <= 0}
                        className="w-full md:w-36 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded shadow-sm transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        เพิ่มลงตะกร้า
                    </button>
                    <button 
                        disabled={currentStock <= 0}
                        className="w-full md:w-36 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded shadow-sm transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        สั่งซื้อสินค้า
                    </button>
                </div>

            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        {/* --- ส่วนรีวิว --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            
            {/* ฝั่งซ้าย: ฟอร์มเขียนรีวิว */}
            <div className="md:col-span-4 lg:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-600 text-xl">💬</span>
                    <h3 className="font-bold text-gray-800">รีวิวสินค้า</h3>
                </div>
                
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-4">เขียนรีวิว</h4>
                    <p className="text-sm text-gray-600 mb-2">คะแนนความพึงพอใจ</p>
                    <div className="flex text-gray-800 mb-4 cursor-pointer">
                        <MdStarBorder className="text-xl hover:text-yellow-400" />
                        <MdStarBorder className="text-xl hover:text-yellow-400" />
                        <MdStarBorder className="text-xl hover:text-yellow-400" />
                        <MdStarBorder className="text-xl hover:text-yellow-400" />
                        <MdStarBorder className="text-xl hover:text-yellow-400" />
                    </div>
                    
                    <textarea 
                        className="w-full h-24 p-3 border border-gray-300 rounded resize-none text-sm focus:outline-none focus:border-gray-500 mb-4"
                        placeholder="รีวิวสินค้า..."
                    ></textarea>
                    
                    <div className="flex justify-end">
                        <button className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
                            รีวิว
                        </button>
                    </div>
                </div>
            </div>

            {/* ฝั่งขวา: รายการรีวิว */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-4">
                {productDetail.reviews && productDetail.reviews.length > 0 ? (
                    productDetail.reviews.map((review: Review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-5 flex flex-col bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    {/* แสดงรูปโปรไฟล์ของคนรีวิว (ถ้ามี) */}
                                    {review.reviewer?.imageUrl && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                            <img src={review.reviewer.imageUrl} alt="reviewer" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{review.reviewer?.name || "ผู้ไม่ประสงค์ออกนาม"}</p>
                                        {/* แก้ไขเป็น review.createdAt ตาม Type ใหม่ */}
                                        <p className="text-gray-400 text-xs mt-1">{review.createdAt || "ไม่ระบุวันที่"}</p>
                                    </div>
                                </div>
                                <div className="flex text-gray-800 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        i < (review.reviewScore || 5) ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-gray-300"/>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm mt-2">{review.message}</p>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[150px] border border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm">
                        ยังไม่มีรีวิวสำหรับสินค้านี้
                    </div>
                )}

                {/* Pagination (แสดงเฉพาะเมื่อมีรีวิว) */}
                {productDetail.reviews && productDetail.reviews.length > 0 && (
                    <div className="flex justify-center items-center mt-6 gap-2 text-sm font-medium text-gray-600">
                        <button className="p-1 hover:text-blue-500"><MdKeyboardArrowLeft className="text-lg" /></button>
                        <button className="w-8 h-8 flex items-center justify-center text-blue-500">1</button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded">2</button>
                        <span className="px-1 text-gray-400">...</span>
                        <button className="p-1 hover:text-blue-500"><MdKeyboardArrowRight className="text-lg" /></button>
                    </div>
                )}
            </div>
        </div>

        {/* --- ส่วนคุณอาจสนใจ (Related Products) --- */}
        <div className="border-t border-gray-200 pt-10">
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