import thai from "thai-address-database";


// จังหวัด 
export const getProvinces = () => {
  return [...new Set(thai.map((item: any) => item.province))];
};

// อำเภอ 
export const getDistricts = (province: string) => {
  if (!province) return [];

  return [
    ...new Set(
      thai
        .filter((item: any) => item.province === province)
        .map((item: any) => item.district)
    ),
  ];
};

// ตำบล 
export const getSubDistricts = (province: string, district: string) => {
  if (!province || !district) return [];

  return [
    ...new Set(
      thai
        .filter(
          (item: any) =>
            item.province === province &&
            item.district === district
        )
        .map((item: any) => item.subdistrict)
    ),
  ];
};

//zipcode
export const getZipcode = (
  province: string,
  district: string,
  subdistrict: string
) => {
  const found = thai.find(
    (item: any) =>
      item.province === province &&
      item.district === district &&
      item.subdistrict === subdistrict
  );

  return found ? found.zipcode : "";
};