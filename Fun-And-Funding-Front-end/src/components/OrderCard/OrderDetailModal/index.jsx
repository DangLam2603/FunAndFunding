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
const OrderDetailModal = ({ details }) => {
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const day = String(formattedDate.getDate()).padStart(2, '0');
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const year = formattedDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

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
    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState("");

    const handleOpen = (key) => {
        setSelectedKey(key);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedKey("");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedKey);
        alert("API Key copied to clipboard!");
    };
    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url; // Set the URL to the file
        link.download = ""; // Use the `download` attribute to enable download behavior
        document.body.appendChild(link); // Append the link to the DOM
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Remove the link from the DOM
    };
    return (
        <div>
            <Typography sx={{ color: 'var(--black)', fontWeight: '600', fontSize: '1.5rem', mb: '1rem' }}>Order details</Typography>

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
                <Typography sx={{ flexGrow: 1, color: 'var(--black)', width: '45%', fontWeight: '600', fontSize: '1rem', }}>Game name</Typography>
                <Typography sx={{ width: '25%', color: 'var(--black)', fontWeight: '600', fontSize: '1rem', }}>Price</Typography>
                <Typography sx={{ width: '15%', color: 'var(--black)', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', }}>Discount<RiDiscountPercentFill /></Typography>
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
                                <img
                                    className="w-[5rem] h-[5rem] object-cover rounded-[0.25rem] flex-shrink-0 mr-[1.5rem]"
                                    src={
                                        item.digitalKey.marketingProject.marketplaceFiles?.find(
                                            (file) => file.fileType === 2
                                        )?.url || NoImage
                                    }
                                    alt={item.digitalKey.marketingProject.name}
                                />
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
                                        {item.digitalKey.marketingProject.name}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: "300",
                                            fontSize: "0.875rem",
                                            color: "var(--black)",
                                            textAlign: "left",
                                        }}
                                    >
                                        Added date: {formatDate(item.digitalKey.createdDate)}
                                    </Typography>
                                </div>
                            </div>
                            {item.projectCoupon ? (
                                <>
                                    <Typography
                                        sx={{
                                            fontWeight: "500",
                                            fontSize: "1rem",
                                            width: "25%",
                                        }}
                                    >
                                        <span style={{ textDecoration: "line-through" }}>
                                            {formatPrice(item.digitalKey.marketingProject.price)} VND
                                        </span>
                                        <br />
                                        <span
                                            style={{
                                                color: "var(--primary-green)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {formatPrice(item.unitPrice)} VND
                                        </span>
                                    </Typography>
                                    <Typography sx={{ fontWeight: '600', width: '15%', textAlign: 'center', fontSize: '1.5rem' }}>
                                        {item.projectCoupon.discountRate * 100}%
                                    </Typography>
                                </>

                            ) : (
                                <>
                                    <Typography
                                        sx={{
                                            fontWeight: "500",
                                            fontSize: "1rem",
                                            width: "25%",
                                        }}
                                    >
                                        {formatPrice(item.digitalKey.marketingProject.price)} VND
                                    </Typography>
                                    <Typography sx={{ fontWeight: '600', width: '15%', textAlign: 'center', fontSize: '1.5rem' }}>
                                        0%
                                    </Typography>
                                </>

                            )}
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: "2rem", py: "1rem" }}>
                            <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem" }}>
                                Your key game and download here
                            </Typography>
                            {/* Example table */}
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
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td
                                            onClick={() => handleOpen(item.digitalKey.keyString)}
                                            style={{
                                                padding: "12px",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                                color: "#1BAA64",
                                            }}
                                        >
                                            ...{item.digitalKey.keyString.slice(-4)}
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px",
                                            }}
                                        >
                                            {formatTableDate(item.digitalKey.createdDate)}
                                        </td>
                                        
                                        <td
                                            style={{
                                                padding: "12px",
                                            }}
                                        >
                                            <Tooltip title="Download game file" arrow>
                                                <Button
                                                    variant="outlined"
                                                    className="outline-download-button"
                                                    onClick={() => {
                                                        const fileUrl = item.digitalKey.marketingProject.marketplaceFiles.find(file => file.fileType === 3)?.url;
                                                        if (fileUrl) handleDownload(fileUrl);
                                                    }}
                                                >
                                                    <DownloadIcon
                                                        sx={{
                                                            fontSize: "2rem !important",
                                                            strokeWidth: "1",
                                                            stroke: "#F5F7F8",
                                                        }}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Modal */}
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="api-key-modal-title"
                                aria-describedby="api-key-modal-description"
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 400,
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <Typography id="api-key-modal-title" variant="h6" component="h2">
                                            Digital Key Generated
                                        </Typography>
                                        <IconButton onClick={handleClose}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                    <Typography id="api-key-modal-description" sx={{ mb: 2 }}>
                                        Use your Digital keys securely. Do not share them or embed them in code
                                        the public can view.
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#f5f5f5",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "4px",
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.875rem",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {selectedKey}
                                        </Typography>
                                        <Button
                                            onClick={handleCopy}
                                            variant="outlined"
                                            sx={{
                                                ml: 2,
                                                textTransform: "none",
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </AccordionDetails>
                    </Accordion>
                ))}

            {/* digital Key */}
        </div>
    )
}

export default OrderDetailModal