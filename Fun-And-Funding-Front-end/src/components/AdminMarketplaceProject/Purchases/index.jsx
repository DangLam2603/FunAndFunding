import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Popover,
  Typography,
} from "@mui/material";
import { BiSolidCoupon } from "react-icons/bi";

const Purchases = ({ orders }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentCoupon, setCurrentCoupon] = React.useState(null);

  const handlePopoverOpen = (event, coupon) => {
    setAnchorEl(event.currentTarget);
    setCurrentCoupon(coupon);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentCoupon(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Table
      sx={{
        minWidth: 650,
        borderRadius: "0.25rem",
        boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        mb: "1rem",
      }}
      aria-label="simple table"
    >
      <TableHead sx={{ backgroundColor: "var(--black)" }}>
        <TableRow>
          <TableCell></TableCell>
          <TableCell sx={{ color: "#ffffff" }} align="left">
            Name
          </TableCell>
          <TableCell sx={{ color: "#ffffff" }} align="left">
            Unit Price
          </TableCell>
          <TableCell sx={{ color: "#ffffff" }} align="left">
            Digital Key
          </TableCell>
          <TableCell sx={{ color: "#ffffff" }} align="left">
            Order Date
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>
              <Avatar>
                {order.url ? <img src={order.url} alt={order.name} /> : ""}
              </Avatar>
            </TableCell>
            <TableCell align="left">{order.name}</TableCell>
            <TableCell align="left">
              {order.unitPrice.toLocaleString("de-DE")} VND
            </TableCell>
            <TableCell
              align="left"
              sx={{
                color:
                  order.digitalKeyStatus === 1
                    ? "var(--primary-green)"
                    : "var(--red)",
              }}
            >
              {order.keyString}
            </TableCell>
            <TableCell align="left">
              {new Date(order.createdDate).toLocaleString()}
            </TableCell>
            <TableCell align="left">
              <span
                className="hover:cursor-pointer"
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={(event) =>
                  handlePopoverOpen(event, {
                    couponKey: order.couponKey,
                    couponName: order.couponName,
                    discountRate: order.discountRate,
                  })
                }
                onMouseLeave={handlePopoverClose}
              >
                {order.couponKey ? <BiSolidCoupon /> : ""}
              </span>
              <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: "none" }}
                open={open && currentCoupon?.couponKey === order.couponKey}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1 }}>
                  <strong>{currentCoupon?.couponName}</strong> <br />
                  Code: {currentCoupon?.couponKey} <br />
                  Discount: {currentCoupon?.discountRate * 100}%
                </Typography>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Purchases;
