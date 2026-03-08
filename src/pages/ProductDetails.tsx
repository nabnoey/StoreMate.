import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdStar, MdStarBorder, MdMoreVert } from "react-icons/md";

import type { AppDispatch } from '../redux/store';
import { addToCartThunk } from '../redux/carts/CartReducer';

import { ProductService } from '../services/product.service';
import type { ProductDetail } from '../types/product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [buyQuantity, setBuyQuantity] = useState(1);

  const currentStock = productDetail?.quantity || 0;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductService.getProductById(Number(id));
          setProductDetail(data);
          console.log("ข้อมูลสินค้าที่ได้จาก API:", data);

          if (data.productImages && data.productImages.length > 0) {
            setActiveImage(data.productImages[0].imageUrl);
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

  const handleIncrease = () => { setBuyQuantity(prev => prev + 1); };
  const handleDecrease = () => { if (buyQuantity > 1) setBuyQuantity(prev => prev - 1); };

  const handleAddToCart = async (shouldRedirect = false) => {
    if (!productDetail) return;

    const cartItemPayload = {
      ...productDetail,
      productId: productDetail.id,
      quantity: buyQuantity,
      imageUrl: activeImage
    };

    try {
      await dispatch(addToCartThunk(cartItemPayload as any)).unwrap();

      toast.success("เพิ่มลงตะกร้าเรียบร้อย!");
      setBuyQuantity(1);

      if (shouldRedirect) {
        navigate('/cart');
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);

      const backendMessage = error?.message || error?.data?.message;

      if (backendMessage === "There is insufficient stock.") {
        toast.error("ขออภัย สินค้าในสต็อกไม่เพียงพอ");
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  if (!productDetail) return <div className="min-h-screen flex items-center justify-center">ไม่พบสินค้า</div>;

  return (
    <div id="product-detail-page" className="bg-white min-h-screen pb-20 font-sans text-gray-800">
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
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
                i < Math.round(productDetail.RatingScore || 0) ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-black" />
              ))}
            </div>

           <div className="w-full max-w-[489px] h-[69px] bg-[#F3F4F6] px-6 rounded-md flex justify-between items-center mb-8">
              <span className="text-3xl font-bold text-black">ราคา</span>
              <span className="text-4xl font-semibold text-black">฿{productDetail.price.toLocaleString()}</span>
            </div>

            {/* รายละเอียดสินค้า */}
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
        className="flex-1 h-full text-lg font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors" 
        disabled={buyQuantity <= 1}
      >
        −
      </button>
      <div className="flex-1 text-center font-medium text-gray-800 border-x border-gray-200 h-full flex items-center justify-center text-sm">
        {buyQuantity}
      </div>
      <button 
        data-test="btn-increase" 
        onClick={handleIncrease} 
        className="flex-1 h-full text-lg font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors" 
        disabled={buyQuantity >= 10}
      >
        +
      </button>
    </div>
  </div>

  {/* ปุ่มกดสองปุ่ม */}
  <div className="flex gap-3">
    <button
      data-test="btn-add-to-cart"
      onClick={() => handleAddToCart(false)}
      className="px-6 py-2.5 bg-blue-500 text-white rounded-sm font-semibold text-md transition-colors shadow-sm"
    >
      เพิ่มลงตะกร้า
    </button>
    
    <button
      data-test="btn-buy-cart"
      onClick={() => handleAddToCart(true)}
      disabled={currentStock <= 0}
      className="px-6 py-2.5 bg-green-500 text-white rounded-sm font-semibold text-md transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      สั่งซื้อสินค้า
    </button>
  </div>

</div>
          </div>
        </div>

        {/* เส้นคั่นส่วนรีวิว */}
        <hr className="my-10 border-gray-200" />

        {/* ส่วนรีวิว (ล่าง) */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {productDetail.reviews && productDetail.reviews.length > 0 ? (
              productDetail.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 p-5 rounded-lg bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-800 text-sm">{review.reviewer?.name || "ลูกค้าทั่วไป"}</p>
                      <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          i < review.reviewScore ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-gray-300" />
                        ))}
                      </div>
                      <MdMoreVert className="text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 border border-dashed border-gray-300 rounded-xl">ยังไม่มีรีวิวสำหรับสินค้านี้</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-1 mt-8 text-sm font-medium text-gray-600">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center text-blue-600 font-bold transition-colors">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">4</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">5</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;