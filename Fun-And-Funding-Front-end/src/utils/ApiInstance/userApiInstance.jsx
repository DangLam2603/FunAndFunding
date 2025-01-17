import axios from "axios";
const userApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/users`,
});

export default userApiInstace;
