import {  useState } from "react";
import { UserContext } from "./UserContext";
import type { UserContextType } from "./UserContext";
import { TokenService } from "../services/token.service";

type Props = { 
  children: React.ReactNode;
};

export const UserContextProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
   !!TokenService.getAccessToken()
  );

  const logIn = (token: string) => {
    TokenService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenService.removeToken();
    setIsAuthenticated(false);
  };

  const value: UserContextType = {
    isAuthenticated,
    logIn,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

