import { LOGIN,LOGOUT } from "./actionTypes";

export type LoginAction = {
    type: typeof LOGIN,
    payload:{
        token:string,
        isAuthenticated:true
    }
}



export type LogoutAction = {
    type: typeof LOGOUT,
}


export const login = (token:string): LoginAction => ({
    type:LOGIN,
    payload:{
        token,
        isAuthenticated:true
    }
})

export const logout = ():LogoutAction => ({
    type:LOGOUT
})

export type AuthAction = LoginAction 