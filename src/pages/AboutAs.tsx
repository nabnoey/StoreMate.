import champoo from "../assets/champoo.jpg";
import drink from "../assets/drink_mango.jpg";
import soap from "../assets/soap_padthong.webp";
import padthong from "../assets/padthong.jpg";
import padthongLogo from "../assets/navbar_padthong.jpg";

const AboutUs = () => {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col font-anuphan">
      
      {/* ========================================== */}
      {/* Section 1: Hero (ส่วนบนสุด)                  */}
      {/* ========================================== */}
      <section className="w-full bg-[#fbf9f4] pt-5 pb-10 md:pt-20 md:pb-21 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* ข้อความ Hero Text */}
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1f1a17] leading-[1.15] tracking-tight mb-6">
                สืบสานภูมิปัญญาไทย<br />
                สู่พลังแห่ง<br />
                ความยั่งยืนในทุกวัน
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                "เราคือผู้บุกเบิกนวัตกรรมสมุนไพรไทย 
                ที่มุ่งเน้นการคัดสรรคุณค่าจากธรรมชาติ โดยเฉพาะ 'มะม่วงหาวมะนาวโห่' 
                เพื่อส่งมอบสุขภาพที่ดีและยั่งยืน ให้กับไลฟ์สไตล์ที่ทันสมัยของคุณ"
              </p>
            </div>

            {/* รูปภาพ Collage Grid */}
            <div className="w-full">
              <div className="grid grid-cols-12 gap-6 lg:gap-10">
                <div className="col-span-5 md:col-span-4 flex flex-col justify-between gap-6 lg:gap-10">
                  <div className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-500 hover:scale-105 bg-white aspect-square">
                    <img src={champoo} alt="ผลิตภัณฑ์สมุนไพร แชมพู" className="w-full h-full object-cover"/>
                  </div>
                  <div className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-500 hover:scale-105 bg-white aspect-square">
                    <img src={soap} alt="ผลิตภัณฑ์สมุนไพร สบู่" className="w-full h-full object-cover"/>
                  </div>
                </div>

                <div className="col-span-7 md:col-span-8 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-500 hover:scale-105 bg-white flex items-center justify-center">
                 <img src={drink} alt="น้ำมะม่วงหาวมะนาวโห่ ตรา พัดทอง" className="w-full h-auto object-contain"/>
               </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* Section 2: Brand Vision (วิสัยทัศน์แบรนด์)     */}
      {/* ========================================== */}
      <section className="w-full bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-8 md:mb-12 text-sm text-gray-500">
            <a href="/" className="cursor-pointer hover:text-blue-500 transition-colors">หน้าหลัก</a>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">เกี่ยวกับเรา</span>
          </div>

          {/* เนื้อหาหลัก */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            <div className="w-full flex justify-center md:justify-start">
              <div className="w-full max-w-[400px] lg:max-w-[500px] bg-[#fdfdfd] aspect-square flex items-center justify-center p-8 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.04)]">
                <img src={padthong} alt="ตรา พัดทอง" className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"/>
              </div>
            </div>

            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f1a17] leading-tight mb-6 tracking-tight">
                ก้าวใหม่สู่ความยั่งยืน<br />
                พลังจากสมุนไพรไทย
              </h2>
              <div className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed space-y-4">
                <p>
                  เราเชื่อว่า <strong>"สุขภาพที่ดีคือพื้นฐานของชีวิตที่ร่มเย็น"</strong><br />
                  เราจึงนำสมุนไพรไทยที่มีสรรพคุณสูงอย่างมะม่วงหาวมะนาวโห่ 
                  มาผ่านกระบวนการคัดสรรและแปรรูปด้วยนวัตกรรมใหม่ 
                  เพื่อเปลี่ยนภาพจำของสมุนไพรแบบเดิมให้กลายเป็นผลิตภัณฑ์ที่ใช้งานง่าย 
                  มีรสชาติที่ดี และเข้ากับไลฟ์สไตล์ที่เร่งรีบในปัจจุบัน
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* Section 3: Store History (ประวัติร้านค้า)      */}
      {/* ========================================== */}
      <section className="w-full bg-[#050505] text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:pl-16 lg:pr-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                ประวัติร้านค้า
              </h2>
              <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed font-light">
                <p>
                  จุดเริ่มต้นของเราเติบโตมาจากท้องถิ่น
                  จากการสานต่อสวนหลังบ้านที่เต็มไปด้วยต้นมะม่วงหาวมะนาวโห่ 
                  ในยุคที่ทุกคนมองหา Superfood จากต่างประเทศ เรากลับหลงใหลในความเปรี้ยวอมหวานและสรรพคุณของ 
                  "มะม่วงหาวมะนาวโห่" สมุนไพรไทยที่ถูกลืม เราจึงหยิบเอาภูมิปัญญาดั้งเดิมมาปัดฝุ่นใหม่ 
                  ให้กลายเป็นผลิตภัณฑ์ที่ตอบโจทย์ไลฟ์สไตล์คนเมืองที่โหยหาความสมดุล
                </p>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-base md:text-lg mt-6">
                    ปรัชญาของเรา (Our Philosophy)
                  </h3>
                  <p className="mb-2">เรายึดมั่นในงาน "คราฟท์" (Craft) และความใส่ใจต่อวัตถุดิบ:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li><strong className="text-gray-300">Small Batch:</strong> เราผลิตในปริมาณน้อย เพื่อควบคุมคุณภาพให้สดใหม่เหมือนทำกินเองในครอบครัว</li>
                    <li><strong className="text-gray-300">Artisanal Process:</strong> คัดสรรผลสดด้วยมือ (Hand-picked) เลือกเฉพาะผลที่สุกงอมเพื่อให้ได้สารแอนโทไซยานิน (Anthocyanin) สูงสุด</li>
                    <li><strong className="text-gray-300">Ethical & Clean:</strong> ไม่ใส่สารกันบูด ไม่แต่งกลิ่นสังเคราะห์ ความสดชื่นที่คุณสัมผัสมาจากธรรมชาติ 100%</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <h3 className="font-semibold text-white mb-2 text-base md:text-lg">
                    สิ่งที่คุณจะสัมผัสได้
                  </h3>
                  <p>
                    ไม่ใช่แค่น้ำผลไม้สมุนไพร แต่คือ Experience ของการดื่มความสดชื่นที่มาพร้อมกับความใส่ใจ 
                    ตั้งแต่กระบวนการปลูกแบบออร์แกนิค ไปจนถึงบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อม (Eco-friendly packaging)
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 w-full relative"> 
              <div className="relative w-full rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"> 
                <img src={padthongLogo} alt="สมุนไพรมะม่วงหาว มะนาวโห่ ตรา พัดทอง" className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"/>
              </div>
            </div>

          </div>
        </div>
      </section>

   {/* ========================================== */}
{/* Section 4: Highlight Features (จุดเด่น) */}
{/* ========================================== */}
<section className="w-full flex flex-col bg-[#faf9f6] m-0 p-0 border-none">

  {/* กล่องข้อความสีดำ */}
  <div className="w-full bg-white py-12 md:py-20">
    <div className="w-full flex justify-end">

      <div className="w-[90%] max-w-[940px] min-h-[274px] bg-[#050505] rounded-l-[30px] py-10 px-4 sm:px-10 md:px-16 shadow-2xl flex items-center">

        <div className="flex flex-col items-start text-left w-full gap-2 md:gap-3">

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-wide">
            ปลุกความสดชื่น เติมพลังสีแดง...
          </h2>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-wide pl-12 md:pl-20">
            ด้วยพลังธรรมชาติ 100%
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-bold max-w-2xl self-end text-right pt-4 md:pt-9">
            จากภูมิปัญญาหลังบ้าน สู่ผลิตภัณฑ์คุณภาพ... ปัดฝุ่นสมุนไพรไทยให้กลับมา
          </p>

        </div>

      </div>

    </div>
  </div>


  {/* พื้นหลังสีครีม */}
  <div className="w-full bg-[#faf9f6] m-0 border-none">

    <div className="max-w-[1440px] mx-auto min-h-[240px] px-[60px] py-[16px] flex flex-col justify-center">

      <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-0 pb-10 md:pb-0">

        {/* Column 1 */}
        <div className="flex-1 md:pr-10 lg:pr-16 md:border-r border-black flex flex-col justify-start">

          <h3 className="tracking-tight text-2xl md:text-3xl font-bold text-[#1f1a17] mb-4 leading-[1.2]">
            ใส่ใจคุณภาพ
            <br />
            เพื่อสุขภาพที่ยั่งยืนของคุณ
          </h3>

          <p className="text-sm md:text-base text-black font-semibold max-w-[300px]">
            ดูมาตรฐานการคัดสรรวัตถุดิบ
          </p>

        </div> 

        {/* Column 2 */}
        <div className="flex-1 md:px-10 lg:px-16 md:border-r border-black flex flex-col justify-start">

          <h3 className="tracking-tight text-2xl md:text-3xl font-bold text-[#1f1a17] mb-4 leading-[1.2]">
            พลิกโฉมสมุนไพรไทย
            <br />
            ด้วยกระบวนการที่ทันสมัย
          </h3>

          <p className="text-sm md:text-base text-blalck font-semibold max-w-[300px]">
            ดูมาตรฐานการคัดสรรวัตถุดิบ
          </p>

        </div>

        {/* Column 3 */}
        <div className="flex-1 md:pl-10 lg:pl-16 flex flex-col justify-start">

          <h3 className="tracking-tight text-2xl md:text-3xl font-bold text-[#1f1a17] mb-4 leading-[1.2]">
            ออกแบบมาเพื่อไลฟ์สไตล์
            <br />
            และการใช้งานที่ลงตัว
          </h3>

          <p className="text-sm md:text-base text-black font-semibold max-w-[300px]">
            ดูมาตรฐานการคัดสรรวัตถุดิบ
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

    </main>
  );
};

export default AboutUs;