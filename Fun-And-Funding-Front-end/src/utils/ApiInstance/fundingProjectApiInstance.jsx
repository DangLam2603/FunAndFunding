import axios from "axios";
const fundingProjectApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/funding-projects`,
});

export default fundingProjectApiInstace;
