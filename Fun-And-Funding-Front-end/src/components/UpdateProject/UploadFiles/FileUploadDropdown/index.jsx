import React from "react";
import { Menu, List, ListItem, ListItemText, IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FileUploadDropdown = ({ uploadedFiles, requirementFiles, anchorEl, onClose, onRemoveFile }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <List>
        {requirementFiles.length > 0 && (
          <MenuItem disabled>
            <strong>Existing Files</strong>
          </MenuItem>
        )}
        {requirementFiles.map((file, index) => (
          <ListItem
            key={`requirement-${index}`}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onRemoveFile(index, "requirementFiles")}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={file.name} />
          </ListItem>
        ))}

        {uploadedFiles.length > 0 && (
          <MenuItem disabled>
            <strong>Newly Added Files</strong>
          </MenuItem>
        )}
        {uploadedFiles.map((file, index) => (
          <ListItem
            key={`added-${index}`}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onRemoveFile(index, "addedFiles")}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={file.name} />
          </ListItem>
        ))}

        {requirementFiles.length === 0 && uploadedFiles.length === 0 && (
          <MenuItem>No files uploaded</MenuItem>
        )}
      </List>
    </Menu>
  );
};

export default FileUploadDropdown;