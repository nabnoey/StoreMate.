
export const parseThaiAddress = (storeData: any) => {
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