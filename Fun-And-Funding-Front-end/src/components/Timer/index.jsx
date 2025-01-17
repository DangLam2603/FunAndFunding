import React from "react";
import { Tooltip, Box } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { keyframes } from "@emotion/react";

// Shaking animation using keyframes
const shakeAnimation = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

const Timer = ({days}) => {
  return (
    <Tooltip title={`You still have ${days} days left`} arrow>
      <Box
        sx={{
          display: "inline-block",
          animation: `${shakeAnimation} 0.5s infinite`,
          cursor: "pointer",
        }}
      >
        <FaClock size={40} color="#1BAA64" />
      </Box>
    </Tooltip>
  );
};

export default Timer;