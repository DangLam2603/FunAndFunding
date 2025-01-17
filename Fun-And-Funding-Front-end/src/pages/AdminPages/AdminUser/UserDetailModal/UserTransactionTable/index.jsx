import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React from 'react';

const transactionType = {
    0: { name: "Package Donation", color: "#1BAA64" },
    1: { name: "Add Wallet Money", color: "var(--primary-green)" },
    2: { name: "Withdraw Wallet Money", color: "#D9534F" },
    3: { name: "Funding Withdraw", color: "#F5A623" },
    4: { name: "Commission Fee", color: "#8E44AD" },
    5: { name: "Funding Refund", color: "#F39C12" },
    6: { name: "Funding Purchase", color: "#F39C12" },
    7: { name: "Order Purchase", color: "var(--red)" },
    8: { name: "Marketplace Withdraw", color: "#3498DB" },
};

const UserTransactionTable = ({ transactions }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: "0.25rem",
                boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                mb: '1rem'
            }}
        >
            <Table>
                <TableHead
                    sx={{
                        bgcolor: "var(--black)",
                    }}
                >
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>Created Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white", width: '35%' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>Total Amount</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>Transaction Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions?.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? 'white' : 'var(--light-grey)',
                                }}
                            >
                                <TableCell>
                                    {new Date(transaction.createdDate).toLocaleString()}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: transaction.totalAmount > 0 ? 'var(--primary-green)' : 'var(--red)',
                                    }}
                                >
                                    {formatPrice(transaction.totalAmount)} <span className="text-[0.75rem]">VND</span>
                                </TableCell>
                                <TableCell>
                                    {transactionType[transaction.transactionType] ? (
                                        <span
                                            style={{
                                                backgroundColor: transactionType[transaction.transactionType].color,
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                display: 'inline-block',
                                                textTransform: 'capitalize',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {transactionType[transaction.transactionType].name}
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                backgroundColor: '#BDC3C7',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontWeight: '600',
                                                display: 'inline-block',
                                                textTransform: 'capitalize',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Unknown Type
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography>No transactions available.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTransactionTable;