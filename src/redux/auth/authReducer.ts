import { LOGIN, LOGOUT } from "./actionTypes";
import type { LoginAction, LogoutAction } from "./authAction";
import { authInitialState } from "./authInitalState";
import type { UnknownAction } from "redux";
type AuthAction = LoginAction | LogoutAction;

const authReducer = (
  state = authInitialState,
  action: AuthAction | UnknownAction
) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
         token: (action as LoginAction).payload.token,
         name: (action as LoginAction).payload.name,
        isAuthenticated: true,
      };

    case LOGOUT:
      return {
        ...state,
        token: "",
        isAuthenticated: false,
        name: "",
      };

    default:
      return state;
  }
};

export default authReducer;
