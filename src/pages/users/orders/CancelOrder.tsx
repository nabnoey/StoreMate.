import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-4 font-medium">
          <Link
            data-test="click-home"
            to="/"
            className="transition-colors cursor-pointer"
          >
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black">แก้ไขโปรไฟล์</span>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link
            to="/profile"
            data-test="click-profile"
            className="transition-colors"
          >
            โปรไฟล์
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default ProfilePage;
