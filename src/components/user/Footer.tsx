import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#193220] text-gray-300 font-anuphan block w-full -mt-[1px] relative z-10 p-0 m-0">
      {/* Top Section */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EAB308] rounded-full flex items-center justify-center text-[#193220] font-bold text-sm shrink-0">
              PT
            </div>
            <h2 className="text-[#EAB308] font-bold text-[16px]">พัดทอง</h2>
          </div>
          <p className="text-[16px] leading-relaxed text-gray-300 max-w-sm">
            ผลิตภัณฑ์แปรรูปจากสมุนไพรไทย
            <br />
            มะม่วงหาว
            <br />
            มะนาวโห่คุณภาพสูง
            <br />
            เพื่อสุขภาพที่ดีของคุณ
          </p>
        </div>

        {/* Column 2: Menu */}
        <div>
          <h3 className="text-[#EAB308] font-bold text-[20px] mb-4">เมนู</h3>
          <ul className="flex flex-col space-y-2 text-sm">
            <li>
              <button
                data-test="home-button"
                className="cursor-pointer py-1 text-left text-[16px] hover:text-white transition-colors"
                onClick={() => navigate("/")}
              >
                หน้าแรก
              </button>
            </li>
            <li>
              <button
                data-test="all-products-button"
                className="cursor-pointer py-1 text-left text-[16px] hover:text-white transition-colors"
                onClick={() => navigate("/search")}
              >
                สินค้าทั้งหมด
              </button>
            </li>
            <li>
              <button
                data-test="promotions-button"
                className="cursor-pointer py-1 text-left text-[16px] hover:text-white transition-colors"
                onClick={() => navigate("/search?keyword=&category=promotion")}
              >
                โปรโมชั่น
              </button>
            </li>
            <li>
              <button
                data-test="contact-button"
                className="cursor-pointer py-1 text-left text-[16px] hover:text-white transition-colors"
                onClick={() => navigate("/contact")}
              >
                ติดต่อเรา
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Social Media */}
        <div>
          <h3 className="text-[#EAB308] font-bold text-[20px] mb-4">
            ติดตามเรา
          </h3>
          <div className="flex gap-3">
            <a
              data-test="facebook-button"
              href="https://www.facebook.com/Padthong636"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ไปที่ Facebook ของพัดทอง"
              className="cursor-pointer w-9 h-9 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <Icon
                icon="fa6-brands:facebook-f"
                className="text-white text-sm"
              />
            </a>
            <a
              data-test="instagram-button"
              href="https://www.instagram.com/padthongofficial/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ไปที่ Instagram ของพัดทอง"
              className="cursor-pointer w-9 h-9 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <Icon
                icon="fa6-brands:instagram"
                className="text-white text-sm"
              />
            </a>
            <a
              data-test="line-button"
              href="https://line.me/R/ti/p/@859pkcpt?oat_content=url&ts=05121928"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ติดต่อเราผ่าน Line"
              className="cursor-pointer w-9 h-9 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <Icon icon="fa6-brands:line" className="text-white text-[18px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section (Copyright) */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 text-center text-[14px] text-[#D1D5DB] font-light">
          © {new Date().getFullYear()} Phadthong Store. สงวนลิขสิทธิ์.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
