import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {jwtDecode } from  "jwt-decode";
import { Icon } from '@iconify/react';

import type { AppDispatch } from '../redux/store';
import { addToCartThunk } from '../redux/carts/CartReducer';

import { ProductService } from '../services/product.service';
import type { ProductDetail } from '../types/product';
import { TokenService } from '../services/token.service';

import Pagination from '../components/user/Pagination';

const catagoryTranslator: Record<string, string> ={
  Promotion: "โปรโมชัน",
  Soap: "สบู่",
  Drinks:"เครื่องดื่ม",
  Shampoo:"แชมพู"
}
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);


  const currentStock = productDetail?.quantity || 0;
  const token = TokenService.getAccessToken();
  const isLoggedIn = !!token;
  let currentUserId: number | null = null;
  const categoryName = location.state?.categoryName || "สินค้า";
  const totalPages = 10;
   const fixedTotalPages = 5;
  const REVIEWS_PER_PAGE = 3; 
  const allReviews = productDetail?.reviews || [];

  const calculatedTotalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);


  const indexOfLastReview = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;

  const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);


  if (token) {
  try {
    const decoded: any = jwtDecode(token);
    currentUserId = decoded.userId; 
  } catch (error) {
    console.error("ถอดรหัส Token ไม่ได้:", error);
  }
}
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductService.getProductById(Number(id));
          setProductDetail(data);

          if (data.productImages && data.productImages.length > 0) {
            setActiveImage(data.productImages[0].imageUrl);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  
    setBuyQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  const handleIncrease = () => { 
    const token = TokenService.getAccessToken();
    if(!token){
      navigate('/login')
      return;
    }
    if (buyQuantity < currentStock) {
      setBuyQuantity(prev => prev + 1); 
    } else {
      toast.error("จำนวนสินค้าในสต็อกไม่เพียงพอ");
    }
  };

  const handleDecrease = () => { 
    const token = TokenService.getAccessToken();
    if(!token){
      navigate('/login')
      return;
    }
    if (buyQuantity > 1) {
      setBuyQuantity(prev => prev - 1); 
    }
  };

  const handleAddToCart = async (shouldRedirect = false) => {
    const token = TokenService.getAccessToken();
    if(!token){
      toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
      navigate('/login')
      return;
    }
    if (!productDetail) return;

    if (currentStock <= 0) {
      toast.error("สินค้านี้ไม่พร้อมจำหน่าย");
      return;
    }

    if (buyQuantity > currentStock) {
      toast.error("จำนวนสินค้าในสต็อกไม่เพียงพอ");
      return;
    }

    const cartItemPayload = {
      ...productDetail,
      productId: productDetail.id,
      quantity: buyQuantity,
      imageUrl: activeImage
    };

    try {
      await dispatch(addToCartThunk(cartItemPayload as any)).unwrap();

      toast.success("เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว");
      
      setBuyQuantity(1); 

      if (shouldRedirect) {
        navigate('/cart');
      }
    } catch (error: any) {
      const backendMessage = error?.message || error?.data?.message;

      if (backendMessage === "There is insufficient stock.") {
        toast.error("จำนวนสินค้าในสต็อกไม่เพียงพอ");
      } else {
        toast.error(backendMessage || "ไม่สามารถเพิ่มสินค้าได้");
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('th-TH');
    } catch (e) {
      return dateString;
    }
  }

  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);

  const toggleMenu = (reviewId: number | string) => {
    setOpenMenuId(prev => prev === reviewId ? null : reviewId);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  if (!productDetail) return <div className="min-h-screen flex items-center justify-center">ไม่พบสินค้า</div>;

  return (
   <div id="product-detail-page" className="bg-white min-h-screen pb-20 pt-4 md:pt-10 font-sans text-gray-800">
      
     <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-2 md:pt-8">
        <nav className="flex flex-wrap items-center text-md text-black mb-4 md:mb-8 font-medium">
          <Link data-test="click-home" to="/" className="transition-colors">หน้าหลัก</Link>
          <Icon icon="material-symbols:chevron-right-rounded" className="w-5 h-5 mx-1 text-black" />
         <Link to="/products" className="transition-colors">
        {catagoryTranslator[categoryName]||categoryName}
      </Link>     
          <Icon icon="material-symbols:chevron-right-rounded" className="w-5 h-5 mx-1 text-black" />
          <span className="text-black">{productDetail.productName}</span>
        </nav>

        <div id="product-info-section" className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div id="product-image-container" className="flex flex-col items-center">
            <div className="w-full max-w-[450px] aspect-[4/5] flex items-center justify-center mb-4 bg-white">
              <img
                src={activeImage || 'https://via.placeholder.com/500'}
                alt={productDetail.productName}
                className="w-full h-full object-contain"
              />
            </div>
            <div id="product-thumbnails" className="flex gap-3 overflow-x-auto justify-center w-full">
              {productDetail.productImages?.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`w-20 h-24 cursor-pointer overflow-hidden transition-all opacity-80 hover:opacity-100 ${activeImage === img.imageUrl ? 'border-b-4 border-gray-800 opacity-100' : ''}`}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          <div id="product-details-container" className="flex flex-col mt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2221] mb-3 leading-tight">
              {productDetail.productName}
            </h1>
           <div className="flex text-[#FFEB55] text-xl mb-6 gap-0.5">
  {[...Array(5)].map((_, i) => (
    i < Math.round(productDetail.RatingScore || 0) 
       ? <Icon key={i} icon="material-symbols:star-rounded" className="w-5 h-5 text-[#FFEB55] stroke-black stroke-[1.4px]" /> 
      : <Icon key={i} icon="material-symbols:star-rounded" className="w-5 h-5 text-white stroke-black stroke-[1.5px]" />
  ))}
</div>

           <div className="w-full max-w-[489px] min-h-[69px] py-4 md:py-0 bg-[#F3F4F6] px-4 md:px-6 rounded-md flex flex-wrap justify-between items-center mb-8 gap-2">
              <span className="text-3xl font-bold text-black">ราคา</span>
              <span className="text-4xl font-semibold text-black">฿{productDetail.price.toLocaleString()}</span>
            </div>

            <div className="mb-8">
              <h3 className="font-medium mb-3 px-0.5 pt-0.2 text-3xl text-[#111827]">รายละเอียดสินค้า</h3>
              <div className="text-black text-md leading-relaxed whitespace-pre-line">
                {productDetail.description || "ไม่มีรายละเอียด"}
              </div>
            </div>

            <div id="product-actions" className="w-full max-w-[723px] mx-auto flex flex-col items-center gap-5 mt-auto border-t pt-6 text-[#D9D9D9]">
        
              <div className="flex items-center gap-4">
                  <span className="font-bold text-[#2C2221]">จำนวน</span>
                    <div className="flex items-center border border-gray-200 rounded-md h-9 w-28 bg-white ">
                      <button 
                        data-test="btn-decrease" 
                        onClick={handleDecrease} 
                        className="flex-1 h-full text-lg font-medium text-gray-500 hover:bg-gray-100 transition-colors" 
                      >
                        −
                      </button>
                      <div className="flex-1 text-center font-medium text-gray-800 border-x border-gray-200 h-full flex items-center justify-center text-sm">
                        {buyQuantity}
                      </div>
                      <button 
                        data-test="btn-increase" 
                        onClick={handleIncrease} 
                        className="flex-1 h-full text-lg font-medium text-gray-500 hover:bg-gray-100 transition-colors" 
                      >
                        +
                      </button>
                    </div>
              </div>

              <div className="flex gap-3">
                <button
                  data-test="btn-add-to-cart"
                  onClick={() => handleAddToCart(false)}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-sm font-semibold text-md transition-colors shadow-sm"
                >
                  เพิ่มลงตะกร้า
                </button>
                
                <button
                  data-test="btn-buy-cart"
                  onClick={() => handleAddToCart(true)}
                  className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-sm font-semibold text-md transition-colors shadow-sm"
                >
                  สั่งซื้อสินค้า
                </button>
              </div>

            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        {/* ส่วนรีวิว*/}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
           {currentReviews.length > 0 ? (
              currentReviews.map((review) => {
                
                return (
                <div key={review.id} className="border border-gray-400 p-5 rounded-lg bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-800 text-sm">{review.reviewer?.name || "ลูกค้าทั่วไป"}</p>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-sm">
  {[...Array(5)].map((_, i) => (
    i < review.reviewScore 
      ? <Icon key={i} icon="material-symbols:star-rounded" className="w-4 h-4 text-[#FFEB55] stroke-black stroke-[1.4px]" /> 
      : <Icon key={i} icon="material-symbols:star-rounded" className="w-4 h-4 text-white stroke-black stroke-[1.5px]" />
  ))}
</div>
                      
                     {isLoggedIn && currentUserId === review.reviewer?.id && (
                      <div className="relative">
                        <Icon 
  icon="mdi:dots-vertical" 
  width="24" 
  height="24"
  data-test="onclick-toggle-menu"
  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
  onClick={() => toggleMenu(review.id)}
/>

                        {openMenuId === review.id && (
                          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-100 rounded-md shadow-lg z-10 py-1 overflow-hidden">
                            <button 
                            data-test="edit-review"
                              onClick={() => {
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-500 transition-colors"
                            >
                              แก้ไข
                            </button>
                            <button 
                            data-test="delete-review"
                              onClick={() => {
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 transition-colors"
                            >
                              ลบ
                            </button>
                          </div>
                        )}
                      </div>
                      )}
                  </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.message}</p>
                </div>
              );

            })
            ) : (
              <div className="text-center py-10 text-gray-400 border border-dashed border-gray-300 rounded-xl">ยังไม่มีรีวิวสำหรับสินค้านี้</div>
            )}
          </div>

        
          <div className="flex justify-center items-center gap-5 mt-10">
           <Pagination 
        currentPage={currentPage} 
        totalPages={fixedTotalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
          </div>
        </div>

      </div>
  );
};

export default ProductDetailPage;