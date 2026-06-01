import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Icon } from "@iconify/react";

import type { RootState, AppDispatch } from "../redux/store";
import { addToCartThunk } from "../redux/carts/CartReducer";

import { ProductService } from "../services/product.service";
import type { ProductDetail } from "../types/product";
import { TokenService } from "../services/token.service";

import Pagination from "../components/user/Pagination";
import Loading from "../components/loading/Loading";

import type { CartItemRequestDTO } from "../types/cartItem";

const catagoryTranslator: Record<string, string> = {
  Promotion: "โปรโมชัน",
  Soap: "สบู่",
  Drinks: "เครื่องดื่ม",
  Shampoo: "แชมพู",
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const currentStock = productDetail?.quantity || 0;
  const cartItems = useSelector((state: RootState) => state.carts.items);

  // แก้ไข และ ลบรีวิว
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editMessage, setEditMessage] = useState<string>("");

  // แสดงเพิ่มเติมของรายละเอียดสินค้า mobile
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // จำกัดสิทธิ์
  const token = TokenService.getAccessToken();
  const isLoggedIn = !!token;
  const categoryName = location.state?.categoryName || "สินค้า";

  // Pagination
  const REVIEWS_PER_PAGE = 3;
  const allReviews = productDetail?.reviews || [];
  const calculatedTotalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const indexOfLastReview = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;
  const currentReviews = allReviews.slice(
    indexOfFirstReview,
    indexOfLastReview,
  );

  type JwtPayload = {
    userId: number;
  };

  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.userId;
    } catch {
      return null;
    }
  }, [token]);

  //เช็คสินค้าในรถเข็น
  const itemInCart = useMemo(() => {
    return cartItems.find((items) => items.productId === Number(id));
  }, [cartItems, id]);

  const quantityInCart = itemInCart?.quantity || 0;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductService.getProductById(Number(id));
          if (!data) {
            toast.error("ไม่พบข้อมูลสินค้า", { id: "product-not-found" });
            setTimeout(() => {
              navigate("/");
            }, 1000);
            return;
          }

          setProductDetail(data);

          if (data.productImages && data.productImages.length > 0) {
            setActiveImage(data.productImages[0].imageUrl);
          }
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);

        toast.error("ไม่พบข้อมูลสินค้า", { id: "product-not-found" });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleIncrease = () => {
    if (buyQuantity < currentStock) {
      setBuyQuantity((prev) => prev + 1);
    } else {
      toast.error("จำนวนสินค้าในสต็อกไม่เพียงพอ");
    }
  };

  const handleDecrease = () => {
    if (buyQuantity > 1) {
      setBuyQuantity((prev) => prev - 1);
    }
  };

  //ไปที่หน้าตะน้าสินค้า
  const handleAddToCart = async (shouldRedirect = false) => {
    const token = TokenService.getAccessToken();
    if (isAddingToCart) return;

    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงรถเข็น");
      navigate("/login");
      return;
    }
    if (!productDetail) return;

    if (currentStock <= 0) {
      toast.error("สินค้านี้ไม่พร้อมจำหน่ายในขณะนี้");
      return;
    }

    const totalProposedQuantity = quantityInCart + buyQuantity;

    if (totalProposedQuantity > currentStock) {
      if (quantityInCart > 0) {
        toast.error(
          `ไม่สามารถเพิ่มจำนวนสินค้าได้ เนื่องจากคุณเพิ่มสินค้านี้ไว้ในรถเข็นเเล้ว ${quantityInCart} ชิ้น`,
        );
      } else {
        toast.error(
          `จำนวนสินค้าในสต็อกไม่เพียงพอ (คงเหลือ ${currentStock} ชิ้น)`,
        );
      }
      return;
    }

    setIsAddingToCart(true);

    const cartItemPayload: CartItemRequestDTO = {
      productId: productDetail.id,
      quantity: buyQuantity,
    };

    try {
      await dispatch(addToCartThunk(cartItemPayload)).unwrap();
      toast.success("เพิ่มสินค้าเข้ารถเข็นเรียบร้อยแล้ว");
      setBuyQuantity(1);

      if (shouldRedirect) {
        navigate("/shopping-cart");
      }
    } catch (error: unknown) {
      let backendMessage = "ไม่สามารถเพิ่มสินค้าได้";
      if (axios.isAxiosError(error)) {
        backendMessage = error.response?.data?.message || error.message;
      }
      if (backendMessage === "There is insufficient stock.") {
        toast.error("จำนวนสินค้าในสต็อกไม่เพียงพอ");
      } else {
        toast.error(backendMessage);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  //สั่งซื้อเลย
  const handleBuyNow = async () => {
    const token = TokenService.getAccessToken();

    if (!token) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      navigate("/login");
      return;
    }

    if (!productDetail) return;

    if (currentStock <= 0) {
      toast.error("สินค้านี้ไม่พร้อมจำหน่ายในขณะนี้");
      return;
    }

    if (buyQuantity > currentStock) {
      toast.error(
        `จำนวนสินค้าในสต็อกไม่เพียงพอ (คงเหลือ ${currentStock} ชิ้น)`,
      );
      return;
    }

    const checkoutData = {
      isBuyNow: true,
      items: [
        {
          productId: productDetail.id,
          cartItemId: null,
          quantity: buyQuantity,
          price: productDetail.price,
          totalPrice: productDetail.price * buyQuantity,

          productName: productDetail.productName,
          imageUrl: activeImage || productDetail.productImages?.[0]?.imageUrl,

          product: {
            id: productDetail.id,
            productName: productDetail.productName,
            price: productDetail.price,
            imageUrl: activeImage || productDetail.productImages?.[0]?.imageUrl,
          },
        },
      ],
      total: productDetail.price * buyQuantity,
    };

    navigate("/payment", { state: checkoutData });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("th-TH");
  };

  const toggleMenu = (reviewId: number | string) => {
    setOpenMenuId((prev) => (prev === reviewId ? null : reviewId));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <Loading />;
  if (!productDetail)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ไม่พบสินค้า
      </div>
    );

  return (
    <main className="w-full min-h-screen bg-white flex flex-col font-anuphan">
      <div
        id="product-detail-page"
        className="bg-white min-h-screen pb-20 pt-4 md:pt-5 text-gray-800"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-5 pt-5 md:pt-6">
          <nav className="hidden md:hidden lg:flex flex-wrap items-center text-md text-black mb-4 md:mb-8 font-medium">
            <Link
              data-test="click-home"
              to="/"
              className="transition-colors cursor-pointer"
            >
              หน้าหลัก
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <Link
              to={`/search?category=${categoryName}`}
              className="transition-colors cursor-pointer"
            >
              {catagoryTranslator[categoryName] || categoryName}
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <span className="text-black">{productDetail.productName}</span>
          </nav>

          <div className="lg:hidden w-full flex items-center bg-white px-4 pt-2 pb-1 top-0 z-30 -mt-2 md:-mt-0">
            <Icon
              icon="lucide:arrow-left"
              className="w-6 h-6 mr-3 text-black cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          <div
            id="product-info-section"
            className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 -mt-2 md:mt-0"
          >
            <div
              id="product-image-container"
              className="flex flex-col items-center"
            >
              <div className="w-[80%] md:w-full max-w-[320px] md:max-w-[450px] aspect-[4/5] flex items-center justify-center mb-4 bg-white">
                <img
                  src={
                    activeImage ||
                    productDetail.productImages?.[0]?.imageUrl ||
                    "https://via.placeholder.com/500"
                  }
                  alt={productDetail.productName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div
                id="product-thumbnails"
                className="flex gap-3 justify-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-full mx-auto overflow-x-auto px-2"
              >
                {productDetail.productImages?.map((img) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`relative w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 shrink-0 cursor-pointer overflow-hidden transition-all opacity-80 hover:opacity-100 ${
                      activeImage === img.imageUrl
                        ? "border-b-4 border-gray-800 opacity-100"
                        : ""
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      className="w-full h-full object-cover"
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div
              id="product-details-container"
              className="flex flex-col mt-4 md:mt-0 h-full w-full md:border md:border-gray-100 md:rounded-xl md:p-6 md:shadow-lg"
            >
              <h1 className="order-1 text-2xl md:text-3xl lg:text-4xl font-bold text-[#2C2221] mb-2 md:mb-3 leading-tight">
                {productDetail.productName}
              </h1>

              <div className="order-2 flex text-[#FFEB55] text-xl mb-4 md:mb-6 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFilled =
                    i < Math.round(productDetail.RatingScore || 0);
                  return (
                    <Icon
                      key={`star-${productDetail.id}-${i}`}
                      icon="material-symbols:star-rounded"
                      className={`w-5 h-5 md:w-6 md:h-6 stroke-black ${
                        isFilled
                          ? "text-[#FFEB55] stroke-[1.4px]"
                          : "text-white stroke-[1.5px]"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="order-3 w-full min-h-[69px] py-4 md:py-0 bg-[#F3F4F6] px-4 md:px-6 rounded-md flex flex-wrap justify-between items-center mb-6 md:mb-6 gap-2">
                <span className="text-xl md:text-3xl font-bold text-gray-700 md:text-black">
                  ราคา
                </span>
                <span className="text-3xl md:text-4xl font-semibold text-black">
                  ฿{productDetail.price.toLocaleString()}
                </span>
              </div>

              <div className="order-4 md:hidden flex flex-col gap-3 mb-6 px-2 text-[13px] text-gray-700">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:truck-outline"
                    className="w-5 h-5 text-black"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-[16px] text-[#2C2221]">
                      ส่งฟรี
                    </span>
                    <span className="text-[#5C6670] font-medium text-[16px] mt-0.5">
                      ถึงใน 2-3 วัน
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon icon="pajamas:redo" className="w-4 h-4 text-black" />
                  <div className="flex flex-col">
                    <span className="font-medium text-[16px] text-[#2C2221]">
                      คืนสินค้า
                    </span>
                    <span className="text-[#5C6670] font-medium text-[16px] mt-0.5">
                      ภายใน 7 วัน
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-6 md:order-4 bg-[#F3F4F6] md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none w-full mt-6 md:mt-0 mb-8 md:mb-6 text-left">
                <h3 className="font-medium mb-2 md:mb-3 text-[30px] md:text-[30px] text-[#111827]">
                  รายละเอียดสินค้า
                </h3>
                <div
                  className={`text-black text-[16px] md:text-base leading-relaxed whitespace-pre-line text-left transition-all duration-300 ${
                    !isDescriptionExpanded
                      ? "line-clamp-3 md:line-clamp-none"
                      : ""
                  }`}
                >
                  {productDetail.description || "ไม่มีรายละเอียด"}
                </div>

                {productDetail.description && (
                  <div className="md:hidden w-full flex justify-end mt-2">
                    <button
                      data-test="btn-description"
                      type="button"
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="text-[#4B5563] font-medium text-[12px]"
                    >
                      {isDescriptionExpanded ? "แสดงน้อยลง" : "แสดงเพิ่มเติม"}
                    </button>
                  </div>
                )}
              </div>

              <div
                id="product-actions"
                className="order-5 md:order-5 w-full md:max-w-[723px] mx-auto flex flex-col items-center md:items-start lg:items-center gap-5 pt-0 md:pt-4 mb-2 md:mb-2"
              >
                <div className="flex flex-col md:flex-row items-center gap-2 tablet:gap-6 md:gap-10 lg:gap-20 w-full md:w-auto">
                  <div className="flex items-center gap-4 justify-center w-full md:w-auto">
                    <span className="font-bold text-[#2C2221] text-[16px] md:text-base">
                      จำนวน
                    </span>
                    <div
                      data-test="buy-quantity"
                      className="flex items-center w-[120px] md:w-[130px] h-[36px] md:h-[40px] gap-[10px] p-[10px] border border-gray-200 rounded-md bg-white"
                    >
                      <button
                        type="button"
                        onClick={handleDecrease}
                        className="flex-1 h-full flex items-center justify-center cursor-pointer text-lg font-medium text-black transition-colors"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center font-medium text-gray-800 h-full flex items-center justify-center text-sm cursor-pointer">
                        {buyQuantity}
                      </div>
                      <button
                        type="button"
                        data-test="btn-increase"
                        onClick={handleIncrease}
                        className="flex-1 h-full flex items-center justify-center cursor-pointer text-lg font-medium text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-[16px] md:text-md text-black md:text-[#1F2937] text-center w-full md:w-auto mt-1 md:mt-0">
                    มีสินค้าทั้งหมด {currentStock} ชิ้น
                  </span>
                </div>

                <div
                  data-test="container-cart-actions"
                  className="flex flex-row justify-center md:justify-start gap-2 md:gap-3 w-full md:w-auto md:mr-auto md:pl-4 md:-ml-5 lg:ml-20"
                >
                  <button
                    type="button"
                    data-test="btn-add-to-cart"
                    onClick={() => handleAddToCart(false)}
                    className="w-[120px] h-[44px] flex items-center justify-center gap-[10px] p-[10px] cursor-pointer bg-[#3B82F6] hover:bg-blue-600 text-white rounded font-semibold text-[15px] transition-colors shadow-sm"
                  >
                    {isAddingToCart ? "กำลังเพิ่ม..." : "เพิ่มลงรถเข็น"}
                  </button>

                  <button
                    type="button"
                    data-test="btn-buy-cart"
                    onClick={handleBuyNow}
                    className="w-[120px] h-[44px] flex items-center justify-center gap-[10px] p-[10px] cursor-pointer bg-[#10B981] hover:bg-[#059669] text-white rounded font-semibold text-[15px] transition-colors shadow-sm"
                  >
                    {isAddingToCart ? "กำลังดำเนินการ..." : "สั่งซื้อสินค้า"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ส่วนรีวิว */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => {
                  return (
                    <div
                      key={review.id}
                      className="border border-gray-400 p-5 rounded-lg bg-white shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-gray-800 text-sm">
                            {review.reviewer?.name || "ลูกค้าทั่วไป"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-sm">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const isFilled = i < review.reviewScore;
                              return (
                                <Icon
                                  key={`review-${review.id}-star-${i}`}
                                  icon="material-symbols:star-rounded"
                                  className={`w-4 h-4 stroke-black ${
                                    isFilled
                                      ? "text-[#FFEB55] stroke-[1.4px]"
                                      : "text-white stroke-[1.5px]"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {isLoggedIn &&
                            currentUserId === review.reviewer?.id && (
                              <div className="relative">
                                <Icon
                                  icon="mdi:dots-vertical"
                                  width="24"
                                  height="24"
                                  data-test="onclick-toggle-menu"
                                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                                  onClick={() => toggleMenu(review.id)}
                                />

                                {openMenuId === review.id && (
                                  <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-100 rounded-md shadow-lg z-10 py-1 overflow-hidden">
                                    <button
                                      type="button"
                                      data-test="edit-review"
                                      onClick={() => setOpenMenuId(null)}
                                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-50 transition-colors"
                                    >
                                      แก้ไข
                                    </button>
                                    <button
                                      type="button"
                                      data-test="delete-review"
                                      onClick={() => setOpenMenuId(null)}
                                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                                    >
                                      ลบ
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        {review.message}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-400 border border-dashed border-gray-300 rounded-xl">
                  ยังไม่มีรีวิวสำหรับสินค้านี้
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-5 mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={calculatedTotalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
