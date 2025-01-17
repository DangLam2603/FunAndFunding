import axios from "axios";
const couponApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/coupons`,
});

export default couponApiInstace;
