import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const AddCreditCard = () => {
  const navigate = useNavigate();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const cardTypeDisplay = useMemo(() => {
    if (cardNumber.startsWith("4")) return "VISA";
    if (cardNumber.startsWith("5")) return "Mastercard";
    return "VISA";
  }, [cardNumber]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replaceAll(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replaceAll(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(/\D/g, "").slice(0, 3);
    setCvc(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      cardNumber.length < 19 ||
      !cardName ||
      expiry.length < 5 ||
      cvc.length < 3
    ) {
      toast.error("กรุณากรอกข้อมูลบัตรให้ครบถ้วนและถูกต้อง");
      return;
    }

    try {
      // Simulate API Call
      console.log("Saving card:", { cardName, cardNumber, expiry });

      toast.success("เพิ่มบัตรสำเร็จ!");

      navigate("/payment", {
        state: {
          newCardAdded: true,
          last4: cardNumber.slice(-4),
          cardType: cardNumber.startsWith("4") ? "Visa" : "Mastercard",
        },
      });
    } catch (error) {
      console.error("Failed to save card:", error);
      toast.error("ไม่สามารถบันทึกข้อมูลบัตรได้");
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
              <div className="font-bold text-xl italic">{cardTypeDisplay}</div>
            </div>

            <div>
              <div className="font-mono text-xl tracking-widest mb-4">
                {cardNumber || "0000 0000 0000 0000"}
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
                  <div className="tracking-widest">{expiry || "MM/YY"}</div>
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
              data-test="input-card-name"
              type="text"
              placeholder="ชื่อบนบัตร"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-bold text-gray-900 mb-1"
            >
              หมายเลขบัตร
            </label>
            <input
              id="cardNumber"
              data-test="input-card-number"
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                วันหมดอายุ
              </label>
              <input
                id="expiry"
                data-test="input-expiry"
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label
                htmlFor="cvc"
                className="block text-sm font-bold text-gray-900 mb-1"
              >
                CVC
              </label>
              <input
                id="cvc"
                data-test="input-cvc"
                type="password"
                placeholder="xxx"
                value={cvc}
                onChange={handleCvcChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono tracking-widest"
              />
            </div>
          </div>

          <button
            data-test="submit-add-card"
            type="submit"
            className="cursor-pointer w-full bg-black text-white font-bold py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors shadow-md"
          >
            ยืนยันการเพิ่มบัตร
          </button>
        </form>

        {/* Security Alert Box */}
        {/* Security Alert Box */}
        <div className="max-w-[500px] mx-auto mt-8 bg-gray-50 border border-gray-100 rounded-lg p-4 flex gap-3 text-xs text-gray-500">
          <Icon
            icon="lucide:shield-check"
            className="w-5 h-5 flex-shrink-0 text-gray-600"
          />
          <div className="flex flex-col">
            {/* จัดให้ strong และ p อยู่ใน Flex Column เพื่อควบคุมระยะห่างด้วย Gap หรือ Margin แทนการพึ่งพาช่องว่างจาก Text */}
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

export default AddCreditCard;
