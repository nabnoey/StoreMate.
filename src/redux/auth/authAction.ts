import { LOGIN,LOGOUT } from "./actionTypes";
export type LoginAction = {
    type: typeof LOGIN;
    payload: {
        token: string;
        name: string; // มั่นใจว่ามี field นี้
        isAuthenticated: boolean;
    };
};



export type LogoutAction = {
    type: typeof LOGOUT,
}


// แก้ไขตรงนี้: รับ name เพิ่มเข้ามา
export const login = (token: string, name: string): LoginAction => ({
    type: LOGIN,
    payload: {
        token,
        name,
        isAuthenticated: true,
    },
});

dispatch(login(response.token, response.user.name));

export const logout = ():LogoutAction => ({
    type:LOGOUT
})

export type AuthAction = LoginAction 