import React from "react";
import { Avatar, Typography } from "@mui/material";

function ContactedUser({ user, isSelected, onSelect }) {
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      return "Invalid date";
    }
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timeDifference = (date) => {
    if (!(date instanceof Date)) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInMs = now - date;

    // Time units in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffInMs < minute) {
      return "Now";
    } else if (diffInMs < hour) {
      const minutes = Math.floor(diffInMs / minute);
      return `${minutes}m`;
    } else if (diffInMs < day) {
      const hours = Math.floor(diffInMs / hour);
      return `${hours}h`;
    } else if (diffInMs < week) {
      const days = Math.floor(diffInMs / day);
      return `${days}d`;
    } else {
      const weeks = Math.floor(diffInMs / week);
      return `${weeks}w`;
    }
  };

  return (
    <div
      className={`flex flex-row p-4 gap-x-4 ${
        isSelected ? "bg-[#d3d3d380]" : "bg-transparent"
      }  hover:bg-[#d3d3d380] hover:cursor-pointer rounded-[0.625rem] w-full`}
      onClick={onSelect}
    >
      <div>
        <Avatar
          alt={user.name}
          src={user.avatar}
          sx={{ width: 56, height: 56 }}
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <Typography sx={{ fontSize: "1.125rem", fontWeight: "600" }}>
          {user.name}
        </Typography>
        <div className="flex flex-row justify-between">
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#9d9e9f",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 1,
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allows text to wrap
              wordBreak: "break-word",
              width: "50%",
            }}
          >
            {user.latestMessage}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#9d9e9f",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 1,
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allows text to wrap
              wordBreak: "break-word",
              textAlign: "right",
            }}
          >
            {timeDifference(new Date(user.createdDate))}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ContactedUser;
