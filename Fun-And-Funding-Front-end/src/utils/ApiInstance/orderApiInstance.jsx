import axios from "axios";
const orderApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/orders`,
});

export default orderApiInstace;