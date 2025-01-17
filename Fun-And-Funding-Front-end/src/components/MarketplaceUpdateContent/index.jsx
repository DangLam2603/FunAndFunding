import { Avatar, Box, Paper, Typography } from "@mui/material";
import React from "react";
import MarketplaceProjectIntro from "../../components/MarketplaceProjectIntro";

function MarketplaceUpdateContent({ content, index, gameOwner }) {
  console.log(content);
  return (
    <Paper
      sx={{
        backgroundColor: "var(--white)",
        borderRadius: "0.625rem",
        p: "3rem",
        mb: "2rem",
      }}
      elevation={3}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: "500",
          color: "var(--black)",
          mb: "1rem",
        }}
      >
        UPDATE (#{index})
      </Typography>
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "var(--black)",
          mb: "2rem",
        }}
      >
        Update version{" "}
        <span className="text-[var(--primary-green)] font-bold">
          {content.version}
        </span>
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div className="flex flex-row items-center flex-grow-0">
          <Avatar
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              marginRight: "1rem",
            }}
            src={gameOwner.avatar ?? ""}
          />
          <Box>
            <a href={`/profile/`}>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  width: "15rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "var(--black)",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {gameOwner.userName ?? ""}
              </Typography>
            </a>
            <Typography
              sx={{
                fontSize: "0.75rem",
                opacity: "0.6",
                color: "var(--black)",
              }}
            >
              {new Date(content.createdDate).toLocaleString()}
            </Typography>
          </Box>
        </div>
      </Box>
      <Box>
        <MarketplaceProjectIntro intro={content.description} />
      </Box>
    </Paper>
  );
}

export default MarketplaceUpdateContent;
