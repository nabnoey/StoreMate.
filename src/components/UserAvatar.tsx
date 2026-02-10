// UserAvatar.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/auth/action";
import { useNavigate } from "react-router";

type Props = {
  onClick?: () => void;
};

const UserAvatar: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. ดึงชื่อจาก Redux
  const nameFromRedux = useSelector(
    (state: RootState) => state.auth.name
  );

  // 2. fallback ไป storage (กรณี refresh)
  const getStoredName = () => {
    const storedAuth =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return parsed.name;
    }
    return null;
  };

  const name = nameFromRedux || getStoredName();
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  // 3. logout handler
  const handleLogout = () => {
    // ล้าง storage
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");

    // แจ้ง Redux
    dispatch(logout());

    // เปลี่ยนหน้า (เลือกได้)
    navigate("/login");
  };

  return (
    <div
      onClick={handleLogout}
      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer"
      title="Logout"
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
