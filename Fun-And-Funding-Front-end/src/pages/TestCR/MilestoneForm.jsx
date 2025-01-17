import React, { useEffect, useState } from "react";
import axios from "axios";
import { checkAvailableMilestone } from "../../utils/Hooks/checkAvailableMilestone";
import { get } from "react-hook-form";
import projectMilestoneApiInstace from "../../utils/ApiInstance/projectMilestoneApiInstance";
const MilestoneForm = () => {
  const sampleProjectId = 'DE4B0C83-8E67-4E5A-9F64-4C7A574F9654'
  const [milestone, setMilestone] = useState(null);
  const [formDataArray, setFormDataArray] = useState([]); // Handle all form data in an array
  const [files, setFiles] = useState({}); // Store multiple files by requirement ID
  const [createdMilestoneId, setCreatedMilestoneId] = useState(null); // Store the created milestone ID
  const [isEditing, setIsEditing] = useState(false);

  const fetchFixedMilestone = async () => {
    axios
      .get("https://localhost:7044/api/milestone/group-latest-milestone")
      .then((response) => {
        if (response.data._isSuccess) {
          const milestoneData = response.data._data[0];
          setMilestone(milestoneData);
          console.log(milestoneData);
          // Initialize the formDataArray based on the requirements
          const initialFormData = milestoneData.requirements.map((req) => ({
            requirementId: req.id,
            content: "",
            requirementStatus: 0, // Default status
            updateDate: new Date(),
            milestoneId: milestoneData.id,
            fundingProjectId: sampleProjectId,
            requirementFiles: [],
          }));
          setFormDataArray(initialFormData);
          getMilestoneData(milestoneData.id);
        }
      })
      .catch((error) => console.error("Error fetching milestone:", error));
  }
  //check available project milestone
  const getMilestoneData = async (id) => {
    try {
      const data = await checkAvailableMilestone(sampleProjectId, id);

      console.log(data);
    } catch (error) {
      console.error("Error fetching milestone data:", error);
    }
  };
  // Fetch the latest milestone with its requirements
  useEffect(() => {
    fetchFixedMilestone();
    getMilestoneData();
  }, []);

  // Handle input changes for a specific requirement
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedFormData = [...formDataArray];
    updatedFormData[index].content = value;
    setFormDataArray(updatedFormData);
  };

  // Handle file selection for a specific requirement
  const handleFileChange = (e, index) => {
    const selectedFiles = Array.from(e.target.files);
    const updatedFormData = [...formDataArray];
    updatedFormData[index].requirementFiles = selectedFiles;
    setFormDataArray(updatedFormData);
  };
  // Get created milestone id
  const getCreatedMilestoneId = async (id) => {
    try {
      const result = projectMilestoneApiInstace.get(`/${id}`)
        .then((res) => console.log(res.data));
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching milestone data:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all the requirements from formDataArray to the request
    formDataArray.forEach((formData, i) => {
      data.append(`request[${i}].RequirementStatus`, formData.requirementStatus);
      data.append(`request[${i}].UpdateDate`, formData.updateDate.toISOString());
      data.append(`request[${i}].Content`, formData.content);
      data.append(`request[${i}].MilestoneId`, formData.milestoneId);
      data.append(`request[${i}].FundingProjectId`, formData.fundingProjectId);
      data.append(`request[${i}].RequirementId`, formData.requirementId);

      // Append each file associated with this requirement
      formData.requirementFiles.forEach((file, fileIndex) => {
        data.append(`request[${i}].RequirementFiles[${fileIndex}].URL`, file);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Name`, file.name);
        data.append(`request[${i}].RequirementFiles[${fileIndex}].Filetype`, 0); // Example filetype
      });
    });

    // Submit the form data via an API call
    try {
      await axios.post(
        "https://localhost:7044/api/project-milestone-requirements",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      ).then((res) => {
        getCreatedMilestoneId(res.data._data.id);
        console.log(res.data)
        // console.log(createdMilestoneId);
        setCreatedMilestoneId(createdMilestoneId);

      });
      alert("Requirements submitted successfully!");
    } catch (error) {
      console.error("Error submitting requirements:", error);
      alert("Failed to submit requirements.");
    }
  };

  if (!milestone) return <p>Loading milestone...</p>;
  // if(createdMilestoneId){
  //   console.log(createdMilestoneId)
  // }
  return (
    <div>
      <h1>{milestone.milestoneName}</h1>
      <p>{milestone.description}</p>

      <form onSubmit={handleSubmit}>
        {milestone.requirements.map((req, index) => (
          <div key={req.id} style={{ marginBottom: "20px" }}>
            <h3>{req.title}</h3>
            <p>{req.description}</p>

            <input
              type="text"
              placeholder="Enter content"
              value={formDataArray[index]?.content || ""}
              onChange={(e) => handleInputChange(e, index)}
            />

            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, index)}
            />
          </div>
        ))}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default MilestoneForm;