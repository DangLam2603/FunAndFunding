import { Box, Grid2, Typography, Rating } from "@mui/material";
import React from "react";
import { FaDonate } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { MdRateReview } from "react-icons/md";

function MarketplaceProjectOverview({ marketplaceProject }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE").format(price);
  };

  return (
    <div>
      <Typography sx={{ fontSize: "1rem", fontWeight: "600", mb: "1rem" }}>
        Project information
      </Typography>
      <div className="w-full mb-[2rem]">
        <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%", mb: "1rem" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <TbTargetArrow size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Price
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.price ? "500" : "400",
                  color: marketplaceProject?.price
                    ? "var(--black)"
                    : "var(--grey)",
                }}
              >
                {formatPrice(marketplaceProject?.price)}{" "}
                <span className="text-[0.75rem]">VND</span>
              </Typography>
            </Grid2>
          </Grid2>
        </div>
        {/* <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%", mb: "1rem" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <FaDonate size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Purchases
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.balance ? "500" : "400",
                  color: marketplaceProject?.balance
                    ? marketplaceProject.balance > marketplaceProject.target
                      ? "var(--primary-green)"
                      : "var(--red)"
                    : "var(--grey)",
                }}
              >
                {formatPrice(marketplaceProject?.balance)}{" "}
                <span className="text-[0.75rem]">VND</span>
              </Typography>
            </Grid2>
          </Grid2>
        </div> */}

        {/* <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%", mb: "1rem" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <MdRateReview size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Rate
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.rate ? "500" : "400",
                  color: marketplaceProject?.rate
                    ? "var(--black)"
                    : "var(--grey)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="text-[0.75rem]">
                  <Rating name="read-only" value={0} precision={0.1} readOnly />
                </span>{" "}
                (0.0)
              </Typography>
            </Grid2>
          </Grid2>
        </div> */}
      </div>
      <Typography sx={{ fontSize: "1rem", fontWeight: "600", mb: "1rem" }}>
        Wallet information
      </Typography>
      <div className="w-full mb-[2rem]">
        <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%", mb: "1rem" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <IoWallet size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Wallet Balance
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.wallet.balance
                    ? "500"
                    : "400",
                  color: marketplaceProject?.wallet.balance
                    ? "var(--black)"
                    : "var(--grey)",
                }}
              >
                {formatPrice(marketplaceProject?.wallet.balance)}{" "}
                <span className="text-[0.75rem]">VND</span>
              </Typography>
            </Grid2>
          </Grid2>
        </div>
      </div>
      <Typography sx={{ fontSize: "1rem", fontWeight: "600", mb: "1rem" }}>
        Owner information
      </Typography>
      <div className="w-full mb-[2rem]">
        <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%", mb: "1rem" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <FaIdCard size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Username
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.user.userName ? "500" : "400",
                  color: marketplaceProject?.user.userName
                    ? "var(--black)"
                    : "var(--grey)",
                }}
              >
                {marketplaceProject?.user.userName}
              </Typography>
            </Grid2>
          </Grid2>
        </div>
        <div className="w-full">
          <Grid2
            container
            columnSpacing={2}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Grid2 xs={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "var(--grey)",
                  width: "12rem",
                }}
              >
                <MdEmail size={16} />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "400",
                  }}
                >
                  Email
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={1} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--grey)",
                }}
              >
                :
              </Typography>
            </Grid2>

            <Grid2 xs={8}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: marketplaceProject?.user.email ? "500" : "400",
                  color: marketplaceProject?.user.email
                    ? "var(--black)"
                    : "var(--grey)",
                }}
              >
                {marketplaceProject?.user.email}
              </Typography>
            </Grid2>
          </Grid2>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceProjectOverview;
