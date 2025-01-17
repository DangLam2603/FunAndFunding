import axios from "axios";
const chatApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/chats`,
});

export default chatApiInstace;
