import React, { useRef } from "react";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const UploadButton = ({ onFilesUploaded }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Open the file input when the button is clicked
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    onFilesUploaded(newFiles); // Send files to parent component
  };

  return (
    <div>
      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        onClick={handleUploadClick}
        startIcon={<AddCircleIcon />}
      >
        Upload Files
      </Button>
    </div>
  );
};

export default UploadButton;