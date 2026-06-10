import api from "./api";

const getUserManagement = async (
  page?: number,
  size?: number,
  keyword?: string
) => {
  const res = await api.get(`${import.meta.env.VITE_OWNER_API}/users`, {
    params: { page, size, keyword, sort: "role,asc" },
  });
  return res.data;
};

const getStore = async () => {
  const res = await api.get(`${import.meta.env.VITE_OWNER_API}/store`);
  return res.data
}

const updateStore = async (data: any) => {
  // Combine address fields into a single streetAddress string for the backend
  let fullAddress = data.streetAddress || "";
  if (data.subdistrict) fullAddress += ` ต.${data.subdistrict}`;
  if (data.district) fullAddress += ` อ.${data.district}`;
  if (data.province) fullAddress += ` จ.${data.province}`;
  if (data.zipcode) fullAddress += ` ${data.zipcode}`;

  const formData = new FormData();
  if (data.storeName) formData.append("storeName", data.storeName);
  if (data.phone) formData.append("phone", data.phone);
  if (fullAddress) formData.append("streetAddress", fullAddress.trim());
  if (data.email) formData.append("email", data.email);
  
  const imageFile = data.promotionImage || data.image;
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  const res = await api.put(`${import.meta.env.VITE_OWNER_API}/store/${data.id}`, formData);
  return res.data;
}

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