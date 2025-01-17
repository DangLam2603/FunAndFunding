import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import "./index.css";

const Search = styled("div")(() => ({
    borderRadius: "0.25rem",
    backgroundColor: "#EAEAEA",
    position: "relative",
    width: "100%",
    height: "2.5rem",
    "&:hover": {
        backgroundColor: alpha("#EAEAEA", 0.85),
    },
}));

const SearchIconWrapper = styled("div")(() => ({
    height: "100%",
    position: "absolute",
    padding: "0 10px",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const CloseIconWrapper = styled("div")(() => ({
    position: "absolute",
    height: "100%",
    right: 0,
    top: 0,
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:hover": {
        cursor: "pointer",
    },
}));

const StyledInputBase = styled(InputBase)(() => ({
    color: "inherit",
    width: "100%",
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingTop: "3px",
    height: "100%",
}));

const SearchBar = ({ onSearchChange }) => {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
    }, []);

    const handleCancel = () => {
        setSearchValue("");
    };

    const handleKeyUp = (e) => {
        if (e.keyCode === 13 || e.code === "Enter") {
            handleSearchChange(e);
        } else if (e.keyCode === 27 || e.code === "Escape") {
            handleCancel();
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            gap={8}
        >
            <Box
                flex="1"
                width={"50%"}
            >
                <Search
                    key={"SearchBarComponent-root"}
                    style={{
                        width: "100%",
                        height: "40px",
                    }}
                    className={`SearchBarComponent-root`}
                >
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        inputProps={{
                            onChange: handleSearchChange,
                            value: searchValue,
                        }}
                        placeholder={"Search..."}
                        onKeyUp={handleKeyUp}
                    />
                    {searchValue ? (
                        <CloseIconWrapper onClick={handleCancel}>
                            <CloseIcon />
                        </CloseIconWrapper>
                    ) : null}
                </Search>
            </Box>
        </Box>
    );
};

export default SearchBar;
