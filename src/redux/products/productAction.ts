import {ADD_PRODUCT,ADD_QUANTITY,REMOVE_QUANTITY} from "./actionTypes"

export type AddProducAction = {
    type: typeof ADD_PRODUCT
    payload:{
        id:number,
        title:string,
        description:string,
        image:string,
        category:string,
        price:number,
        quantity:number

    }
}

export type AddQuantity = {
    type: typeof ADD_QUANTITY
    payload:{
        productId:number
}
}

export type RemoveProductQuantity = {
    type: typeof REMOVE_QUANTITY
    payload:{
        productId:number
    }
}
