// UserAvatar.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const UserAvatar: React.FC<Props> = ({ onClick }) => {
  // 1. ดึงจาก Redux
  const nameFromRedux = useSelector((state: RootState) => state.auth.name);
  
  // 2. ถ้า Redux ว่าง ลองเช็คใน Storage (เผื่อ Refresh หน้าจอ)
  const getStoredName = () => {
    const storedAuth = localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return parsed.name; // หรือโครงสร้างที่เก็บไว้
    }
    return null;
  };

  const name = nameFromRedux || getStoredName();

  console.log("Current Name in UI:", name);

  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer"
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
