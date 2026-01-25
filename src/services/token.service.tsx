import { Cookies } from "react-cookie";
import type { User } from "../types/user"

//แม่แบบของข้อมูล ว่า user มีอะไรบ้าง
// export interface User {
//     id:number;
//     name:string;
//     email:string;
//     phone:string;
//     accessToken:string;
 
// }

const cookies = new Cookies();

//ดึงtokenจากcookie
const getAccessToken = ():string | undefined => {
    const user = getUser();
    return user?.accessToken;
}

//ดึงข้อมูล user จาก cookie
const getUser = (): User | null => {
    const user = cookies.get<User>("user")

    if(!user) return null;

    //ป้องกันข้อมูลมั่ว
    if(
        typeof user.id === "number"&&
        typeof user.name === "string"&&
        typeof user.email === "string"&&
        typeof user.phone === "string" &&
       typeof user.accessToken === "string"
    ){
  return user as User;
    }
    return null;
  }

  //ลบ user ออกจาก cookie
  const removeUser = (): void => {
 cookies.remove("user",{path:"/"})
  }

  //เก็บ user ลง cookie
  const setUser = (user:User): void => {
    if (user) {
        cookies.set("user",user,{
            path:"/",
            expires: new Date(Date.now() + 86400000), // 1 day
        });
    }else{
        removeUser();
    };
  }
    export const TokenService = {
    getUser,        
    getAccessToken,
    setUser,
    removeUser,
};
