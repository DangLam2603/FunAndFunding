import axios from "axios";
const systemWalletApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/system-wallet`,
});

export default systemWalletApiInstace;