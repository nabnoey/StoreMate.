import { useEffect, useState } from "react";
import { UserContext} from "./UserContext";
import type { User } from "../types/user"
import type { UserContextType } from "./UserContext";
import { TokenService } from "../services/token.service";


type Props = {
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<User | null>(getUser());

  /** login ต้องรับ User เท่านั้น */
  const logIn = (user: User) => {
    setUserInfo(user);
  };

  /** logout ล้าง state + token */
  const logout = () => {
    setUserInfo(null);
    TokenService.removeUser();
  };

  /** ดึง user จาก storage ตอนเริ่ม */
  function getUser(): User | null {
    const stored = TokenService.getUser();

    // ป้องกันข้อมูลมั่วจาก storage
    if (
      stored &&
      typeof stored.id === "number" &&
      typeof stored.name === "string" &&
      typeof stored.email === "string"&&
      typeof stored.phone === "string"&&
      typeof stored.accessToken === "string"
    ) {
      return stored as User;
    }

    return null;
  }

  /** sync user ลง storage ทุกครั้งที่เปลี่ยน */
  useEffect(() => {
    if (userInfo) {
      TokenService.setUser(userInfo);
    } else {
      TokenService.removeUser();
    }
  }, [userInfo]);

  /** value ต้องตรงตาม UserContextType */
  const value: UserContextType = {
    userInfo,
    logIn,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
