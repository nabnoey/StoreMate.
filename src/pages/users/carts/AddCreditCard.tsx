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
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
        fontFamily: "Anuphan, sans-serif",
      },
      invalid: { color: "#9e2146" },
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

      //  สร้างข้อมูลบัตรใบใหม่
      const newCard = {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand || "visa",
        last4: paymentMethod.card?.last4 || "0000",
        bankName: cardName || "บัตรที่บันทึกใหม่",
      };

      // บันทึกรวมของเก่า+ของใหม่ ลงใน LocalStorage
      // ตัวอย่างข้อมูลที่ถูกบันทึกจะมีโครงสร้างแบบนี้: {id: "pm_1TGfNa1LdTq9hIE60VBNwh1M", brand: "mastercard", last4: "1395", bankName: "N JAMRATPHUM"}
      // บัตรเครดิตที่ถูกเข้ารหัสแล้ว (Token) จะถูกเก็บไว้ใน LocalStorage เพื่อใช้แสดงในหน้าสรุปคำสั่งซื้อ และใช้ในการชำระเงิน
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
    <div className="min-h-screen bg-white py-4 sm:py-8 px-2 sm:px-4 font-anuphan text-gray-800">
      {/* Navbar */}
      <nav className="hidden lg:flex flex-wrap items-center mt-4 md:mt-6 text-md text-black mb-6 md:mb-8 font-medium ml-4 md:ml-10 lg:ml-20 py-1">
        <Link to="/" className="hover:text-blue-500">
          หน้าหลัก
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1"
        />
        <Link to="/shopping-cart" className="hover:text-blue-500">
          รถเข็น
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1"
        />
        <Link to="/payment" className="hover:text-blue-500">
          สรุปคำสั่งซื้อ
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1"
        />
        <span className="text-black font-bold">เพิ่มบัตรเครดิต/เดบิต</span>
      </nav>

      <div className="max-w-[700px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 sm:p-10 mt-10">
        <div className="flex items-start gap-4 mb-8 border-b pb-4">
          <button type="button" onClick={() => navigate(-1)}>
            <Icon
              icon="lucide:arrow-left"
              className="w-6 h-6 mt-1 cursor-pointer"
            />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">เพิ่มบัตรใหม่</h1>
            <p className="text-sm text-gray-500">
              เพิ่มบัตรเครดิตหรือเดบิตสำหรับการชำระเงิน
            </p>
          </div>
        </div>

        {/* บัตรจำลอง (Mockup Card) */}
        <div className="flex justify-center mb-10">
          <div className="w-[340px] h-[210px] bg-[#0B1A3A] rounded-2xl p-6 text-white shadow-xl relative flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-90"></div>
              <div className="font-bold text-xl italic opacity-50">CARD</div>
            </div>

            <div>
              <div className="font-mono text-xl tracking-widest mb-4">
                **** **** **** ****
              </div>
              <div className="flex justify-between text-xs font-mono">
                <div>
                  <div className="opacity-70 text-[10px]">Card Holder</div>
                  <div className="uppercase tracking-wide line-clamp-1 max-w-[180px]">
                    {cardName || "NAME SURNAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="opacity-70 text-[10px]">Expires</div>
                  <div className="tracking-widest">**/**</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูลพร้อม label association */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-[500px] mx-auto"
        >
          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              ชื่อที่ปรากฏบนบัตร
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="ชื่อบนบัตร"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              หมายเลขบัตร
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                วันหมดอายุ
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                CVC
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe}
            className="cursor-pointer w-full bg-black text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors shadow-md disabled:bg-gray-400"
          >
            ยืนยันการเพิ่มบัตร
          </button>
        </form>

        <div className="max-w-[500px] mx-auto mt-8 bg-gray-50 border border-gray-100 rounded-lg p-4 flex gap-3 text-xs text-gray-500">
          <Icon
            icon="lucide:shield-check"
            className="w-5 h-5 flex-shrink-0 text-gray-600"
          />
          <div className="flex flex-col">
            <strong className="text-gray-700 font-bold mb-1 text-[13px]">
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
    // ห่อหุ้มฟอร์มด้วย Elements ของ Stripe
    <Elements stripe={stripePromise}>
      <AddCreditCardForm />
    </Elements>
  );
};

export default AddCreditCard;
