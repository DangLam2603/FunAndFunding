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
import React, { useEffect, useState } from 'react';
import packageBackerApiInstance from "../../../../../utils/ApiInstance/packageBackerApiInstance";

function FundingProjectDonation({ fundingProjectId }) {
    const [backerList, setBackerList] = useState([]);

    useEffect(() => {
        fetchBackerList();
    }, [fundingProjectId])

    const fetchBackerList = async () => {
        try {
            await packageBackerApiInstance.get(`/project-backers-detail?projectId=${fundingProjectId}`)
                .then(res => {
                    if (res.data.result._isSuccess) {
                        setBackerList(res.data.result._data);
                    }
                })
        } catch (error) {
            console.error(error);
        }
    }

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
                        <TableCell sx={{ fontWeight: "bold", color: "white" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "white", width: '15rem' }}>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {backerList?.length > 0 ? (
                        backerList.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? 'white' : 'var(--light-grey)',
                                }}
                            >
                                <TableCell>{item.name}</TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: 'var(--primary-green)',
                                        width: '15rem'
                                    }}
                                >
                                    {formatPrice(item.donateAmount)} <span className="text-[0.75rem]">VND</span>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography>No donations yet.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default FundingProjectDonation