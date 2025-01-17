import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("_auth")

const withdrawRequestApiInstance = axios.create({
  baseURL: 'https://localhost:7044/api/withdraw-requests',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
    'Authorization': `Bearer ${token}`
  },
})

export default withdrawRequestApiInstance