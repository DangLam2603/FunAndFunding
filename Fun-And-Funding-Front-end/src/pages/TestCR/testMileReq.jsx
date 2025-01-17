import React, { useState } from 'react';
import axios from 'axios';

const TestMileReq = () => {
  const [formDataArray, setFormDataArray] = useState([
    {
      requirementStatus: '',
      updateDate: new Date(),
      content: '',
      projectMilestoneId: '',
      requirementId: '',
      requirementFiles: []
    }
  ]);

  const handleFileChange = (e, index) => {
    const updatedFormData = [...formDataArray];
    updatedFormData[index].requirementFiles = e.target.files;
    setFormDataArray(updatedFormData);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formDataArray];
    updatedFormData[index][name] = value;
    setFormDataArray(updatedFormData);
  };

  const addNewRequirement = () => {
    setFormDataArray([
      ...formDataArray,
      {
        requirementStatus: '',
        updateDate: new Date(),
        content: '',
        projectMilestoneId: '',
        requirementId: '',
        requirementFiles: []
      }
    ]);
  };

  const submitData = async () => {
    const url = 'https://localhost:7044/api/ProjectMilestoneRequirement'; // Replace with your API endpoint

    const requestData = new FormData();
    formDataArray.forEach((formData, index) => {
      requestData.append(`request[${index}].requirementStatus`, formData.requirementStatus);
      requestData.append(`request[${index}].updateDate`, formData.updateDate.toISOString()); // Convert date to ISO string
      requestData.append(`request[${index}].content`, formData.content);
      requestData.append(`request[${index}].projectMilestoneId`, formData.projectMilestoneId);
      requestData.append(`request[${index}].requirementId`, formData.requirementId);

      // Append files for each item
      if (formData.requirementFiles?.length > 0) {
        Array.from(formData.requirementFiles).forEach((file, fileIndex) => {
          requestData.append(`request[${index}].requirementFiles[${fileIndex}].URL`, file);
          requestData.append(`request[${index}].requirementFiles[${fileIndex}].Name`, file.name);
          requestData.append(`request[${index}].requirementFiles[${fileIndex}].Filetype`, 0); // Adjust the file type if necessary
        });
      }
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const response = await axios.post(url, requestData, config);
      if (response.status === 200) {
        alert('Milestone requirements created successfully!');
      } else {
        alert('Failed to create milestone requirements.');
      }
    } catch (error) {
      console.error('Error while creating milestone requirements', error);
      alert('An error occurred.');
    }
  };

  return (
    <div>
      <h3>Create Milestone Requirements</h3>

      {formDataArray.map((formData, index) => (
        <form key={index}>
          <div>
            <label>Requirement Status:</label>
            <input
              type="text"
              name="requirementStatus"
              value={formData.requirementStatus}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>

          <div>
            <label>Content:</label>
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>

          <div>
            <label>Project Milestone ID:</label>
            <input
              type="text"
              name="projectMilestoneId"
              value={formData.projectMilestoneId}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>

          <div>
            <label>Requirement ID:</label>
            <input
              type="text"
              name="requirementId"
              value={formData.requirementId}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>

          <div>
            <label>Requirement Files:</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, index)}
            />
          </div>

          <hr />
        </form>
      ))}

      <button type="button" onClick={addNewRequirement}>
        Add Another Requirement
      </button>

      <button type="button" onClick={submitData}>
        Submit
      </button>
    </div>
  );
};

export default TestMileReq;