import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("_auth")

const categoryApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/categories`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
});

export default categoryApiInstace;