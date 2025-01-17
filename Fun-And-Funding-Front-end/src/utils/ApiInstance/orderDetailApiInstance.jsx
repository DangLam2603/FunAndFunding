import axios from "axios";
const orderDetailApiInstance = axios.create({
    baseURL: `https://localhost:7044/api/order-details`,
});

export default orderDetailApiInstance;