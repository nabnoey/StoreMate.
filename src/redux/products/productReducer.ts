import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, CategoryGroup } from '../../types/product';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "../../services/product.service";

type ProductState = {
  items: Product[]
  groupedProducts: CategoryGroup[]
  search: string
  searchResult: Product[]
  searchSuggestion: Product[]
  categories: string[]
  isLoading: boolean;
}

const initialState: ProductState = {
  items: [],
  groupedProducts: [],
  search: "",
  searchResult: [],
  searchSuggestion: [],
  categories: [],
  isLoading: false
}

const updateStockInGrouped = (state: ProductState, id: number, change: number) => {
  state.groupedProducts.forEach(group => {
    const product = group.products.find(p => Number(p.id) === Number(id));
    if (product) {
      const newStock = product.stockQuantity + change;
      product.stockQuantity = newStock < 0 ? 0 : newStock;
    }
  });
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const response = await ProductService.getAllCategories();
  return response; 
});

<<<<<<< HEAD
export const search = createAsyncThunk("products/search", async (keyword: string) => {
  const response = await ProductService.searchProducts(keyword);
  return response;
})
=======
export const search = createAsyncThunk(
  "products/search", 
  async ({ keyword, category }: { keyword: string,category:string }) => {
    const response = await ProductService.searchProducts(keyword,category);
    return response;
  }
);
>>>>>>> feature/redux

export const fetchSearchSuggestion = createAsyncThunk(
  "products/fetchSearchSuggestion",
  async (keyword: string) => {
    const response = await ProductService.searchProducts(keyword)
    return response.slice(0, 5)
  }
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const newProduct = {
        ...action.payload,
        id: Date.now()
      };
      state.items.unshift(newProduct);
    },

    addQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.stockQuantity += 1;
      }
      updateStockInGrouped(state, action.payload, 1);
    },

    removeQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.stockQuantity > 0) {
        product.stockQuantity -= 1;
      }
      updateStockInGrouped(state, action.payload, -1);
    },

    returnQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.stockQuantity += action.payload.quantity;
      }
      updateStockInGrouped(state, action.payload.id, action.payload.quantity);
    },
  },

  // แก้ไข extraReducers ตรงนี้ครับ (แยก addCase แต่ละอันออกจากกันให้ชัดเจน)
  extraReducers: (builder) => {
<<<<<<< HEAD
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const groupedArray = Object.keys(action.payload).map((key) => ({
          categoryName: key,
          products: action.payload[key]
        }));
        state.groupedProducts = groupedArray;
        state.items = groupedArray.flatMap((group) => group.products); 
      })
      
      .addCase(search.fulfilled, (state, action) => {
        state.search = action.meta.arg; // คำค้นหาที่พิมพ์ส่งไปตั้งแต่แรก
        state.searchResult = action.payload.data; // รายการสินค้าที่หลังบ้านหาเจอและส่งกลับมาให้
      })
=======
  builder.addCase(fetchProducts.fulfilled, (state, action) => {
 
    const groupedArray = Object.keys(action.payload).map((key) => ({
      categoryName: key,
      products: action.payload[key]
    })); //ผลลัพธ์ [{soap:[...]},]
    
    state.groupedProducts = groupedArray;
    state.items = groupedArray.flatMap((group) => group.products); 
   

  });

   builder.addCase(search.fulfilled,(state,action) => {
  
     state.search = action.meta.arg.keyword //คำค้นหาที่พิมพ์ส่งไปตั้งแต่แรก
    state.searchResult = action.payload.data //รายการสินค้าที่หลังบ้านหาเจอและส่งกลับมาให้

    
    
  })
  
}
});



>>>>>>> feature/redux

      .addCase(fetchSearchSuggestion.fulfilled, (state, action) => {
        state.searchSuggestion = action.payload;
      });
  } 
}); 

export const {
  addProduct,
  addQuantity,
  removeQuantity,
  returnQuantity
} = productsSlice.actions;

export default productsSlice.reducer;