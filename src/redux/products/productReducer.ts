import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import { initialState } from "./initailState"
import type { Product } from "../../types/product"

const productScile = createSlice({
    name:"products",
    initialState: initialState as Product[],
    reducers:{

        //เพิ่มจำนวนสินค้าในตะกร้าตอนกด +
        addQuantity(state, action:PayloadAction<number>)  {
            const product = state.find(productId => productId.id === action.payload );
            if (product && product.quantity<10){
                product.quantity += 1;
            
            }
        },

        //ลบจำนวนสินค้าออกจากตะกร้า
        removeQuantity:(
            state, action: PayloadAction<number>
        ) => {
            const product = state.find(productId => productId.id === action.payload)
            if (product && product.quantity<10){
                product.quantity -= 1;
            
            }
        }

    }
})

export const {
    addQuantity,
    removeQuantity

} = productScile.actions

export default productScile.reducer