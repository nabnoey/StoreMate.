import {LOGIN,LOGOUT} from "./actionTypes"

import type { LoginAction,LogoutAction } from "./authAction"

export const login = (
    payload:LoginAction["payload"]
):LoginAction => ({
    type:LOGIN,
    payload

})



export const logout = ():LogoutAction => ({
    type:LOGOUT,
})