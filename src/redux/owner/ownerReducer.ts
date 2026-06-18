// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { ownerService } from "../../services/owner.service";
// import type {

//   UserRole,
//   OwnerState,
//   GetUserManagementParams,
//   UserManagementResponse,
// } from "../../types/owner";

// /** เรียงลำดับ: เจ้าของร้าน → พนักงาน → ผู้ใช้งาน */
// const ROLE_PRIORITY: Record<string, number> = {
//   OWNER: 0,
//   ADMIN: 0,
//   MODERATOR: 1,
//   USER: 2,
// };

// const initialState: OwnerState = {
//   users: [],
//   page: 0,
//   size: 5,
//   total: 0,
//   totalPages: 0,
//   loading: false,
//   error: null,
//   store: null,
// };
// export const getUserManagement = createAsyncThunk<
//   UserManagementResponse,
//   GetUserManagementParams
// >(
//   "owner/getUserManagement",
//   async ({ page, size, search }) => {
//     const res = await ownerService.getUserManagement(page, size, search);
//     return res;
//   }
// );

// export const getStore = createAsyncThunk("owner/getStore", async () => {
//   const res = await ownerService.getStore();
//   return res;
// });

// export const updateUserRole = createAsyncThunk(
//   "owner/updateUserRole",
//   async ({ userId, roleName }: { userId: number; roleName: UserRole }) => {
//     await ownerService.updateUserRole(userId, roleName);
//     return { userId, roleName };
//   }
// );

// export const suspendUser = createAsyncThunk(
//   "owner/suspendUser",
//   async (userId: number) => {
//     const res = await ownerService.suspendUser(userId);
//     return { userId, response: res };
//   }
// );

// export const activeUser = createAsyncThunk(
//   "owner/activeUser",
//   async (userId: number) => {
//     const res = await ownerService.activeUser(userId);
//     return { userId, response: res };
//   }
// );

// // export const updateStore = createAsyncThunk(
// //   "owner/updateStore",
// //   async ({
// //     storeId,
// //     data
// //   }: {
// //     storeId: number;
// //     data: Store;
// //   }) => {
// //     const res = await ownerService.updateStore(storeId, data);
// //     return res;
// //   }
// // )

// export const updateStore = createAsyncThunk(
//   "owner/updateStore",
//   async (data: import("../../types/owner").Store) => {
//     const res = await ownerService.updateStore(data);
//     return res;
//   }
// )


// const ownerSlice = createSlice({
//   name: "owner",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getUserManagement.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserManagement.fulfilled, (state, action) => {
//         state.loading = false;

//         const sortedUsers = [...(action.payload.data ?? [])].sort((a, b) => {
//           const normA = (a.role || "").toUpperCase().replace("ROLE_", "").trim();
//           const normB = (b.role || "").toUpperCase().replace("ROLE_", "").trim();
//           const priorityA = ROLE_PRIORITY[normA] ?? 99;
//           const priorityB = ROLE_PRIORITY[normB] ?? 99;
//           return priorityA - priorityB;
//         });
//         state.users = sortedUsers;

//         state.page = action.payload.page;
//         state.size = action.payload.size;
//         state.total = action.payload.total ?? 0;
//         const total = action.payload.total ?? 0;
//         const size = action.payload.size || 5;
//         state.totalPages = (action.payload as any).totalPages ?? Math.ceil(total / size);

//       })
//       .addCase(getUserManagement.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้";
//       })

//       .addCase(getStore.fulfilled, (state, action) => {
//         const storeData = { ...action.payload };

//         // If province is missing or empty but streetAddress contains it, try to parse
//         if (storeData.streetAddress && (!storeData.province || storeData.province === "")) {
//           const fullAddress = storeData.streetAddress;

//           const zipMatch = fullAddress.match(/\b(\d{5})\b/);
//           if (zipMatch) storeData.zipcode = zipMatch[1];

//           // Non-greedy matches looking ahead for the next expected keyword or end of string
//           const provMatch = fullAddress.match(/(?:จ\.|จังหวัด)\s*(.*?)(?=\s*(?:\d{5}|$))/);
//           if (provMatch) storeData.province = provMatch[1].trim();

//           const distMatch = fullAddress.match(/(?:อ\.|อำเภอ|เขต)\s*(.*?)(?=\s*(?:จ\.|จังหวัด|\d{5}|$))/);
//           if (distMatch) storeData.district = distMatch[1].trim();

