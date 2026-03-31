import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../../services/users.service";
import type { Address } from "../../types/address";


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
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [] as Address[],
    defaultAddress: null as Address | null,
  },
  reducers: {},
});


export default addressSlice.reducer;






