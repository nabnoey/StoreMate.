import api from "./api";

const getUserManagement = async (
  page?: number,
  size?: number,
) => {
  const res = await api.get(`${import.meta.env.VITE_OWNER_API}/users`, {
    params: { page, size },
  });
  return res.data;
};

const getStore = async () => {
  const res = await api.get(`${import.meta.env.VITE_OWNER_API}/store`);
  return res.data

  
}

// const updateStore = async (data: any) => {
//   // Combine address fields into a single streetAddress string for the backend
//   let fullAddress = data.streetAddress || "";
//   if (data.subdistrict) fullAddress += ` ต.${data.subdistrict}`;
//   if (data.district) fullAddress += ` อ.${data.district}`;
//   if (data.province) fullAddress += ` จ.${data.province}`;
//   if (data.zipcode) fullAddress += ` ${data.zipcode}`;

//   const formData = new FormData();

// const requestPayload = {
//   storeName: data.storeName,
//   phone: data.phone,
//   streetAddress: data.streetAddress,
//   email: data.email,

//   province: data.province,
//   district: data.district,
//   subdistrict: data.subdistrict,
//   zipcode: data.zipcode,
// };

// formData.append(
//   "data",
//   JSON.stringify(requestPayload)
// );

// const imageFile = data.promotionImage || data.image;

// if (imageFile instanceof File) {
//   formData.append("image", imageFile);
// }
// }

// ในไฟล์ src/services/owner.service.ts

// const updateStore = async (data: any) => {
//   const formData = new FormData();
  
//   if (data.storeName) formData.append("storeName", data.storeName);
//   if (data.phone) formData.append("phone", data.phone);
//   if (data.email) formData.append("email", data.email); // ส่งอีเมลไปแล้ว
  
//   // 🟢 จุดที่แก้: ส่งแยกฟิลด์ให้ Backend ไปเลย ไม่ต้องเอามารวมกันเป็นก้อนเดียวแล้ว!
//   if (data.streetAddress) formData.append("streetAddress", data.streetAddress);
//   if (data.province) formData.append("province", data.province);
//   if (data.district) formData.append("district", data.district);
//   if (data.subdistrict) formData.append("subdistrict", data.subdistrict);
//   if (data.zipcode) formData.append("zipcode", data.zipcode);
  
//   // จัดการเรื่องไฟล์รูปภาพ
//   const imageFile = data.promotionImage || data.image;
//   if (imageFile instanceof File) {
//     formData.append("image", imageFile); 
//     // 💡 คำแนะนำ: ถ้าเกิดเซฟแล้วรูปยังเป็น null อีก ให้ถามเพื่อน Backend ว่าช่องรับรูปชื่อ "image" หรือ "promotionImage" 
//     // ถ้าเป็น promotionImage ให้เปลี่ยนคำว่า "image" ในวงเล็บด้านบนเป็น "promotionImage" แทนนะครับ
//   }

//   const res = await api.put(`${import.meta.env.VITE_OWNER_API}/store/${data.id}`, formData);
//   return res.data;
// }


// const updateStore = async (data: any) => {
//   const formData = new FormData();

//   const requestPayload = {
//     storeName: data.storeName,
//     phone: data.phone,
//     streetAddress: data.streetAddress,
//     email: data.email,
//     province: data.province,
//     district: data.district,
//     subdistrict: data.subdistrict,
//     zipcode: data.zipcode,
//   };

//   formData.append("data", JSON.stringify(requestPayload));

//   const imageFile = data.promotionImage || data.image;

//   if (imageFile instanceof File) {
//     formData.append("image", imageFile);
//   }

//   console.log([...formData.entries()]);

//   const res = await api.put(
//     `${import.meta.env.VITE_OWNER_API}/store/${data.id}`,
//     formData
//   );

//   return res.data;
// };

const updateStore = async (data: any) => {
  const formData = new FormData();
  
  // ส่งข้อมูลหลัก
  if (data.storeName) formData.append("storeName", data.storeName);
  if (data.phone) formData.append("phone", data.phone);
  if (data.email) formData.append("email", data.email);
  
  // ส่งที่อยู่แยกฟิลด์ (ต้องส่งแยกตามที่เพื่อน Backend ทำระบบมา)
  if (data.streetAddress) formData.append("streetAddress", data.streetAddress);
  if (data.province) formData.append("province", data.province);
  if (data.district) formData.append("district", data.district);
  if (data.subdistrict) formData.append("subdistrict", data.subdistrict);
  if (data.zipcode) formData.append("zipcode", data.zipcode);
  
  // ส่งรูปภาพ
  const imageFile = data.promotionImage || data.image;
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  const res = await api.put(`${import.meta.env.VITE_OWNER_API}/store/${data.id}`, formData);
  return res.data;
};

const updateUserRole = async (userId: number, roleName: string) => {
  const res = await api.put(`${import.meta.env.VITE_OWNER_API}/users/${userId}/roles`, { roleName });
  return res.data;
};

const suspendUser = async (userId: number) => {
  const res = await api.put(`${import.meta.env.VITE_OWNER_API}/users/${userId}/suspend`);
  return res.data;

}

const activeUser = async (userId: number) => {
  const res = await api.put(`${import.meta.env.VITE_OWNER_API}/users/${userId}/activate`);
  return res.data;

}



export const ownerService = {
  getUserManagement,
  getStore,
  updateStore,
  updateUserRole,
  suspendUser,
  activeUser,
 

};