import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import chatApiInstace from "../../../utils/ApiInstance/chatApiInstance";

//custom
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#1BAA64",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1BAA64 !important",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: "1rem",
  },
}));

function SearchBarChat({ onSearchResults, userId }) {
  //variables
  //token
  const token = Cookies.get("_auth");

  //hooks
  const [searchValue, setSearchValue] = useState("");

  //functions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim()) {
      // Call the API to search for users
      chatApiInstace
        .get(`/users/${userId}?name=${searchValue.trim()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data._data;
          onSearchResults(data); // Pass the data back to the parent component
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      onSearchResults([]); // Clear results when input is empty
    }
  };

  return (
    <div>
      <CustomTextField
        variant="outlined"
        value={searchValue}
        fullWidth
        placeholder="Search user"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                <SearchIcon style={{ color: "#2F3645" }} />
              </InputAdornment>
            ),
          },
        }}
        onChange={handleSearchChange}
      />
    </div>
  );
}

export default SearchBarChat;
