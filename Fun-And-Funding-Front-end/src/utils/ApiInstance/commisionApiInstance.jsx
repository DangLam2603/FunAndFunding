import axios from "axios";

const commissionApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/commision-fees`,
});

export default commissionApiInstance;
