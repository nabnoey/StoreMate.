import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// 1. เพิ่มการ Import loadStripe และ Elements
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

// เอามาจากหน้า Dashboard ของ stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AddCreditCardForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [cardName, setCardName] = useState("");

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#111827", // สีเทาเข้มเกือบดำ (text-gray-900)
        "::placeholder": { color: "#9CA3AF" }, // สีเทาอ่อน (text-gray-400)
        fontFamily: "Anuphan, sans-serif",
      },
      invalid: { color: "#EF4444" }, // สีแดงเมื่อกรอกผิด
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardName) {
      toast.error("กรุณากรอกชื่อบนบัตร");
      return;
    }

    toast.loading("กำลังตรวจสอบข้อมูลบัตร...");

    const cardElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
      billing_details: {
        name: cardName,
      },
    });

    toast.dismiss();

    if (error) {
      toast.error(error.message || "ข้อมูลบัตรไม่ถูกต้อง");
    } else {
      console.log("บันทึกบัตรสำเร็จ ได้ Token:", paymentMethod);
      toast.success("เพิ่มบัตรสำเร็จ!");

      // ดึงบัตรเดิมที่มีอยู่ในระบบมาเตรียมไว้
      const localCards = localStorage.getItem("mockSavedCards");
      const existingCards = localCards ? JSON.parse(localCards) : [];

      // สร้างข้อมูลบัตรใบใหม่
      const newCard = {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand || "visa",
        last4: paymentMethod.card?.last4 || "0000",
        bankName: cardName || "บัตรที่บันทึกใหม่",
      };

      // บันทึกรวมของเก่า+ของใหม่ ลงใน LocalStorage
      localStorage.setItem(
        "mockSavedCards",
        JSON.stringify([...existingCards, newCard]),
      );

      // หน่วงเวลา 1 วินาทีให้เห็นข้อความสำเร็จก่อน
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-10 lg:pb-0 font-anuphan text-gray-800 flex flex-col items-center">
      {/* --- DESKTOP BREADCRUMB --- */}
      <div className="w-full max-w-[1136px] hidden lg:block">
        <nav className="flex items-center mt-10 text-md text-black mb-4 font-medium py-1">
          <Link to="/" className="hover:text-[#4285F4] transition-colors">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/shopping-cart"
            className="hover:text-[#4285F4] transition-colors"
          >
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/payment"
            className="hover:text-[#4285F4] transition-colors"
          >
            สรุปคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="text-black font-bold">เพิ่มบัตรเครดิต/เดบิต</span>
        </nav>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden w-full flex items-center bg-white p-4 shadow-sm sticky top-0 z-30 mb-2">
        <Icon
          icon="lucide:arrow-left"
          className="w-6 h-6 mr-3 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-lg font-bold text-black">เพิ่มบัตรใหม่</span>
      </div>

      <div className="w-full max-w-[700px] mx-auto bg-white lg:rounded-xl lg:shadow-sm lg:border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-10 lg:mb-10 lg:mt-6">
        {/* Header (Desktop Only) */}
        <div className="hidden lg:flex items-start gap-4 mb-8 border-b pb-4">
          <button type="button" onClick={() => navigate(-1)}>
            <Icon
              icon="lucide:arrow-left"
              className="w-6 h-6 mt-1 cursor-pointer text-black hover:text-[#4285F4] transition-colors"
            />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">เพิ่มบัตรใหม่</h1>
            <p className="text-sm text-gray-500">
              เพิ่มบัตรเครดิตหรือเดบิตสำหรับการชำระเงิน
            </p>
          </div>
        </div>

        {/* บัตรจำลอง (Mockup Card) Responsive */}
        <div className="flex justify-center mb-8 lg:mb-10 mt-4 lg:mt-0 px-2 sm:px-0">
          <div className="w-full max-w-[340px] aspect-[1.58] bg-[#0B1A3A] rounded-2xl p-5 sm:p-6 text-white shadow-xl relative flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-7 sm:w-12 sm:h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-90"></div>
              <div className="font-bold text-lg sm:text-xl italic opacity-50">
                CARD
              </div>
            </div>

            <div>
              <div className="font-mono text-lg sm:text-xl tracking-widest mb-3 sm:mb-4">
                **** **** **** ****
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs font-mono">
                <div>
                  <div className="opacity-70 text-[9px] sm:text-[10px]">
                    Card Holder
                  </div>
                  <div className="uppercase tracking-wide line-clamp-1 max-w-[160px] sm:max-w-[180px]">
                    {cardName || "NAME SURNAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="opacity-70 text-[9px] sm:text-[10px]">
                    Expires
                  </div>
                  <div className="tracking-widest">**/**</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-[500px] mx-auto px-1 sm:px-0"
        >
          <div>
            <label
              htmlFor="cardName"
              className="block text-[13px] sm:text-sm font-bold text-gray-900 mb-1.5"
            >
              ชื่อที่ปรากฏบนบัตร
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="ชื่อบนบัตร"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] text-sm"
            />
          </div>

          <div>
            <label className="block text-[13px] sm:text-sm font-bold text-gray-900 mb-1.5">
              หมายเลขบัตร
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] sm:text-sm font-bold text-gray-900 mb-1.5">
                วันหมดอายุ
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-bold text-gray-900 mb-1.5">
                CVC
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe}
            className="cursor-pointer w-full bg-black text-white font-bold py-3.5 rounded-lg mt-8  transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            ยืนยันการเพิ่มบัตร
          </button>
        </form>

        {/* Security Alert */}
        <div className="max-w-[500px] mx-auto mt-8 bg-[#f4f7fd] border border-[#e2e8f0] rounded-lg p-4 flex items-start gap-3 text-xs text-gray-500 mx-1 sm:mx-auto">
          <Icon
            icon="lucide:shield-check"
            className="w-5 h-5 flex-shrink-0 text-[#4285F4] mt-0.5"
          />
          <div className="flex flex-col">
            <strong className="text-gray-900 font-bold mb-1 text-[13px]">
              การรับรองความปลอดภัย
            </strong>
            <p className="leading-relaxed">
              ระบบจะทำการเข้ารหัสข้อมูลบัตรของคุณ และรหัส CVC จะไม่ถูกจัดเก็บ
              ข้อมูลทั้งหมดจะถูกส่งด้วยเทคโนโลยีการเข้ารหัส 256-bit SSL
              เพื่อความปลอดภัยสูงสุด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// สร้าง Wrapper Component ออกไปให้ระบบเรียกใช้
const AddCreditCard = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddCreditCardForm />
    </Elements>
  );
};

export default AddCreditCard;
