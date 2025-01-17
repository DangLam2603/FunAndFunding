import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const transactionTypes = [
  "Donation",
  "Wallet transfer",
  "Withdraw Wallet Money",
  "Funding Withdraw",
  "Charge Commission Fee",
  "Funding Refund",
  "Funding Purchase",
  "Order Purchase",
  "Marketplace Withdraw",
  "Transfer First Half",
  "Transfer Second Half",
  "Withdraw Refund",
  "Withdraw Cancel",
  "Withdraw Funding Process"
];

const TransactionTable = ({ transactions }) => {
  const [visibleRows, setVisibleRows] = useState(10); // Number of rows visible

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 10); // Increment visible rows by 10
  };

  // Check if transactions is valid and is an array
  if (!Array.isArray(transactions) || transactions.length === 0 || !transactions) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
        No transactions available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{marginTop:'45px'}}>
      <Typography
        variant="h5"
        sx={{ padding: "16px", backgroundColor: "#1BAA64", color: "white" }}
      >
        Transaction History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Transfer Date</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice(0, visibleRows).map((transaction, index) => (
            <TableRow key={transaction.id || index}>
              <TableCell>{transaction.totalAmount.toLocaleString()}</TableCell>
              <TableCell>
                {new Date(transaction.createdDate).toLocaleDateString()}{" "}
                {new Date(transaction.createdDate).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {transactionTypes[transaction.transactionType] || "Unknown"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visibleRows < transactions.length && (
        <Button
          onClick={handleLoadMore}
          variant="contained"
          sx={{ margin: "16px auto", display: "block", backgroundColor: "#1BAA64" }}
        >
          Read More
        </Button>
      )}
    </TableContainer>
  );
};

export default TransactionTable;