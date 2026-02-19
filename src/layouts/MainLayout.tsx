import { Outlet } from "react-router";
import NavBar from "../components/user/Navbar";
import Footer from "../components/user/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      {/* Main content: ปลดล็อค container และ px ออก เพื่อให้แต่ละหน้าจัดการเอง */}
      <main className="flex-grow w-full mt-14 md:mt-16 bg-gray-50/50">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;