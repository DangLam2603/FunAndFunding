import axios from "axios";
const packageBackerApiInstance = axios.create({
    baseURL: `https://localhost:7044/api/package-backers`,
});

export default packageBackerApiInstance;