//           const subMatch = fullAddress.match(/(?:ต\.|ตำบล|แขวง)\s*(.*?)(?=\s*(?:อ\.|อำเภอ|เขต|จ\.|จังหวัด|\d{5}|$))/);
//           if (subMatch) storeData.subdistrict = subMatch[1].trim();

//           // Clean up streetAddress by taking the substring before the first admin division
//           let streetAddrEnd = fullAddress.length;
//           const matchT = fullAddress.search(/(?:ต\.|ตำบล|แขวง)/);
//           if (matchT !== -1 && matchT < streetAddrEnd) streetAddrEnd = matchT;
//           const matchA = fullAddress.search(/(?:อ\.|อำเภอ|เขต)/);
//           if (matchA !== -1 && matchA < streetAddrEnd) streetAddrEnd = matchA;
//           const matchJ = fullAddress.search(/(?:จ\.|จังหวัด)/);
//           if (matchJ !== -1 && matchJ < streetAddrEnd) streetAddrEnd = matchJ;
//           const matchZ = fullAddress.search(/\b\d{5}\b/);
//           if (matchZ !== -1 && matchZ < streetAddrEnd) streetAddrEnd = matchZ;

//           storeData.streetAddress = fullAddress.substring(0, streetAddrEnd).trim();
//         }


//         state.store = storeData;
//       })



//       //       .addCase(updateStore.fulfilled, (state, action) => {
//       //   state.loading = false;

//       //   const updatedStore = action.payload?.data || action.payload;

//       //   if (updatedStore && updatedStore.storeName) {
//       //     state.store = updatedStore;
//       //   }
//       // })
//       .addCase(suspendUser.fulfilled, (state, action) => {
//         const { userId, response } = action.payload;
//         const user = state.users.find((u) => u.id === userId);
//         if (user) {
//           const updatedData = response?.data || response;
//           // API returns the updated user object or the state
//           if (updatedData && typeof updatedData.suspended === 'boolean') {
//             user.suspended = updatedData.suspended;
//           } else {
//             user.suspended = true;
//           }
//         }
//       })
//       .addCase(activeUser.fulfilled, (state, action) => {
//         const { userId, response } = action.payload;
//         const user = state.users.find((u) => u.id === userId);
//         if (user) {
//           const updatedData = response?.data || response;
//           if (updatedData && typeof updatedData.suspended === 'boolean') {
//             user.suspended = updatedData.suspended;
//           } else {
//             user.suspended = false;
//           }
//         }
//       })
//       .addCase(updateUserRole.fulfilled, (state, action) => {
//         const { userId, roleName } = action.payload;
//         const user = state.users.find((u) => u.id === userId);
//         if (user) {
//           user.role = roleName;
//         }
//       })

//       .addCase(updateStore.fulfilled, (state, action) => {
//         const updatedStore = action.payload?.data || action.payload;
//         if (updatedStore && updatedStore.storeName) {
//           state.store = updatedStore;
//         }
//       })

//   },
// });

// export default ownerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ownerService } from "../../services/owner.service";
import type {
  UserRole,
  OwnerState,
  GetUserManagementParams,
  UserManagementResponse,
} from "../../types/owner";

// ==========================================
// 1. CONSTANTS & UTILITIES
// ==========================================
const ROLE_PRIORITY: Record<string, number> = {
  OWNER: 0,
  ADMIN: 0,
  MODERATOR: 1,
  USER: 2,
};

const initialState: OwnerState = {
  users: [],
  page: 0,
  size: 5,
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  store: null,
};

/**
 * 📌 Helper Function สำหรับแกะที่อยู่ภาษาไทยออกจาก Street Address (ช่วยให้ Reducer คลีนขึ้น)
 */
