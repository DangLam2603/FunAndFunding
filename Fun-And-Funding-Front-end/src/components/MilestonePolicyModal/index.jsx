import React from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    List,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";
import logo from "../../assets/OnlyLogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MilestonePolicyModal = ({ open, handleClose }) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="milestone-policy-title"
                aria-describedby="milestone-policy-description"
                disableAutoFocus
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxHeight: "90%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        overflowY: "auto",
                    }}
                >
                    {/* Modal Header */}
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="Logo" className="w-[4.875rem] h-[5.5rem] mb-4" />
                        <h2 className="text-4xl font-bold text-gray-800 mb-1.5">Milestone Policies</h2>
                        <p className="text-gray-500 mt-1">Please read carefully before proceeding</p>
                    </div>

                    {/* Important Note */}
                    <Box
                        sx={{
                            mb: 4,
                            p: 2,
                            borderLeft: "5px solid #f44336",
                            bgcolor: "#fff5f5",
                        }}
                    >
                        <Typography variant="body1" color="error" fontWeight="bold">
                            Important Note for Owners:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Milestone disbursement will deduct the applied commission fee from the project wallet balance. Please ensure you are aware of this rate.
                        </Typography>
                    </Box>

                    {/* Reminder Section */}
                    <Box
                        sx={{
                            mb: 4,
                            p: 2,
                            borderLeft: "5px solid #1BAA64",
                            bgcolor: "#f5fff5",
                        }}
                    >
                        <Typography variant="body1" color="primary" fontWeight="bold">
                            Reminder for Project Owners:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            During the <strong>processing stage</strong>, you have the option to withdraw 50% of the donations collected. If you do not withdraw at this stage, the commission fee will be calculated based on the full wallet balance, which can reduce your net funding. Consider withdrawing at this stage to optimize your available funds.
                        </Typography>
                    </Box>

                    {/* Funding and Disbursement Explanation */}
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        Milestone Process Overview
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        The milestone process is divided into two key categories:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Funding Milestones:</strong> These milestones focus on attracting backers and demonstrating progress to ensure continued support for the project.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4 }}>
                        <strong>Disbursement Milestones:</strong> These milestones represent significant project deliverables and allow owners to withdraw funds in two phases:
                        <ul>
                            <li><strong>50% upon admin approval.</strong></li>
                            <li><strong>50% upon milestone completion and backer review.</strong></li>
                        </ul>
                    </Typography>

                    {/* Funding Milestones Section */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                        Funding Milestones
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body1">
                                    <strong>Milestone 1:</strong> Gameplay Features
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    Define gameplay features to attract backers, including core mechanics and level designs. This acts as the foundation for your project presentation and ensures backer engagement.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body1">
                                    <strong>Milestone 2:</strong> Mockups & Optional Withdrawal
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    Showcase mockups, concept art, and prototypes for planned features. <strong>Once the project achieves 20% of its funding target, owners can withdraw 50% of the collected donations (equivalent to 10% of the target).</strong> This option is intended to help fund ongoing development.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </List>

                    {/* Disbursement Milestones Section */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                        Disbursement Milestones
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body1">
                                    <strong>Milestone 3:</strong> Gameplay Beta Version
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    Deliver a functional beta version of the gameplay for backers to test and provide feedback. Funds are disbursed in two phases:
                                    <ul>
                                        <li><strong>50% upon admin approval.</strong></li>
                                        <li><strong>50% upon backer review and milestone completion.</strong></li>
                                    </ul>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body1">
                                    <strong>Milestone 4:</strong> Full Game & Rewards
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">
                                    Submit the final game version, including all promised features and functionalities. Deliver all backer rewards. The final disbursement will be processed as follows:
                                    <ul>
                                        <li><strong>50% upon admin approval.</strong></li>
                                        <li><strong>50% upon milestone completion and backer satisfaction.</strong></li>
                                    </ul>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </List>

                    {/* Refund Policy Section */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                        Refund Policy
                    </Typography>
                    <Typography variant="body1">
                        If a milestone is not completed, backers will be notified, and the remaining funds will be refunded proportionally to the backers.
                    </Typography>

                    {/* Close Button */}
                    <Box sx={{ textAlign: "right", mt: 4 }}>
                        <Button
                            sx={{ bgcolor: "#1BAA64", "&:hover": { bgcolor: "#148445" } }}
                            variant="contained"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MilestonePolicyModal;