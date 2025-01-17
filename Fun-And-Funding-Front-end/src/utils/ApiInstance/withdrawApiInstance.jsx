import axios from "axios";
const withdrawApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/withdraw-requests`,
});

export default withdrawApiInstace;
