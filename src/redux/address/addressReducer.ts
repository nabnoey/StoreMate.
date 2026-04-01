import type { Address } from './../../types/address';
import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../../services/users.service";

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (data: Partial<Address>) => {
    const response = await UserService.addAddress(data);
    return response;   
  }
);



export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",
  async () => {
    const response = await UserService.fetchAllAddresses();
    return response;
  },
);

// แก้ไขที่อยู่
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }: { id: number; data: Partial<Address> }) => {
    const response = await UserService.updateAddress(id, data as any);
    return response;
  },
);



// ตั้งค่าที่อยู่เริ่มต้น (เพิ่มใหม่)
export const setDefaultAddressThunk = createAsyncThunk(
  "address/setDefaultAddress",
  async (id: number) => {
    await UserService.setDefaultAddress(id);
    return id;
  },
);


export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id: number) => {
    const response = await UserService.deleteAddress(id);
    return response;
  }
)

export const addAdressDefault = createAsyncThunk(
  "address/addAddressDefault",
  async (id: number) => {
    const response = await UserService.setDefaultAddress(id);
    return response;
  }
)

export const fetchAddressDefault = createAsyncThunk(
  "address/fetchAddressDefault",
  async () => {
    const response = await UserService.fetchAllAddresses();
    // const defaultAddress = response.find((addr: Address) => addr.isDefault);
    return response
  }
)

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [] as Address[],
    defaultAddress: null as Address | null,
    loading: false,
  },
  reducers: {},


  extraReducers: (builder) => {
    builder.addCase(fetchAllAddresses.fulfilled, (state, action) => {
      state.addresses = action.payload;
      state.defaultAddress = action.payload.find((addr: Address) => addr.isDefault) || null;
    });

    builder.addCase(addAddress.fulfilled, (state, action) => {
      state.addresses.push(action.payload);
      if (action.payload.isDefault) {
        state.defaultAddress = action.payload;
      }
    });

    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.meta.arg);
      if (state.defaultAddress?.id === action.meta.arg) {
        state.defaultAddress = null;
      }
    });

 builder.addCase(addAdressDefault.fulfilled, (state, action) => {
  const defaultId = action.payload.id; 


  state.addresses = state.addresses.map(addr => ({
    ...addr,
    isDefault: addr.id === defaultId,
  }));
  state.defaultAddress = action.payload;
});
  
  builder.addCase(fetchAddressDefault.fulfilled, (state, action) => {
    state.defaultAddress = action.payload;
  });
  }

});



export default addressSlice.reducer;
