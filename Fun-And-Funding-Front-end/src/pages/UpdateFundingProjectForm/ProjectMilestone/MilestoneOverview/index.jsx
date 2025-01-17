import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Button,
  IconButton
} from '@mui/material';
import transactionApiInstance from '../../../../utils/ApiInstance/transactionApiInstance';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import InfoIcon from "@mui/icons-material/Info";
import MilestonePolicyModal from '../../../../components/MilestonePolicyModal';
import { useNavigate } from 'react-router-dom';
const MilestoneOverview = () => {
  const { id } = useParams(); // Project ID from the URL
  const [tabValue, setTabValue] = useState(1); // Tabs state
  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionApiInstance.get(`?projectId=${id}&filter=1`);
        if (response.data._isSuccess) {
          setTransactions(response.data._data);
        } else {
          console.error("Failed to fetch transactions:", response.data._message);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const response = await axios.get(
        `https://localhost:7044/api/package-backers/project-backers-contact?projectId=${id}`
      );
      if (response.data._isSuccess) {
        setContacts(response.data._data);
      } else {
        console.error("Failed to fetch contacts:", response.data._message);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 2 && contacts.length === 0) {
      fetchContacts();
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 9: return "Initial Transfer";
      case 10: return "Final Transfer";
      case 4: return "Commission Fee";
      default: return "Unknown";
    }
  };

  const handleChatRedirect = (userId) => {
    const chatUrl = `/chat/${userId}`;
    window.open(chatUrl, '_blank'); 
    // navigate(`/chat/${userId}`)
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 0 }}>
    Milestone Details
  </Typography>
  {/* Info Icon Button */}
  <IconButton
    onClick={handleOpenModal}
    size="small"
    sx={{
      padding: "4px", // Compact padding
      borderRadius: "50%", // Circle shape
      backgroundColor: "#1BAA64",
      "&:hover": {
        backgroundColor: "#1BAA64", // Hover color remains the same
        opacity: 0.9, // Slight transparency on hover
      },
    }}
  >
    <InfoIcon fontSize="small" sx={{ color: "#FFFFFF" }} />
  </IconButton>
  <MilestonePolicyModal open={openModal} handleClose={handleCloseModal} />
</div>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Overview" value={1} />
        <Tab label="Backer Contacts" value={2} />
      </Tabs>

      {/* Tab Content */}
      {tabValue === 1 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Milestone Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Transaction Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Disbursement %</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.milestoneName}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={getTransactionTypeLabel(transaction.transactionType)}
                          color={
                            transaction.transactionType === 9
                              ? "primary"
                              : transaction.transactionType === 10
                              ? "success"
                              : "secondary"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {transaction.commissionFeeId
                          ? (transaction.commissionFee * 100).toFixed(2)
                          : (transaction.disbursementPercentage * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        {transaction.totalAmount.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.createdDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          {loadingContacts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.userId}>
                      <TableCell>{contact.userName}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.totalAmount.toLocaleString()} VND</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleChatRedirect(contact.userId)}
                        >
                          Chat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MilestoneOverview;