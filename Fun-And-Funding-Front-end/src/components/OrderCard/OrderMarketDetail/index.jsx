import React, { useState } from 'react'
import {
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Modal,
    Box
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { FaArrowDown } from "react-icons/fa";
import { Close } from "@mui/icons-material";
import { RiDiscountPercentFill } from "react-icons/ri";

const OrderMarketDetail = ({ details }) => {
    console.log(details);
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const year = formattedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const totalUnitPrice = details.reduce((sum, item) => sum + (item.unitPrice || 0), 0);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };
    const [expanded, setExpanded] = useState(null);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };
    const formatTableDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
    };
    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'var(--black)', fontWeight: '600', fontSize: '1.5rem', mb: '1rem' }}>Order details</Typography>
                <Typography sx={{ color: 'var(--black)', fontWeight: '600', fontSize: '1.5rem', mb: '1rem' }}>
                    Total Amount:  {formatPrice(totalUnitPrice)}
                </Typography>
            </Box>

            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: '1rem',
                    px: '2rem',
                    backgroundColor: 'var(--white)',
                    borderRadius: '0.625rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    justifyContent: 'space-between',
                    mb: '2rem'
                }}
                elevation={3}
            >
                <Typography sx={{ flexGrow: 1, color: 'var(--black)', width: '45%', fontWeight: '600', fontSize: '1rem', }}>Customner</Typography>
                <Typography sx={{ width: '25%', color: 'var(--black)', fontWeight: '600', fontSize: '1rem', }}>Unit Price</Typography>
                <Typography sx={{ width: '15%', color: 'var(--black)', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', }}>Purchased Date<RiDiscountPercentFill /></Typography>
                <Typography sx={{ width: '15%', color: 'var(--black)', visibility: 'hidden', fontSize: '1rem', }}>Action</Typography>
            </Paper>
            {details &&
                details.map((item, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === index}
                        onChange={handleAccordionChange(index)}
                        sx={{
                            marginBottom: "1rem",
                            borderRadius: "0.625rem",
                            overflow: "hidden",
                            "&:before": {
                                display: "none",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<FaArrowDown />}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: "1rem",
                                px: "2rem",
                                backgroundColor: "var(--white)",
                                "& .MuiAccordionSummary-content": {
                                    alignItems: "center",
                                },
                            }}
                        >
                            <div className="flex flex-row justify-start items-center w-[45%]">
                                <div className="flex flex-col justify-between max-h-[5rem]">
                                    <Typography
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: "1rem",
                                            color: "var(--black)",
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            textOverflow: "ellipsis",
                                            mr: "1.5rem",
                                            mb: "1rem",
                                        }}
                                    >
                                        {item.name}
                                    </Typography>

                                </div>

                            </div>
                            <Typography
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "1rem",
                                    width: "25%",
                                }}
                            >
                                {formatPrice(item.unitPrice)} VND
                            </Typography>
                            <Typography sx={{ fontWeight: '600', width: '15%', textAlign: 'center', fontSize: '1.5rem' }}>
                                {formatTableDate(item.createdDate)}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: "2rem", py: "1rem" }}>
                            <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem" }}>
                                Digital key Details
                            </Typography>
                            {/* Digital table */}
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "separate", // Use "separate" for borderRadius to work
                                    borderSpacing: 0, // Removes gaps when using "separate"
                                    borderRadius: "5px", // Apply borderRadius

                                    overflow: "hidden", // Ensure borderRadius works
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow
                                }}
                            >
                                <thead
                                    style={{
                                        backgroundColor: "#1BAA64", // Header background color
                                        color: "#ffffff", // Header text color
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                padding: "12px", // Increased padding for better spacing
                                                textAlign: "left",
                                            }}
                                        >
                                            Digital key
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                            }}
                                        >
                                            Created
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                            }}
                                        >
                                            Status
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td

                                            style={{
                                                padding: "12px",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                color: "#1BAA64",
                                            }}
                                        >
                                            ...{item.keyString.slice(-4)}
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px",
                                            }}
                                        >
                                            {formatTableDate(item.createdDate)}
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px",
                                            }}
                                        >
                                            {item.digitalKeyStatus == 1 ? "Active" : "Expired"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {item.couponName != "" && (
                                <>
                                    <Typography variant="body1" sx={{ mt: 2, mb: 2, fontSize: "1rem" }}>
                                        Coupon Details
                                    </Typography>
                                    {/* Discount table */}
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "separate", // Use "separate" for borderRadius to work
                                            borderSpacing: 0, // Removes gaps when using "separate"
                                            borderRadius: "5px", // Apply borderRadius

                                            overflow: "hidden", // Ensure borderRadius works
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow
                                        }}
                                    >
                                        <thead
                                            style={{
                                                backgroundColor: "#1BAA64", // Header background color
                                                color: "#ffffff", // Header text color
                                            }}
                                        >
                                            <tr>
                                                <th
                                                    style={{
                                                        padding: "12px", // Increased padding for better spacing
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    Coupon Name
                                                </th>
                                                <th
                                                    style={{
                                                        padding: "12px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    Coupon Key
                                                </th>
                                                <th
                                                    style={{
                                                        padding: "12px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    Discount Rate
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td

                                                    style={{
                                                        padding: "12px",
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                        color: "#1BAA64",
                                                    }}
                                                >
                                                    {item.couponName}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "12px",
                                                    }}
                                                >
                                                    {item.couponKey}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "12px",
                                                    }}
                                                >
                                                    {item.discountRate}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            )}

                        </AccordionDetails>
                    </Accordion>
                ))}
        </div>
    )
}

export default OrderMarketDetail