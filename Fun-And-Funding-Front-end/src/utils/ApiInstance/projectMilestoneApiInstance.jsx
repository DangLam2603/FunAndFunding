import axios from "axios";
const projectMilestoneApiInstace = axios.create({
  baseURL: `https://localhost:7044/api/project-milestones`,
});

export default  projectMilestoneApiInstace;