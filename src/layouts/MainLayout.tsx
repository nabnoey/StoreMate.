import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "../components/loading/Loading";
import NavBar from "../components/user/Navbar";
import Footer from "../components/user/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <main className="flex-grow w-full mt-14 md:mt-16 bg-gray-50/50 mb-20">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;