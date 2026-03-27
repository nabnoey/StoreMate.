import { FaFacebookF, FaInstagram, FaLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#193220] text-gray-300 font-anuphan block w-full -mt-[1px] relative z-10 p-0 m-0">
      {/* Top Section */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EAB308] rounded-full flex items-center justify-center text-[#193220] font-bold text-sm">
              PT
            </div>
            <h2 className="text-[#EAB308] font-bold text-xl">พัดทอง</h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-300 max-w-xs">
            ผลิตภัณฑ์แปรรูปจากสมุนไพรไทย มะม่วงหาว มะนาวโห่คุณภาพสูง
            เพื่อสุขภาพที่ดีของคุณ
          </p>
        </div>

        {/* Column 2: Menu */}
        <div>
          <h3 className="text-[#EAB308] font-bold text-sm mb-4">เมนู</h3>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li>
              <button
                data-test="home-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                หน้าแรก
              </button>
            </li>
            <li>
              <button
                data-test="all-products-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/search")}
              >
                สินค้าทั้งหมด
              </button>
            </li>
            <li>
              <button
                data-test="promotions-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/search?keyword=&category=promotion")}
              >
                โปรโมชั่น
              </button>
            </li>
            <li>
              <button
                data-test="contact-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/contact")}
              >
                ติดต่อเรา
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#EAB308] font-bold text-sm mb-4">ช่วยเหลือ</h3>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li>
              <button
                data-test="how-to-order-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                วิธีการสั่งซื้อ
              </button>
            </li>
            <li>
              <button
                data-test="payment-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                แจ้งชำระเงิน
              </button>
            </li>
            <li>
              <button
                data-test="shipping-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                การจัดส่งสินค้า
              </button>
            </li>
            <li>
              <button
                data-test="privacy-policy-button"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                นโยบายความเป็นส่วนตัว
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#EAB308] font-bold text-sm mb-4">ติดตามเรา</h3>
          <div className="flex gap-3">
            <a
              data-test="facebook-button"
              href="https://www.facebook.com/Padthong636"
              target="_blank" // เปิดแท็บใหม่
              rel="noopener noreferrer" // เพื่อความปลอดภัยเวลาเปิดแท็บใหม่
              aria-label="ไปที่ Facebook ของพัดทอง" // สำหรับ Accessibility
              className="cursor-pointer w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <FaFacebookF className="text-white text-sm" />
            </a>
            <a
              data-test="instagram-button"
              href="https://www.instagram.com/padthongofficial/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ไปที่ Instagram ของพัดทอง"
              className="cursor-pointer w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <FaInstagram className="text-white text-sm" />
            </a>
            <a
              data-test="line-button"
              href="https://line.me/R/ti/p/@859pkcpt?oat_content=url&ts=05121928"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ติดต่อเราผ่าน Line"
              className="cursor-pointerw-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <FaLine className="text-white text-sm" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section (Copyright) */}
      <div className="border-t border-white/10">
        <div className=" max-w-[1200px] mx-auto px-6 py-5 text-center text-xs text-gray-400 font-light">
          © 2023 Phadthong Store. สงวนลิขสิทธิ์.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
