import axios from "axios";
const authApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/authentication`,
});

export default authApiInstace;
