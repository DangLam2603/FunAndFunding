import axios from "axios";
const dashboardApiInstance = axios.create({
    baseURL: `https://localhost:7044/api/dashboard`,
});

export default dashboardApiInstance;
