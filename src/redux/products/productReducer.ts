import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product , CategoryGroup } from '../../types/product';;
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "../../services/product.service";


type ProductState = {
  items: Product[]
  groupedProducts: CategoryGroup[]
  search: string
  searchResult: Product[]
  categories: string[]
}

const initialState:ProductState = {
  items: [],
  groupedProducts:[],
  search:"",
   searchResult: [],
   categories: []
}
// 1. ส่วนดึงข้อมูล (เหมือนไปสั่งของจากโรงงาน/API)
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await ProductService.getAllCategories();
  return response; // ข้อมูลที่ได้จะเป็น { soap: [...], drinks: [...] }
});

export const search = createAsyncThunk("products/search",async(keyword:string)=>{
  const response = await ProductService.searchProducts(keyword);
  return response
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {

   

    // เพิ่มสินค้าใหม่
  addProduct: (state, action: PayloadAction<Product>) => {
    const newProduct = {
      ...action.payload,
      id: Date.now() 
    };
    state.items.unshift(newProduct);
  },

    // เพิ่มจำนวนสินค้าตอนกด +
    addQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.stockQuantity < 10) {
        product.stockQuantity += 1;
      }
    },

    // ลดจำนวนสินค้า 
    removeQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.stockQuantity > 0) {
        product.stockQuantity -= 1;
      }
    },


      //ดึงคำค้นหาที่ผู้ใช้พิมพ์เข้ามา
        setSearch:(state,action:PayloadAction<string>)=>{
      state.search = action.payload
    },

    
    //เก็บผลลัพธ์การค้นหา
    setSearchResult:(state,action:PayloadAction<Product[]>)=>{
  state.searchResult = action.payload
},

    // คืนของเข้าสต็อก (ตอนลบจาก cart)
    returnQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.stockQuantity += action.payload.quantity;
      }
    },




    
    
  },

  

extraReducers: (builder) => {
  builder.addCase(fetchProducts.fulfilled, (state, action) => {

    const groupedArray = Object.keys(action.payload).map((key) => ({
      categoryName: key,
      products: action.payload[key]
    }));
    
    


    state.groupedProducts = groupedArray;

    
  });
  
}



});





export const {
  addProduct,
  addQuantity,
  removeQuantity,
  returnQuantity,
  setSearch,
  setSearchResult
} = productsSlice.actions;

export default productsSlice.reducer;