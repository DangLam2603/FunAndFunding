import axios from "axios";
const likeApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/likes`,
});

export default likeApiInstace;