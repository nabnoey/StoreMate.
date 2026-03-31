import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../../services/users.service";
import type { Address } from "../../types/address";

// ดึงที่อยู่ทั้งหมด
export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",
  async () => {
    const response = await UserService.fetchAllAddresses();
    return response;
  },
);

// เพิ่มที่อยู่ใหม่
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (data: Partial<Address>) => {
    const response = await UserService.addAddress(data);
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

// ลบที่อยู่
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id: number) => {
    await UserService.deleteAddress(id);
    return id;
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

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [] as Address[],
    defaultAddress: null as Address | null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllAddresses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllAddresses.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload || [];
      state.defaultAddress =
        state.addresses.find((addr) => addr.isDefault) || null;
    });

    builder.addCase(addAddress.fulfilled, (state, action) => {
      state.addresses.push(action.payload);
      if (action.payload.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
        state.defaultAddress = action.payload;
      }
    });

    builder.addCase(updateAddress.fulfilled, (state, action) => {
      const index = state.addresses.findIndex(
        (addr) => addr.id === action.payload.id,
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      if (action.payload.isDefault) {
        state.defaultAddress = action.payload;
      }
    });

    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload,
      );
      if (state.defaultAddress?.id === action.payload) {
        state.defaultAddress =
          state.addresses.length > 0 ? state.addresses[0] : null;
      }
    });

    builder.addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
      state.addresses.forEach((addr) => {
        if (addr.id === action.payload) {
          addr.isDefault = true;
          state.defaultAddress = addr;
        } else {
          addr.isDefault = false;
        }
      });
    });
  },
});

export default addressSlice.reducer;
