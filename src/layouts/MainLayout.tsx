import { Outlet } from "react-router";
import NavBar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-4 mt-16 mb-20 min-h-[calc(100vh-9rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;