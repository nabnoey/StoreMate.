import { Outlet } from "react-router";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      {/* Main content */}
    <main
  className="
    flex flex-col min-h-screen overflow-x-hidden
    container
    mx-auto
    px-3 sm:px-4 md:px-6 lg:px-8
    py-4
    mt-14 md:mt-16
    mb-24 md:mb-20
    min-h-[calc(100vh-9rem)]
  "
>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;