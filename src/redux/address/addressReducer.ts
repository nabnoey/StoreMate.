import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../../services/users.service";
import type { AddressRequest, AddressResponse } from "../../types/address";
export const addAddress = createAsyncThunk<
  AddressResponse,
  AddressRequest
>(
  "address/addAddress",
  async (data) => {
    const response = await UserService.addAddress(data);
    return response;
  }
);

export const fetchAllAddresses = createAsyncThunk<
  AddressResponse[]
>(
  "address/fetchAllAddresses",
  async () => {
    const response = await UserService.fetchAllAddresses();
    return response;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [] as AddressResponse[],
    defaultAddress: null as AddressResponse | null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(addAddress.fulfilled, (state, action) => {
      state.addresses.push(action.payload);
    });

    builder.addCase(fetchAllAddresses.fulfilled, (state, action) => {
      state.addresses = action.payload;
    });
  },
});

export default addressSlice.reducer;