import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Backdrop, Box, Divider, Fade, IconButton, Modal, Paper, Tooltip, Typography } from '@mui/material';
import Cookies from "js-cookie";
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import empty from "../../../assets/images/image_empty.png";
import dashboardApiInstance from "../../../utils/ApiInstance/dashboardApiInstance";
import SearchBar from '../../SearchBar';
import SortDropdown from '../../SortDropdown';

const options = [
    "Package Donation",
    "Add Wallet Money",
    "Withdraw Wallet Money",
    "Funding Withdraw",
    "Commission Fee",
    "Funding Refund",
    "Funding Purchase",
    "Order Purchase",
    "Marketplace Withdraw",
    "Milestone First Half",
    "Milestone Second Half",
    "Withdraw Refund",
    "Withdraw Cancel"
];

function TransactionTable({ data }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        px: '2rem',
        py: '2rem',
        minHeight: '70%',
        borderRadius: 1
    };

    const token = Cookies.get("_auth");

    const [open, setOpen] = useState(false);
    const [searchedTransaction, setSearchedTransaction] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedStatus, setSelectedStatus] = useState([]);

    useEffect(() => {
        if (data && token) {
            fetchTransactionData(searchValue, selectedStatus);
        }
    }, [data, token])

    const handleSearchValue = (value) => {
        setSearchValue(value);
        console.log(value);
        fetchTransactionData(value, selectedStatus);
    }

    const handleSeletedStatus = (array) => {
        const indices = array.map((item) => options.indexOf(item));
        setSelectedStatus(indices);
        fetchTransactionData(searchValue, indices);
    }

    const fetchTransactionData = async (searchValue, selectedStatus) => {
        try {
            const response = await dashboardApiInstance.get('/transactions', {
                params: {
                    pageSize: 9999,
                    pageIndex: 1,
                    searchValue: searchValue,
                    types: selectedStatus
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data._statusCode === 200) {
                setSearchedTransaction(response.data._data.items);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const formatDateTime = (createdDate, type) => {
        const dateObj = new Date(createdDate);

        if (type === "date") {
            return dateObj.toLocaleDateString(undefined, {
                weekday: "short",
                day: "2-digit",
                month: "short",
            });
        }

        if (type === "time") {
            return dateObj.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }

        console.error("Invalid type provided. Use 'date' or 'time'.");
        return null;
    };

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: '0.625rem',
                    py: '1rem',
                    px: '1.5rem',
                    boxShadow:
                        '0px 2px 2px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                    mb: '2rem'
                }}
            >
                <div className="flex flex-row justify-between items-center mb-[1rem]">
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--grey)' }}>Latest Transactions</Typography>
                    <Tooltip title="Expand" arrow>
                        <IconButton
                            sx={{
                                p: '0.75rem',
                                color: 'var(--black)',
                                '&:hover': {
                                    backgroundColor: 'var(--white)',
                                },
                            }}
                            size="small"
                            onClick={() => setOpen(true)}
                        >
                            <ArrowOutwardIcon fontSize="inherit" style={{ strokeWidth: '2rem !important' }} />
                        </IconButton>
                    </Tooltip>
                </div>
                {data && data.slice(0, 5).map((transaction, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-row justify-between mb-[1rem]">
                            <div className="flex flex-col gap-[0.125rem]">
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 400 }}>
                                    {formatDateTime(transaction.createdDate, "date")} <span className="font-semibold ml-[0.25rem]">{formatDateTime(transaction.createdDate, "time")}</span>
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{options[transaction.transactionType]}</Typography>
                            </div>
                            <div className="flex flex-col gap-[0.125rem]">
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 400,
                                        textAlign: 'right',
                                        width: '8rem',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {transaction.description}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textAlign: 'right',
                                        color: transaction.totalAmount >= 0 ? 'var(--primary-green)' : 'var(--red)',
                                    }}
                                >
                                    {new Intl.NumberFormat("de-DE").format(transaction.totalAmount)} VND
                                </Typography>
                            </div>
                        </div>
                        {index < data.slice(0, 5).length - 1 && (
                            <Divider sx={{ border: '1px solid #EAEAEA', borderRadius: '0.625rem', mb: '1rem' }} />
                        )}
                    </React.Fragment>
                ))}
            </Paper>
            <Modal open={open} onClose={handleClose} slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{ zIndex: '50 !important' }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <div className="mb-[2.5rem] mx-[0.5rem]">
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Platform Transactions
                            </Typography>
                            <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                All transactions made in the platform will be showed here.
                            </Typography>
                        </div>
                        <div className='flex flex-row justify-between gap-[1rem]'>
                            <SearchBar onSearchChange={(value) => handleSearchValue(value)} />
                            <SortDropdown options={options} onValueChange={(array) => handleSeletedStatus(array)} />
                        </div>
                        <Box
                            sx={{
                                height: '25rem',
                                overflowY: 'auto',
                                mt: '1.5rem',
                                overflowX: 'visible',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                },
                            }}
                        >
                            {searchedTransaction ? searchedTransaction.map((transaction, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex flex-row justify-between mb-[1.5rem] mx-[0.5rem]">
                                        <div className="flex flex-col gap-[0.25rem]">
                                            <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                                                {formatDateTime(transaction.createdDate, "date")} <span className="font-semibold ml-[0.25rem]">{formatDateTime(transaction.createdDate, "time")}</span>
                                            </Typography>
                                            <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>{options[transaction.transactionType]}</Typography>
                                        </div>
                                        <div className="flex flex-col gap-[0.25rem]">
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 400,
                                                    textAlign: 'right',
                                                    width: '25rem',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {transaction.description}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 700,
                                                    textAlign: 'right',
                                                    color: transaction.totalAmount >= 0 ? 'var(--primary-green)' : 'var(--red)',
                                                }}
                                            >
                                                {new Intl.NumberFormat("de-DE").format(transaction.totalAmount)} VND
                                            </Typography>
                                        </div>
                                    </div>
                                    {index < searchedTransaction.length - 1 && (
                                        <Divider sx={{ border: '1px solid #EAEAEA', borderRadius: '0.625rem', mb: '1.5rem' }} />
                                    )}
                                </React.Fragment>
                            )) : <div className='flex flex-col justify-center items-center rounded-[0.625rem] bg-[var(--light-grey)] h-full'>
                                <img src={empty} className='h-[10rem] mb-[2rem]'></img>
                                <Typography
                                    sx={{
                                        fontWeight: "500",
                                        fontSize: "1rem",
                                        color: "var(--black)",
                                        textAlign: "left",
                                    }}
                                >No transactions found.</Typography>
                            </div>}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}

export default TransactionTable;
