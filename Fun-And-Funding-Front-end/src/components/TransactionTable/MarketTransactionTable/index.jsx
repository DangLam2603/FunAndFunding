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

const MarketTransactionTable = ({ transactions }) => {
  const [visibleRows, setVisibleRows] = useState(10); // Number of rows visible

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 10); // Increment visible rows by 10
  };

  const renderStatus = (status) => {
    switch (status) {
      case 7:
        return "Order Purchase";
      case 4:
        return "Charge Commission Fee";
      case 8:
        return "Marketplace Withdrawal";
      case 12:
        return "Withdraw Cancel";
      default:
    }
  }

  // Check if transactions is valid and is an array
  if (!Array.isArray(transactions) || transactions.length === 0 || !transactions) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
        No transactions available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: '45px' }}>
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
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Transfer Date</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice(0, visibleRows).map((transaction, index) => (
            <TableRow key={transaction.id || index}>
              <TableCell>{transaction.transactionType == 4 ? '-' : ''} {transaction.totalAmount.toLocaleString()}</TableCell>
              <TableCell>
                {/* <div className="max-w-[8rem] overflow-hidden whitespace-nowrap text-ellipsis"> */}
                <span>
                  {transaction.transactionType == 4
                    ? transaction.description.replace("Receive", "Charge")
                    : transaction.description
                  }
                </span>
                {/* </div> */}


              </TableCell>
              <TableCell>
                {new Date(transaction.createdDate).toLocaleDateString()}{" "}
                {new Date(transaction.createdDate).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {renderStatus(transaction.transactionType) || "Unknown"}
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
}

export default MarketTransactionTable