import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdStar, MdStarBorder } from "react-icons/md";

import type { RootState, AppDispatch } from '../redux/store'; 
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

  const productInStore = useSelector((state: RootState) => 
    state.products.items.find(p => Number(p.id) === Number(id))
  );
  
  const currentStock = productInStore ? productInStore.stockQuantity : (productDetail?.quantity || 0);


  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductService.getProductById(Number(id));
          setProductDetail(data);
          
          if(data.productImages && data.productImages.length > 0) {
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

  const handleIncrease = () => { if (buyQuantity < currentStock) setBuyQuantity(prev => prev + 1); };
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
    toast.error(error?.message || "ไม่สามารถเพิ่มสินค้าได้");
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
      
      <div className="flex items-center px-4 pt-24 max-w-5xl mx-auto">
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/")}>กลับหน้าหลัก</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10">
        <div id="product-info-section" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16">

          <div id="product-image-container" className="flex flex-col items-center">
            <div className="w-full max-w-[400px] aspect-[4/5] flex items-center justify-center mb-4 border rounded-xl overflow-hidden shadow-sm">
              <img
                src={activeImage || 'https://via.placeholder.com/500'}
                alt={productDetail.productName}
                className="w-full h-full object-contain"
              />
            </div>
            <div id="product-thumbnails" className="flex gap-2 overflow-x-auto justify-center w-full">
              {productDetail.productImages?.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`w-16 h-20 border-2 cursor-pointer rounded-md overflow-hidden transition-all ${activeImage === img.imageUrl ? 'border-blue-500' : 'border-gray-100'}`}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          <div id="product-details-container" className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{productDetail.productName}</h1>

            <div className="flex text-yellow-400 text-2xl mb-4 gap-0.5">
              {[...Array(5)].map((_, i) => (
                i < Math.round(productDetail.ratingScore || 0) ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-gray-300" />
              ))}
            </div>

            <div className="bg-gray-100 px-6 py-4 rounded-xl flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-600">ราคา</span>
              <span className="text-3xl font-bold text-black">฿ {productDetail.price.toLocaleString()}</span>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-2 text-gray-900">รายละเอียดสินค้า</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{productDetail.description || "ไม่มีรายละเอียด"}</p>
            </div>

            <div id="product-actions" className="flex flex-col gap-6 mt-auto">
              <div className="flex items-center gap-4">
                <span className="font-bold">จำนวน</span>
                <div className="flex items-center border rounded-lg overflow-hidden h-10 w-32">
                  <button data-test="btn-decrease" onClick={handleDecrease} className="flex-1 hover:bg-gray-100 disabled:opacity-30" disabled={buyQuantity <= 1}>−</button>
                  <div className="flex-1 text-center font-bold">{buyQuantity}</div>
                  <button data-test="btn-increase" onClick={handleIncrease} className="flex-1 hover:bg-gray-100 disabled:opacity-30" disabled={buyQuantity >= currentStock}>+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  data-test="btn-add-to-cart"
                  onClick={() => handleAddToCart(false)}
                  disabled={currentStock <= 0}
                  className="btn btn-primary text-white"
                >
                  เพิ่มลงตะกร้า
                </button>
                <button
                  data-test="btn-buy-cart"
                  onClick={() => handleAddToCart(true)}
                  disabled={currentStock <= 0}
                  className="btn btn-success text-white"
                >
                  สั่งซื้อทันที
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-12 border-gray-100" />

        <div className="space-y-4">
          {productDetail.reviews && productDetail.reviews.length > 0 ? (
            productDetail.reviews.map((review) => (
              <div key={review.id} className="border p-5 rounded-2xl bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm">{review.reviewer?.name || "ลูกค้าทั่วไป"}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">{formatDate(review.createdAt)}</p>
                  </div>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      i < review.reviewScore ? <MdStar key={i} /> : <MdStarBorder key={i} className="text-gray-200" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.message}</p>
              </div>
            ))
          ) : (ิ่น
            <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl">ยังไม่มีรีวิวสำหรับสินค้านี้</div>
          )}
        </div>

        {/* Pagination จำลอง */}
        <div className="flex justify-center items-center gap-2 mt-8 text-sm font-medium text-gray-600">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full transition-colors">1</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">4</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">5</button>
          <span className="px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">&gt;</button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;