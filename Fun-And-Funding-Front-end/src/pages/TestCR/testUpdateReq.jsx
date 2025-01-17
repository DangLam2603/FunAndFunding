import React,{useState} from 'react'
import axios from 'axios';
const TestUpdateReq = () => {
    const [milestones, setMilestones] = useState([
        {
          id: "",
          updateDate: "",
          content: "",
          requirementStatus: "",
          requirementFiles: [],
          addedFiles: [],
        },
      ]);
    
      // Handle input change for each milestone
      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          [name]: value,
        };
        setMilestones(updatedMilestones);
      };
    
      // Handle file change for addedFiles for each milestone
      const handleAddedFilesChange = (e, index) => {
        const files = Array.from(e.target.files);
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          addedFiles: files,
        };
        setMilestones(updatedMilestones);
      };
    
      // Add a new milestone form
      const handleAddMilestone = () => {
        setMilestones([
          ...milestones,
          {
            id: "",
            updateDate: "",
            content: "",
            requirementStatus: "",
            requirementFiles: [],
            addedFiles: [],
          },
        ]);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(milestones)
        // Prepare a list of milestone requests
        // Prepare FormData to simulate the List<ProjectMilestoneRequirementUpdateRequest>
    const formDataToSend = new FormData();

    milestones.forEach((milestone, milestoneIndex) => {
      formDataToSend.append(`request[${milestoneIndex}].Id`, milestone.id);
      formDataToSend.append(`request[${milestoneIndex}].UpdateDate`, milestone.updateDate);
      formDataToSend.append(`request[${milestoneIndex}].Content`, milestone.content);
      formDataToSend.append(`request[${milestoneIndex}].RequirementStatus`, milestone.requirementStatus);

      milestone.addedFiles.forEach((file, fileIndex) => {
        formDataToSend.append(
          `request[${milestoneIndex}].AddedFiles[${fileIndex}].Name`,
          file.name
        );
        formDataToSend.append(
          `request[${milestoneIndex}].AddedFiles[${fileIndex}].URL`,
          file
        );

        formDataToSend.append(`request[${milestoneIndex}].AddedFiles[${fileIndex}].Filetype`, 0);
      });
    });
    
        try {
          const response = await axios.put(
            "https://localhost:7044/api/ProjectMilestoneRequirement", // Replace with your API endpoint
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file upload
              },
            }
          );
    
          console.log("Response:", response.data);
          alert("Milestone updated successfully");
        } catch (error) {
          console.error("Error updating milestone:", error);
          alert("Failed to update milestone");
        }
      };
    
      return (
        <form onSubmit={handleSubmit}>
          {milestones.map((milestone, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3>Milestone {index + 1}</h3>
              <div>
                <label>Id:</label>
                <input
                  type="text"
                  name="id"
                  value={milestone.id}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
              <div>
                <label>Update Date:</label>
                <input
                  type="date"
                  name="updateDate"
                  value={milestone.updateDate}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
              <div>
                <label>Content:</label>
                <input
                  type="text"
                  name="content"
                  value={milestone.content}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
              <div>
                <label>Requirement Status:</label>
                <input
                  type="text"
                  name="requirementStatus"
                  value={milestone.requirementStatus}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
              <div>
                <label>Added Files:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAddedFilesChange(e, index)}
                />
              </div>
            </div>
          ))}
    
          <button type="button" onClick={handleAddMilestone}>
            Add Another Milestone
          </button>
          <br />
          <button type="submit">Update Milestones</button>
        </form>
      );
}

export default TestUpdateReq