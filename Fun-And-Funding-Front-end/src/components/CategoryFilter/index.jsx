import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState } from "react";

const SortDropdown = ({ options, onValueChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(value);

    const ids = value?.map((category) => category.id);

    onValueChange(ids);
  };

  return (
    <FormControl
      sx={{
        minWidth: "12rem",
        height: "2.5rem",
        ".MuiOutlinedInput-notchedOutline": { border: "0 !important" },
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: "0 !important",
        },
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: "0 !important",
          },
      }}
    >
      <Select
        multiple
        value={selectedOptions}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <Typography>Filter</Typography>;
          } else if (selected.length === 1) {
            return (
              <Typography
                sx={{
                  color: "#1BAA64",
                  fontWeight: "600",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {selected[0].name}
              </Typography>
            );
          } else {
            return (
              <Typography
                sx={{
                  color: "#1BAA64",
                  fontWeight: "600",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                Multiple
              </Typography>
            );
          }
        }}
        sx={{
          backgroundColor: "#EAEAEA",
          border: "none !important",
          display: "flex",
          alignItems: "center",
          "& .MuiSelect-select": {
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            height: "2.5rem",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          },
          "&:hover": {
            backgroundColor: alpha("#EAEAEA", 0.85),
          },
          height: "2.5rem",
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              minWidth: "12rem",
              marginTop: "0.5rem",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            value={option}
            sx={{
              backgroundColor: selectedOptions.includes(option)
                ? "#1BAA64 !important"
                : "initial",
            }}
          >
            {selectedOptions.find((c) => c.name === option.name) ? (
              <Typography
                sx={{
                  color: "#F5F7F8 !important",
                  fontWeight: "500",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {option.name}
              </Typography>
            ) : (
              <Typography
                sx={{
                  textOverflow: "ellipsis",
                  fontWeight: "400",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {option.name}
              </Typography>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortDropdown;
