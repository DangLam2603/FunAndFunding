import axios from "axios";
const marketplaceProjectApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/marketplace-projects`,
});

export default marketplaceProjectApiInstace;