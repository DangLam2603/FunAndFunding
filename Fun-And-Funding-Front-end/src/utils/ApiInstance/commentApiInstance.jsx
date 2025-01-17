import axios from "axios";
const commentApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/comments`,
});

export default commentApiInstace;