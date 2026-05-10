import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/auth/authReducer";

type Props = {
  children: React.ReactNode;
};

const ProtectedRout = ({ children }: Props) => {
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();

  // เช็คว่ามีข้อมูลไหม
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // สร้างตัวแปรไว้เก็บสถานะว่า Token พังหรือหมดอายุไหม
  let isTokenInvalid = false;

  try {
    const decoded: any = jwtDecode(token);
    // token หมดอายุระหว่างทางอะป่าว
    if (decoded.exp * 1000 < Date.now()) {
      isTokenInvalid = true;
    }
  } catch (error) {
    // ถอดรหัสไม่ได้ (token พัง/โดนแก้)
    isTokenInvalid = true;
  }

  //ใช้ useEffect เพื่อ dispatch actiong เวลา token มีปัญหา
  useEffect(() => {
    if (isTokenInvalid) {
      // เงื่อนไขคือถ้า token หมด ให้เคลียร์ token ใน cookie และ Redux เลยฟริน
      dispatch(logout());
    }
  }, [isTokenInvalid, dispatch]);

  // ถ้า token มีปัญหา ให้เด้งกลับไปหน้า login เลย
  if (isTokenInvalid) {
    return <Navigate to="/login" replace />;
  }

  // ถ้าผ่านหมดทุกด่าน ก็แสดงผลหน้า Component ปกติเลยฟริน
  return <>{children}</>;
};

export default ProtectedRout;
