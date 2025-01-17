import axios from "axios";
const requirementApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/requirements`,
});
export default requirementApiInstance;
