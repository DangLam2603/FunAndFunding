import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("_auth")

const projectMilestoneBackerApiInstance = axios.create({
  baseURL: `https://localhost:7044/api/project-milestone-backer`,
  'Authorization': `Bearer ${token}`
});

export default projectMilestoneBackerApiInstance;