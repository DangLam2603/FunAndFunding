import axios from "axios";
const cartApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/carts`,
});

export default cartApiInstace;