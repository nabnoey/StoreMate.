import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdStar, MdStarBorder, MdOutlineChatBubbleOutline } from "react-icons/md";

// Redux & Actions
import type { RootState } from '../redux/store'; 
import { removeQuantity } from '../redux/products/productReducer';
import { addToCart } from '../redux/carts/CartReducer'; 
import { submitProductReview } from '../redux/reviews/reviewsReducer';

// Services & Types
import { ProductService } from '../services/product.service';
import type { ProductDetail, Product } from '../types/product'; 

// Components
import ProductCard from "../components/user/ProductCard"; 

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>(); 
  
  // State
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>(""); 
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // State สำหรับฟอร์มรีวิว
  const [reviewScore, setReviewScore] = useState<number>(5);
  const [reviewMessage, setReviewMessage] = useState<string>("");
  const isSubmittingReview = useSelector((state: RootState) => state.reviews?.isLoading || false);

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
            const data = await ProductService.getProductById(Number(id));
            setProductDetail(data);
            
            if(data.productImages && data.productImages.length > 0) {
                setActiveImage(data.productImages[0].imageUrl);
            }

            try {
                const allProducts = await ProductService.getAllCategories();
                if (Array.isArray(allProducts)) {
                  setRelatedProducts(allProducts.filter((p: Product) => p.id !== Number(id)).slice(0, 4));
                }
            } catch (err) {
                console.error("Error fetching related products", err);
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
      categoryId: 0, 
      quantity: productDetail.quantity,
      price: productDetail.price,
      summary: "", 
      stockQuantity: buyQuantity,
      status: currentStock > 0 ? "available" : "out"
    };

    for (let i = 0; i < buyQuantity; i++) {
      dispatch(addToCart(productForCart));
      dispatch(removeQuantity(productDetail.id));
    }
    setBuyQuantity(1);
    return toast.success("เพิ่มลงตะกร้าเรียบร้อย!");
  };

  const handleSubmitReview = async () => {
    if (!reviewMessage.trim()) {
      return toast.error("กรุณากรอกข้อความรีวิวก่อนส่งครับ");
    }
    try {
      await dispatch(submitProductReview({ 
        id: Number(id), payload: { reviewScore, message: reviewMessage } 
      })).unwrap();

      toast.success("ขอบคุณสำหรับรีวิวครับ!");
      setReviewMessage("");
      setReviewScore(5);

      const updatedData = await ProductService.getProductById(Number(id));
      setProductDetail(updatedData);
    } catch (error) {
      toast.error("ไม่สามารถส่งรีวิวได้ในขณะนี้");
    }
  };

  // ฟังก์ชันแปลงวันที่ให้เป็น YYYY-MM-DD
  const formatDate = (dateString?: string) => {
      if (!dateString) return ""; 
      try {
          return new Date(dateString).toISOString().split('T')[0];
      } catch (e) {
          return dateString;
      }
  }

  if (loading) return <div id="loading-spinner" className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!productDetail) return <div id="error-not-found" className="min-h-screen flex items-center justify-center">Product not found</div>;

   return (
    <div id="product-detail-page" className="bg-white min-h-screen pb-20 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10">
        
        {/* ================= ส่วนบน: รูปภาพ & รายละเอียด ================= */}
        {/* Responsive: ใช้ grid คอลัมน์เดียวในมือถือ และ 2 คอลัมน์ในจอขนาดกลางขึ้นไป (md:grid-cols-2) */}
        <div id="product-info-section" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16">
          
          {/* ฝั่งซ้าย: รูปภาพ */}
          <div id="product-image-container" className="flex flex-col items-center">
            <div className="w-full max-w-[400px] aspect-[4/5] flex items-center justify-center mb-4 relative">
              <img 
                id="product-main-image"
                src={activeImage || 'https://via.placeholder.com/500'} 
                alt={productDetail.productName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            {/* Thumbnails */}
            <div id="product-thumbnails" className="flex gap-2 overflow-x-auto pb-2 max-w-[400px] w-full justify-center md:justify-start">
              {productDetail.productImages?.map((img, index) => (
                <div 
                    id={`product-thumb-${index}`}
                    key={img.id} 
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border cursor-pointer transition-all overflow-hidden rounded-md
                        ${activeImage === img.imageUrl ? 'border-gray-300 ring-1 ring-gray-400' : 'border-gray-200'}
                    `}
                >
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt={`thumb-${index}`} />
                </div>
              ))}
            </div>
          </div>

          {/* ฝั่งขวา: รายละเอียด */}
          <div id="product-details-container" className="flex flex-col pt-4">
            <h1 id="product-name" className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight text-center md:text-left">
                {productDetail.productName}
            </h1>

            {/* ดาว (แบบโปร่ง) */}
            <div id="product-rating" className="flex text-gray-700 text-sm mb-4 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                    i < Math.round(productDetail.ratingScore || 5) 
                    ? <MdStar key={i} id={`star-filled-${i}`} className="text-gray-800 text-lg" /> 
                    : <MdStarBorder key={i} id={`star-empty-${i}`} className="text-gray-400 text-lg"/>
                ))}
            </div>

            {/* กล่องราคา */}
            <div id="product-price-box" className="bg-[#e5e7eb] px-6 py-4 rounded-md flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-800">ราคา</span>
                <span id="product-price" className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
                    ฿ {Number(productDetail.price).toLocaleString()}
                </span>
            </div>

            {/* รายละเอียดสินค้า */}
            <div id="product-description-box" className="mb-8">
                <h3 className="text-lg font-bold mb-3 text-gray-800">รายละเอียดสินค้า</h3>
                <div id="product-description" className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {productDetail.description || "-"}
                </div>
            </div>

           {/* ส่วนเลือกจำนวน และ ปุ่มกด */}
          <div id="product-actions" className="flex flex-col items-center gap-4 mt-8 pt-4">
                {/* จำนวน */}
                <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">จำนวน</span>
                    <div className="flex items-center border border-gray-300 rounded-md bg-white h-10 w-32 overflow-hidden">
                        <button 
                            id="btn-decrease-qty"
                            onClick={handleDecrease} 
                            disabled={buyQuantity <= 1} 
                            className="flex-1 h-full hover:bg-gray-100 text-gray-600 text-lg transition-colors"
                        >−</button>
                        <div id="input-qty" className="flex-1 text-center text-sm font-medium">{buyQuantity}</div>
                        <button 
                            id="btn-increase-qty"
                            onClick={handleIncrease} 
                            disabled={buyQuantity >= currentStock} 
                            className="flex-1 h-full hover:bg-gray-100 text-gray-600 text-lg transition-colors"
                        >+</button>
                    </div>
                </div>

                {/* ปุ่ม */}
                <div className="flex gap-3 w-full md:w-auto justify-center">
                    <button 
                        id="btn-add-to-cart"
                        onClick={handleAddToCart} 
                        disabled={currentStock <= 0}
                        className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition disabled:bg-gray-300 text-sm w-full md:w-auto"
                    >
                        เพิ่มลงตะกร้า
                    </button>
                    <button 
                        id="btn-buy-now"
                        disabled={currentStock <= 0}
                        className="bg-[#10b981] hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition disabled:bg-gray-300 text-sm w-full md:w-auto"
                    >
                        สั่งซื้อสินค้า
                    </button>
                </div>
            </div>
            
          </div>
        </div>

        <hr className="my-10 border-gray-200" />

        {/* ================= ส่วนรีวิว (แบ่ง 2 คอลัมน์) ================= */}
        {/* Responsive: 1 คอลัมน์บนมือถือ, 2 คอลัมน์ (1:2) บนจอ md ขึ้นไป */}
        <div id="review-section" className="mb-16">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-800">
                <MdOutlineChatBubbleOutline className="text-2xl" /> รีวิวสินค้า
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                
                {/* ฝั่งซ้าย: ฟอร์มเขียนรีวิว */}
                <div id="review-form-container">
                    <div className="bg-[#f3f4f6] p-6 rounded-xl border border-gray-100">
                        <h4 className="text-base font-bold mb-4 text-gray-800">เขียนรีวิว</h4>
                        
                        <p className="text-sm text-gray-600 mb-2">คะแนนความพึงพอใจ</p>
                        <div id="review-rating-input" className="flex text-gray-800 text-xl cursor-pointer mb-4 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} id={`select-star-${star}`} onClick={() => setReviewScore(star)}>
                                    {star <= reviewScore ? <MdStar /> : <MdStarBorder className="text-gray-400" />}
                                </div>
                            ))}
                        </div>

                        <textarea
                            id="input-review-message"
                            value={reviewMessage}
                            onChange={(e) => setReviewMessage(e.target.value)}
                            placeholder="รีวิวสินค้า..."
                            className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-1 focus:ring-black focus:outline-none text-sm bg-transparent"
                            rows={4}
                        />

                        <div className="flex justify-end">
                            <button
                                id="btn-submit-review"
                                onClick={handleSubmitReview}
                                disabled={isSubmittingReview}
                                className="bg-black text-white text-sm font-medium py-2 px-8 rounded-md transition disabled:bg-gray-400 w-full md:w-auto"
                            >
                                {isSubmittingReview ? "กำลังส่ง..." : "รีวิว"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา: รายการรีวิว */}
                <div id="review-list-container" className="flex flex-col gap-4">
                    {productDetail.reviews && productDetail.reviews.length > 0 ? (
                        productDetail.reviews.map((review, index) => (
                            <div key={review.id} id={`review-item-${index}`} className="border border-gray-300 rounded-xl p-5 bg-white">
                                <div className="flex justify-between items-start mb-3">
                                    {/* ชื่อและวันที่ */}
                                    <div>
                                        <p id={`review-reviewer-name-${index}`} className="font-bold text-gray-800 text-sm mb-1">
                                            {review.reviewer?.name || "Anonymous User"}
                                        </p>
                                        <p id={`review-date-${index}`} className="text-xs text-gray-400 font-mono">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                    
                                    {/* ดาวรีวิวในกล่องขวา */}
                                    <div id={`review-score-${index}`} className="flex text-gray-800 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            i < review.reviewScore 
                                            ? <MdStar key={i} /> 
                                            : <MdStarBorder key={i} className="text-gray-300"/>
                                        ))}
                                    </div>
                                </div>
                                {/* ข้อความรีวิว */}
                                <p id={`review-message-${index}`} className="text-gray-600 text-sm mt-2">{review.message}</p>
                            </div>
                        ))
                    ) : (
                        <div id="empty-review-state" className="border border-gray-200 rounded-xl p-8 flex justify-center items-center bg-gray-50">
                            <p className="text-gray-400 italic">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {productDetail.reviews && productDetail.reviews.length > 0 && (
                        <div id="review-pagination" className="flex justify-center mt-6 gap-3 text-sm font-medium text-gray-600">
                            <button id="btn-page-prev" className="px-2 hover:text-black">{'<'}</button>
                            <button id="btn-page-1" className="text-blue-500 font-bold px-1">1</button>
                            <button id="btn-page-2" className="hover:text-black px-1">2</button>
                            <span className="tracking-widest">...</span>
                            <button id="btn-page-next" className="px-2 hover:text-black">{'>'}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* ================= ส่วนคุณอาจสนใจ ================= */}
        {/* Responsive: มือถือ 1 คอลัมน์ (สมาร์ตโฟนเล็ก) -> 2 คอลัมน์ (sm) -> 4 คอลัมน์ (md) */}
        {relatedProducts.length > 0 && (
            <div id="related-products-section" className="border-t pt-10">
                <h3 className="text-xl font-bold mb-8 text-gray-800 text-center md:text-left">คุณอาจสนใจ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((product, index) => (
                        <div key={product.id} id={`related-product-${index}`} className="flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;