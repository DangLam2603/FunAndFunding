import axios from "axios";
const notificationApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/notification`,
});

export default notificationApiInstance;