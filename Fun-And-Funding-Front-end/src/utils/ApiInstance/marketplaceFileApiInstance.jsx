import axios from "axios";
const marketplaceFileApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/marketplace-files`,
});

export default marketplaceFileApiInstace;