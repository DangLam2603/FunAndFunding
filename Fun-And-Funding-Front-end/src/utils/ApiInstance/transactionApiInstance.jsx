import axios from "axios";
const transactionApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/transactions`,
});

export default transactionApiInstace;
