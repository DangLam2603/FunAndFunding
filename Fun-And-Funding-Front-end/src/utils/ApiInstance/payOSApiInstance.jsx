import axios from "axios";

const payOSApiInstance = axios.create({
  baseURL: 'https://localhost:7044/api/payos',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
  },
})

export default payOSApiInstance;