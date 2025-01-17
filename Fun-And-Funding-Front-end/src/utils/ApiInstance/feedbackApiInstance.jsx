import axios from "axios";
const feedbackApiInstace = axios.create({
    baseURL: `https://localhost:7044/api/feedbacks`,
});

export default feedbackApiInstace;