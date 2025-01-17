import axios from "axios";

const reportApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/reports`,
});

export default reportApiInstance;
