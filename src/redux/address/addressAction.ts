import { ADD_ADDRESS, DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from "./actionTypes";
import type { AddressItem } from "./addressInitialState";

// --- Type Definitions ---

export type AddAddressAction = {
  type: typeof ADD_ADDRESS;
  payload: AddressItem; // เวลาเพิ่ม ต้องส่ง Object ที่อยู่มาทั้งก้อน
};

export type DeleteAddressAction = {
  type: typeof DELETE_ADDRESS;
  payload: string; // เวลาลบ ส่งมาแค่ ID ก็พอ
};

export type SetDefaultAddressAction = {
  type: typeof SET_DEFAULT_ADDRESS;
  payload: string; // เวลาตั้งค่าเริ่มต้น ส่งมาแค่ ID ก็พอ
};

// รวม Type ทั้งหมดเข้าด้วยกัน (เพื่อให้ Reducer เอาไปเช็คได้ง่ายๆ)
export type AddressAction = AddAddressAction | DeleteAddressAction | SetDefaultAddressAction;