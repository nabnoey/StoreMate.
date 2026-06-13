import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import Loading from "../components/loading/Loading";
import NavBar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import ScrollToTop from "../components/user/ScrollToTop";
// ✅ 1. Import ตัว Hook เชื่อมต่อ Socket เข้ามาทำงานที่หน้าต่างหลัก
import useNotificationSocket from "../hooks/useNotificationSocket";

const MainLayout = () => {
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // ✅ 2. เรียกใช้งานฟังก์ชันเปิดปิดการเชื่อมต่อ Realtime ไว้ที่ระดับบนสุดของแอปฯ
  useNotificationSocket();

  // สร้างไว้ให้ปิดหน้า loading ตอน Automated Test ผู้ใช้งานใช้ได้คือเก่า
  const isAutomationTest =
    typeof window !== "undefined" && window.navigator.webdriver;

  useEffect(() => {
    // ✅ 3. ย้ายลอจิกตรวจสอบสถานะ Automated Test เข้ามาไว้ในนี้ เพื่อป้องกันพฤติกรรมอัปเดตสถานะตอนกำลัง Render
    if (isAutomationTest) {
      setIsPageTransitioning(false);
      return;
    }

    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
      // หน่วงไว้ 1 วินาที ถ้าไม่หน่วงไม่โผล่นะจ้ะ
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, isAutomationTest]); // เพิ่ม dependency เพื่อความปลอดภัยตามมาตรฐานลินท์

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      {isPageTransitioning && <Loading fullScreen={true} size={250} />}

      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <main className="flex-grow w-full mt-14 md:mt-16">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      <div className="mt-25 lg:mt-35">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
