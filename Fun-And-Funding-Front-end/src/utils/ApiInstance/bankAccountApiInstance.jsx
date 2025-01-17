import axios from "axios";
const bankAccountApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/bank-accounts`,
});

export default bankAccountApiInstance;
