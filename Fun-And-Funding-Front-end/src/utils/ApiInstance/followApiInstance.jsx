import axios from "axios";
const followApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/follow`,
});

export default followApiInstace;