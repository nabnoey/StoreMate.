import {LOGIN,LOGOUT, UPDATE_PROFILE} from "./actionTypes"
import type { LoginAction,LogoutAction, UpdateProfileAction } from "./authAction"
import type { Profile } from "./authInitalState";
export const login = (
    payload:LoginAction["payload"]
):LoginAction => ({
    type:LOGIN,
    payload

})



export const logout = ():LogoutAction => ({
    type:LOGOUT,
})


export const updateProfile = (data: Partial<Profile>): UpdateProfileAction => ({
  type: UPDATE_PROFILE,
  payload: data,
});