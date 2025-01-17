import axios from "axios";
const contractApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/creator-contracts`,
});

export default contractApiInstace;
