import { ADD_QUANTITY,REMOVE_QUANTITY } from "./actionTypes";

//ชื่อ type ของ action ว่าaction จะต้องมีหน้าตาแบบไหน 
import type { AddQuantity} from "./productAction";

//function
export const addQuantity = (
    productId:number,
): AddQuantity => ({
    type: ADD_QUANTITY,
    payload:{productId}
})

export const removeQuantity = (id:number)=>({
    type:REMOVE_QUANTITY,
    payload:{productId:id}
})