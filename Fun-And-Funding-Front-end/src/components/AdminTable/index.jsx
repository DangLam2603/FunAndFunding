/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Button } from "@mui/material";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable({
  data,
  handleRowClick,
  handleNoteClick,
  totalItems = data.length,
  totalPages,
  currentPage = 1,
  pageSize = 0,
  onPageChange,
  onPageSizeChange,
}) {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const filteredColumns = columns.filter((col) => col !== "Id");

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: "#e5e7eb",
                color: "black",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              No
            </TableCell>
            {filteredColumns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  backgroundColor: "#e5e7eb",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              >
                {column}
              </TableCell>
            ))}
            <TableCell
              sx={{
                backgroundColor: "#e5e7eb",
                color: "black",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.Id || rowIndex}
              sx={{
                backgroundColor: rowIndex % 2 === 1 ? "#f9f9f9" : "white",
              }}
            >
              <TableCell component="th" scope="row">
                {currentPage * pageSize + rowIndex + 1}
              </TableCell>
              {filteredColumns.map((column) => (
                <TableCell
                  key={column}
                  component="th"
                  scope="row"
                  sx={{
                    color:
                      column === "STATUS" && row[column] === "Rejected"
                        ? "red"
                        : column === "STATUS" && row[column] === "Processing"
                        ? "blue"
                        : column === "STATUS" && row[column] === "Approved"
                        ? "green"
                        : "inherit",
                    fontWeight: column === "STATUS" ? "bold" : "normal",
                  }}
                >
                  {String(row[column])}
                </TableCell>
              ))}
              <TableCell>
                {row.STATUS !== "Rejected" ? (
                  <Button onClick={() => handleRowClick(row.Id)}>ACTION</Button>
                ) : (
                  <Button onClick={() => handleNoteClick(row.Id)}>NOTE</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={columns.length}
              count={totalItems}
              rowsPerPage={pageSize}
              page={currentPage}
              onPageChange={(event, newPage) => onPageChange(newPage)}
              onRowsPerPageChange={(event) =>
                onPageSizeChange(parseInt(event.target.value, 10))
              }
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

CustomPaginationActionsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleRowClick: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};
