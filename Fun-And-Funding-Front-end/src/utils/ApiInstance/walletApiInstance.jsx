import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("_auth")

const walletApiInstance = axios.create({
  baseURL: 'https://localhost:7044/api/wallets',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
    'Authorization': `Bearer ${token}`
  },
})

export default walletApiInstance