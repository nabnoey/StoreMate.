import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

type Props = {
  children: React.ReactNode;
};

const GuestRoute = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;