import React, { useState } from 'react'
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router';
const AboutUsLayout = () => {
    const titleList = [
        { text: "Introduction", sectionId: "section1" },
        { text: "Backer Restrictions", sectionId: "section2" },
        { text: "Owner Policies", sectionId: "section3" },
        { text: "Backer Policies", sectionId: "section4" },
        { text: "Disclaimer of Responsibility", sectionId: "section5" },
        { text: "Marketplace Promotion", sectionId: "section6" }
    ];
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div className="mt-[2rem]">
        <div className="mx-[5.5rem]">
            <Grid container columnSpacing={"4rem"}>
                <Grid size={3}>
                    <Paper
                        elevation={3}
                        sx={{
                            zIndex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            alignItems: "center",
                            position: "sticky",
                            top: "4.8rem",
                            backgroundColor: "#F5F7F8",
                        }}
                    >
                        <Box sx={{ width: "100%", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <List sx={{ mx: "2.4rem", flexGrow: 1, mb: "1.2rem", mt: "0.8rem" }}>
                                {titleList.map((item, index) => (
                                    <ListItem
                                        key={item.text}
                                        onClick={() => handleScrollToSection(item.sectionId)}
                                        sx={{ p: 0, mb: "0.8rem", borderRadius: "0.4rem" }}
                                    >
                                        <ListItemButton sx={{
                                            borderRadius: "0.4rem",
                                            color: "#2F3645",
                                            "&:hover": {
                                                boxShadow: "inset 0 0 0 1px #1BAA64",
                                                backgroundColor: "#F5F7F8",
                                                color: "#1BAA64 !important",
                                            },
                                        }}>
                                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "1rem", fontWeight: "600" }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={9}>
                    <Box>
                        <Outlet />
                    </Box>
                </Grid>
            </Grid>
        </div>
    </div>
    )
}

export default AboutUsLayout