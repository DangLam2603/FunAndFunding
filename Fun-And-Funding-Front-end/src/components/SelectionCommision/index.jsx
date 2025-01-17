/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";

export default function SelectWithIcon({
  label = "Select",
  id = "outlined-adornment-select",
  startIcon = null,
  iconStyles = {},
  formControlStyles = {},
  value,
  onChange,
  options = [],
  name,
}) {
  return (
    <FormControl sx={{ m: 1, ...formControlStyles }} fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        startAdornment={
          startIcon && (
            <InputAdornment position="start">
              <span style={iconStyles}>{startIcon}</span>
            </InputAdornment>
          )
        }
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
