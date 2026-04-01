declare module "thai-address-database" {
  const data: {
    province: string;
    district: string;
    subdistrict: string;
    zipcode: string;
  }[];

  export default data;
}