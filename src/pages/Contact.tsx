import { Icon } from "@iconify/react";

function Contact() {
  return (
    <div className="w-full">

      {/* Header */}
      <div className="bg-[#e8e1d8] py-12 text-center">
        <p className="text-gray-500 text-sm">หน้าหลัก / ติดต่อ</p>

        <h1 className="text-3xl font-bold text-black mt-2">
          ข้อมูลการติดต่อ
        </h1>

        <p className="text-gray-600 mt-2">
          พร้อมให้บริการและตอบคำถามทุกช่องทางเสมอของคุณ
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-6 text-center shadow-sm">
            <Icon icon="mdi:email" className="text-blue-500 text-3xl mx-auto mb-3"/>
            <p className="text-black font-medium">
              padthongofficial@gmail.com
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center shadow-sm">
            <Icon icon="mdi:map-marker" className="text-red-500 text-3xl mx-auto mb-3"/>
            <p className="text-black font-medium">
              199 ถ.ดอนตะโก ต.ดอนตะโก <br />
              อ.เมือง จ.ราชบุรี 70120
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center shadow-sm">
            <Icon icon="mdi:phone" className="text-green-500 text-3xl mx-auto mb-3"/>
            <p className="text-black font-medium">
              0983309919
            </p>
          </div>

        </div>

        {/* Social Media */}
        <h2 className="text-2xl font-bold text-center mt-16 mb-8">
          โซเชียลมีเดีย
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px] mx-auto">

          <div className="border rounded-xl p-6 text-center shadow-sm">
            <Icon icon="mdi:line" className="text-green-500 text-3xl mx-auto mb-3"/>
            <p className="font-medium">@Pattong</p>
          </div>

          <div className="border rounded-xl p-6 text-center shadow-sm">
            <Icon icon="mdi:facebook" className="text-blue-600 text-3xl mx-auto mb-3"/>
            <p className="font-medium">
              มะม่วงหาว มะนาวโห่ ตราพัดทอง
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Contact;