const parseThaiAddress = (storeData: any) => {
  const fullAddress = storeData.streetAddress;
  if (!fullAddress || (storeData.province && storeData.province !== "")) {
    return storeData;
  }

  const updatedStore = { ...storeData };

  // 1. ค้นหารหัสไปรษณีย์
  const zipMatch = fullAddress.match(/\b(\d{5})\b/);
  if (zipMatch) updatedStore.zipcode = zipMatch[1];

  // 2. ค้นหา จังหวัด, อำเภอ/เขต, ตำบล/แขวง
  const provMatch = fullAddress.match(/(?:จ\.|จังหวัด)\s*(.*?)(?=\s*(?:\d{5}|$))/);
  if (provMatch) updatedStore.province = provMatch[1].trim();

  const distMatch = fullAddress.match(/(?:อ\.|อำเภอ|เขต)\s*(.*?)(?=\s*(?:จ\.|จังหวัด|\d{5}|$))/);
  if (distMatch) updatedStore.district = distMatch[1].trim();

  const subMatch = fullAddress.match(/(?:ต\.|ตำบล|แขวง)\s*(.*?)(?=\s*(?:อ\.|อำเภอ|เขต|จ\.|จังหวัด|\d{5}|$))/);
  if (subMatch) updatedStore.subdistrict = subMatch[1].trim();

  // 3. หั่นทำความสะอาดสายอักขระ streetAddress ให้เหลือแค่ที่อยู่บ้านเลขที่/ถนน
  let streetAddrEnd = fullAddress.length;
  const adminDivisionRegex = /(?:ต\.|ตำบล|แขวง|อ\.|อำเภอ|เขต|จ\.|จังหวัด|\b\d{5}\b)/;
  const matchIndex = fullAddress.search(adminDivisionRegex);
  
  if (matchIndex !== -1) {
    streetAddrEnd = matchIndex;
  }

  updatedStore.streetAddress = fullAddress.substring(0, streetAddrEnd).trim();
  return updatedStore;
};

// ==========================================
// 2. ASYNC THUNKS
// ==========================================
export const getUserManagement = createAsyncThunk<UserManagementResponse, GetUserManagementParams>(
  "owner/getUserManagement",
  async ({ page, size, search }) => {
    return await ownerService.getUserManagement(page, size, search);
  }
);

export const getStore = createAsyncThunk("owner/getStore", async () => {
  return await ownerService.getStore();
});

export const updateUserRole = createAsyncThunk(
  "owner/updateUserRole",
  async ({ userId, roleName }: { userId: number; roleName: UserRole }) => {
    await ownerService.updateUserRole(userId, roleName);
    return { userId, roleName };
  }
);

export const suspendUser = createAsyncThunk(
  "owner/suspendUser",
  async (userId: number) => {
    const res = await ownerService.suspendUser(userId);
    return { userId, response: res };
  }
);

export const activeUser = createAsyncThunk(
  "owner/activeUser",
  async (userId: number) => {
    const res = await ownerService.activeUser(userId);
    return { userId, response: res };
  }
);

export const updateStore = createAsyncThunk(
  "owner/updateStore",
  async (data: import("../../types/owner").Store) => {
    return await ownerService.updateStore(data);
  }
);

// ==========================================
// 3. SLICE
// ==========================================
const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET USER MANAGEMENT
      .addCase(getUserManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserManagement.fulfilled, (state, action) => {
        state.loading = false;

        // จัดเรียงลำดับ Role ลื่นขึ้นด้วยโครงสร้างที่คลีน
        state.users = [...(action.payload.data ?? [])].sort((a, b) => {
          const normA = (a.role || "").toUpperCase().replace("ROLE_", "").trim();
          const normB = (b.role || "").toUpperCase().replace("ROLE_", "").trim();
          return (ROLE_PRIORITY[normA] ?? 99) - (ROLE_PRIORITY[normB] ?? 99);
        });

        state.page = action.payload.page;
        state.size = action.payload.size;
        state.total = action.payload.total ?? 0;
        
        const total = action.payload.total ?? 0;
        const size = action.payload.size || 5;
        state.totalPages = (action.payload as any).totalPages ?? Math.ceil(total / size);
      })
      .addCase(getUserManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้";
      })

      // GET STORE
      .addCase(getStore.fulfilled, (state, action) => {
        // 📌 เรียกใช้ Helper Function เพื่อแกะที่อยู่ โค้ดตรงนี้จะสั้นลงเหลือบรรทัดเดียวเลย!
        state.store = parseThaiAddress(action.payload);
      })

      // SUSPEND USER
      .addCase(suspendUser.fulfilled, (state, action) => {
        const { userId, response } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          const updatedData = response?.data || response;
          user.suspended = updatedData && typeof updatedData.suspended === 'boolean' 
            ? updatedData.suspended 
            : true;
        }
      })

      // ACTIVE USER
      .addCase(activeUser.fulfilled, (state, action) => {
        const { userId, response } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          const updatedData = response?.data || response;
          user.suspended = updatedData && typeof updatedData.suspended === 'boolean' 
            ? updatedData.suspended 
            : false;
        }
      })

      // UPDATE USER ROLE
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, roleName } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.role = roleName;
        }
      })

      // UPDATE STORE
      .addCase(updateStore.fulfilled, (state, action) => {
        const updatedStore = action.payload?.data || action.payload;
        if (updatedStore && updatedStore.storeName) {
          state.store = updatedStore;
        }
      });
  },
});

export default ownerSlice.reducer;