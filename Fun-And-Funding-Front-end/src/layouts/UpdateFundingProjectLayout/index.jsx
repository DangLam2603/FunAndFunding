/* eslint-disable no-unused-vars */
import EmailIcon from '@mui/icons-material/Email';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from '@mui/icons-material/Info';
import {
    Backdrop,
    Box,
    Button,
    Collapse,
    Container,
    Fade,
    Grid2,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Modal,
    TextareaAutosize,
    Tooltip,
    Typography
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "sweetalert2";
import Swal from 'sweetalert2';
import ProjectEditorInstruction from "../../components/ProjectEditorInstruction";
import fundingProjectApiInstace from "../../utils/ApiInstance/fundingProjectApiInstance";
import milestoneApiInstace from "../../utils/ApiInstance/milestoneApiInstance";
import "./index.css";
import ProjectContext from './UpdateFundingProjectContext';
import { editorList, milestoneList } from './UpdateFundingProjectLayout';

const projectStatus = {
    0: { name: "Deleted", color: "var(--red)" },
    1: { name: "Pending", color: "#FFC107" },
    2: { name: "Processing", color: "#2196F3" },
    3: { name: "Funded Successful", color: "var(--primary-green)" },
    4: { name: "Successful", color: "var(--primary-green)" },
    5: { name: "Failed", color: "var(--red)" },
    6: { name: "Rejected", color: "var(--red)" },
    7: { name: "Approved", color: "var(--primary-green)" },
    8: { name: "Withdrawed", color: "#9C27B0" },
    9: { name: "Refunded", color: "#FF5722" },
    10: { name: "Reported", color: "#E91E63" },
};

const notify = (message, type) => {
    const options = {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
            backgroundColor: "#ffffff",
            color: "#2F3645",
            fontWeight: "600",
        },
    };

    if (type === "warn") {
        toast.warn(message, options);
    } else if (type === "success") {
        toast.success(message, options);
    } else if (type === "error") {
        toast.error(message, options);
    }
};

function UpdateFundingProjectLayout() {
    const noteStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '35%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        px: '2rem',
        py: '2rem',
        height: 'fit-content',
        borderRadius: 1
    };

    const token = Cookies.get("_auth");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditExpanded, setIsEditExpanded] = useState(false);
    const [isMilestoneExpanded, setIsMilestoneExpanded] = useState(false);
    const [edited, setIsEdited] = useState(false);
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showInstruction, setShowInstruction] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(0);
    const [currentMilestoneList, setCurrentMilestoneList] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState("");
    const [selectedInstructionIndex, setSelectedInstructionIndex] = useState(0);
    const [openNoteModal, setOpenNoteModal] = useState(false);

    const handleNoteClose = () => {
        setOpenNoteModal(false);
    }

    const disbursement = 2;
    const funding = 1;
    const processing = 2;
    const fundedSuccess = 3;
    const approved = 7;

    //fetch milestones
    const fetchMilestones = async (status) => {
        setIsLoading(true);
        if (status == 7 || status == 2 || status == 3 || status == 4) {
            await milestoneApiInstace
                .get(`/group-latest-milestone?filter=${status == processing || status == approved ? 1 : 0}`)
                .then((response) => {
                    setCurrentMilestoneList(response.data._data);
                    setIsLoading(false);
                });
        } else {
            setCurrentMilestoneList([]);
        }
    };

    const handleSaveAll = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            setLoadingStatus(2);

            const formData = new FormData();

            formData.append('Id', id);
            formData.append('Name', project.name);
            formData.append('Description', project.description);
            formData.append('Introduction', project.introduction);

            if (project.wallet.bankAccount) {
                formData.append('BankAccount.Id', project.wallet.bankAccount.id);
                formData.append('BankAccount.BankNumber', project.wallet.bankAccount.bankNumber);
                formData.append('BankAccount.BankCode', project.wallet.bankAccount.bankCode);
            }

            project.packages.forEach((packageItem, index) => {
                formData.append(`Packages[${index}].Id`, packageItem.id);
                formData.append(`Packages[${index}].Name`, packageItem.name);
                formData.append(`Packages[${index}].RequiredAmount`, packageItem.requiredAmount);
                formData.append(`Packages[${index}].Description`, packageItem.description);
                formData.append(`Packages[${index}].LimitQuantity`, packageItem.limitQuantity);
                if (packageItem.updatedImage) {
                    formData.append(`Packages[${index}].UpdatedImage`, packageItem.updatedImage);
                }
                packageItem.rewardItems.forEach((reward, rewardIndex) => {
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Id`, reward.id);
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Name`, reward.name);
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Description`, reward.description);
                    formData.append(`Packages[${index}].RewardItems[${rewardIndex}].Quantity`, reward.quantity);
                    if (reward.imageFile) {
                        formData.append(`Packages[${index}].RewardItems[${rewardIndex}].ImageFile`, reward.imageFile);
                    }
                });
            });

            if (project.fundingFiles) {
                project.fundingFiles.forEach((file, index) => {
                    formData.append(`FundingFiles[${index}].Id`, file.id);
                    formData.append(`FundingFiles[${index}].Name`, file.name);
                    formData.append(`FundingFiles[${index}].UrlFile`, file.urlFile);
                    formData.append(`FundingFiles[${index}].Filetype`, file.filetype);
                    formData.append(`FundingFiles[${index}].IsDeleted`, file.isDeleted);
                });
            }
            if (project.existedFile) {
                project.existedFile.forEach((file, index) => {
                    formData.append(`ExistedFile[${index}].Id`, file.id);
                    formData.append(`ExistedFile[${index}].Name`, file.name);
                    formData.append(`ExistedFile[${index}].Url`, file.url);
                    formData.append(`ExistedFile[${index}].Filetype`, file.filetype);
                    formData.append(`ExistedFile[${index}].IsDeleted`, file.isDeleted);
                });
            }

            const response = await fundingProjectApiInstace.put('', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                notify('Project saved successfully!', "success");
                setIsEdited(false);
            } else {
                console.error(`Unexpected status code: ${response.error}`);
                notify(response.error || "An error occurred", "error");
            }
        } catch (error) {
            notify(error.response?.data?.message || error.message || "An error occurred", "error");
            console.log(error)
        } finally {
            setIsLoading(false);
            setLoadingStatus(0);
        }
    };

    const handleDiscardAll = async () => {
        setIsLoading(true);
        setLoadingStatus(4);
        fetchProject();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsEdited(false);
        setIsLoading(false);
        setLoadingStatus(0);
    };

    useEffect(() => {
        if (localStorage.getItem('confirm_instruction') !== 'true') {
            setShowInstruction(true);
        }
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        console.log(token);
        try {
            if (!token) {
                navigate('/home');
            }
            setIsLoading(true);
            const response = await fundingProjectApiInstace.get(`/owner/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            if (response && response.data) {
                const project = response.data._data;
                const filteredPackages = project.packages.filter(
                    (pkg) => pkg.packageTypes !== 0
                );

                const existedFile = project.fundingFiles.map((file) => ({
                    id: file.id,
                    name: file.name,
                    url: file.url,
                    urlFile: null,
                    filetype: file.filetype,
                    isDeleted: file.isDeleted,
                    newlyAdded: false,
                }));

                setProject({
                    ...project,
                    packages: filteredPackages,
                    fundingFiles: null,
                    existedFile: existedFile,
                });
                fetchMilestones(project.status);
            } else {
                console.error("No project data found");
            }
        } catch (error) {
            console.log(error);
            if (error) {
                Swal.fire({
                    title: "Error",
                    text: "You are not owner of this project",
                    icon: "error",
                });
                navigate("/home");
            }
            if (error.response) {
                console.error("Server responded with an error:", error.response.data);
                console.error("Status code:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditExpanded(!isEditExpanded);
    };
    const handleMilestoneToggle = () => {
        setIsMilestoneExpanded(!isMilestoneExpanded);
    };

    const handleMilestoneNavigation = (milestoneId, index) => {
        navigate(`/account/projects/update/${id}/milestone${index}`, {
            state: { milestoneId },
        });
    };

    const handleNavigatePreview = (id) => {
        navigate(`/account/projects/update/${id}/preview`);
    };

    const handleNavigateOverview = (id) => {
        navigate(`/account/projects/update/${id}/milestone-overview`);
    };

    const handleNavigation = (link) => {
        navigate(link);
    };

    const getActiveEditor = (id) => {
        const matchedEditor = editorList.find((item) =>
            location.pathname.includes(item.link(id))
        );
        return matchedEditor ? `Project Editor / ${matchedEditor.name}` : "";
    };

    const getActiveMilestone = (id) => {
        const matchedMilestone = milestoneList.find((item) =>
            location.pathname.includes(item.link(id))
        );
        return matchedMilestone ? `Project Milestone / ${matchedMilestone.name}` : "";
    };

    const getActiveMilestoneOrder = (id) => {
        const matchedMilestone = milestoneList.find((item) =>
            location.pathname.includes(item.link(id))
        );
        return matchedMilestone ? `${matchedMilestone.name}` : "";
    };

    const getActivePreview = () => {
        const matchedPreview = location.pathname.includes('preview');
        return matchedPreview ? `Project Preview` : "";
    };

    const getActiveOverview = () => {
        console.log(location.pathname)
        const matchedOverview = location.pathname.includes('milestone-overview');
        console.log(matchedOverview);
        return matchedOverview ? `Project Milestone / Milestone Overview` : "";
    };

    const isEditorActive = editorList.some((item) =>
        location.pathname.includes(item.link(id))
    );

    const isMilestoneActive = milestoneList.some((item) =>
        location.pathname.includes(item.link(id))
    );

    const isPreviewActive = location.pathname.includes('preview');

    const isOverviewActive = location.pathname.includes('milestone-overview');

    const getActiveSection = (id) => {
        const activeEditor = getActiveEditor(id);
        const activePreview = getActivePreview(id);
        const activeOverview = getActiveOverview(id);
        const activeMilestone = getActiveMilestone(id);
        if (activeEditor) {
            return activeEditor
        };
        if (activePreview) {
            return activePreview
        };
        if (activeOverview) {
            return activeOverview
        };
        if (activeMilestone) {
            return activeMilestone
        };
        return "Unknown Section";
    };

    const handleConfirmInstruction = (value) => {
        setShowInstruction(value);
        localStorage.setItem('confirm_instruction', true);
    }

    const handleOpenInstruction = () => {
        if (isPreviewActive) {
            setSelectedInstructionIndex(1);
        } else if (isEditorActive) {
            setSelectedInstructionIndex(2);
        } else if (isMilestoneActive || isOverviewActive) {
            setSelectedInstructionIndex(3);
        } else {
            setSelectedInstructionIndex(0);
        }
        setShowInstruction(true);
    }

    return (
        <ProjectContext.Provider
            value={{
                project,
                edited,
                isLoading,
                loadingStatus,
                setProject,
                setIsEdited,
                setIsLoading,
                setLoadingStatus,
            }}
        >
            <ProjectEditorInstruction showInstruction={showInstruction} setShowInstruction={(value) => handleConfirmInstruction(value)} selectedIndex={selectedInstructionIndex} />
            <Container
                sx={{
                    mx: "0",
                    px: "0 !important",
                    width: "100% !important",
                    maxWidth: "100% !important",
                }}
            >
                <Grid2 container>
                    <Grid2
                        size={2.5}
                        sx={{
                            minHeight: "100vh",
                            backgroundColor: "#2F3645",
                            pt: "4rem",
                            color: "#F5F7F8",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "relative",
                            overflow: "visible",
                        }}
                    >
                        {project?.note != null && project.note.length > 0 &&
                            <div className='absolute top-3 right-4'>
                                <Tooltip title="Show admin feedback" arrow>
                                    <IconButton onClick={() => setOpenNoteModal(true)} sx={{ padding: 0, ml: '1.5rem' }}>
                                        <Box
                                            sx={{
                                                backgroundColor: "var(--white)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "1.25rem",
                                                height: "1rem",
                                            }}
                                        >
                                            <EmailIcon
                                                sx={{
                                                    width: "1.75rem",
                                                    height: "1.75rem",
                                                    color: "var(--primary-green)",
                                                }}
                                            />
                                        </Box>
                                    </IconButton>
                                </Tooltip>
                            </div>}
                        <div className="sticky mb-[8rem] top-[1.5rem] z-10">
                            <div className="flex flex-col gap-[0.5rem] px-[2rem]">
                                <div>
                                    <span
                                        className={`text-[#EAEAEA] text-[0.75rem] px-[0.5rem] py-[0.25rem] rounded w-fit font-semibold ${project.status != null
                                            ? `bg-[${projectStatus[project.status].color}]`
                                            : "bg-[#FABC3F]"
                                            } `}
                                    >
                                        {project.status != null
                                            ? projectStatus[project.status].name : "Unknown Status"}
                                    </span>
                                </div>
                                <Typography
                                    sx={{
                                        color: "#F5F7F8",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        userSelect: "none",
                                        width: "100%",
                                    }}
                                >
                                    {project.name ? project.name : "N/A"}
                                </Typography>
                            </div>
                            <div>
                                <div className="mt-[2rem]">
                                    <Typography
                                        className="update-project-section"
                                        onClick={() => handleNavigatePreview(id)}
                                        sx={{
                                            backgroundColor:
                                                isPreviewActive
                                                    ? "#88D1AE"
                                                    : "transparent",
                                            color:
                                                isPreviewActive
                                                    ? "#F5F7F8"
                                                    : "inherit",
                                        }}
                                    >
                                        Project Preview
                                    </Typography>

                                </div>
                                <div>
                                    <Typography
                                        className="update-project-section"
                                        onClick={handleEditToggle}
                                        sx={{
                                            backgroundColor:
                                                isEditorActive && !isEditExpanded
                                                    ? "#88D1AE"
                                                    : "transparent",
                                            color:
                                                isEditorActive && !isEditExpanded
                                                    ? "#F5F7F8"
                                                    : "inherit",
                                        }}
                                    >
                                        Project Editor
                                        <IconButton sx={{ color: "#F5F7F8", ml: 1 }} size="small">
                                            {isEditExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Typography>
                                    <Collapse in={isEditExpanded} timeout="auto" unmountOnExit>
                                        <List component="nav">
                                            {editorList.map((item) => (
                                                <ListItem
                                                    button
                                                    key={item.name}
                                                    onClick={() => handleNavigation(item.link(id))}
                                                    sx={{
                                                        backgroundColor: location.pathname.includes(
                                                            item.link(id)
                                                        )
                                                            ? "#88D1AE"
                                                            : "transparent",
                                                        "&:hover": {
                                                            backgroundColor: "#88D1AE",
                                                            "& .MuiListItemText-root": {
                                                                color: "#F5F7F8",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={item.name}
                                                        sx={{
                                                            color: location.pathname.includes(
                                                                item.link(id)
                                                            )
                                                                ? "#F5F7F8"
                                                                : "#F5F7F8",
                                                            fontSize: "1rem",
                                                            fontWeight: "600",
                                                            height: "2rem",
                                                            px: "2rem",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </div>
                                <div>
                                    <Typography
                                        className="update-project-section"
                                        onClick={handleMilestoneToggle}
                                        sx={{
                                            backgroundColor:
                                                isMilestoneActive && !isMilestoneExpanded
                                                    ? "#88D1AE"
                                                    : "transparent",
                                            color:
                                                isMilestoneActive && !isMilestoneExpanded
                                                    ? "#F5F7F8"
                                                    : "inherit",
                                        }}
                                    >
                                        Project Milestones
                                        <IconButton sx={{ color: "#F5F7F8", ml: 1 }} size="small">
                                            {isMilestoneExpanded ? (
                                                <ExpandLessIcon />
                                            ) : (
                                                <ExpandMoreIcon />
                                            )}
                                        </IconButton>
                                    </Typography>
                                    <Collapse
                                        in={isMilestoneExpanded}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="nav">
                                            <ListItem
                                                key={-1}
                                                button
                                                onClick={() => handleNavigateOverview(id)}
                                                sx={{
                                                    backgroundColor: isOverviewActive
                                                        ? "#88D1AE"
                                                        : "transparent",
                                                    "&:hover": {
                                                        backgroundColor: "#88D1AE",
                                                        "& .MuiListItemText-root": {
                                                            color: "#F5F7F8",
                                                        },
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary="Milestone Overview"
                                                    sx={{
                                                        color: "#F5F7F8",
                                                        fontSize: "1rem",
                                                        fontWeight: "600",
                                                        height: "2rem",
                                                        px: "2rem",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </ListItem>
                                            {currentMilestoneList.map((item, index) => (
                                                <ListItem
                                                    button
                                                    key={item.milestoneName}
                                                    onClick={() =>
                                                        handleMilestoneNavigation(item.id, item.milestoneOrder)
                                                    }
                                                    sx={{
                                                        backgroundColor: getActiveMilestoneOrder(id) === item.milestoneName
                                                            ? "#88D1AE"
                                                            : "transparent",
                                                        "&:hover": {
                                                            backgroundColor: "#88D1AE",
                                                            "& .MuiListItemText-root": {
                                                                color: "#F5F7F8",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={item.milestoneName}
                                                        sx={{
                                                            color: "#F5F7F8",
                                                            fontSize: "1rem",
                                                            fontWeight: "600",
                                                            height: "2rem",
                                                            px: "2rem",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                    </Grid2>
                    <Grid2 size={9.5} style={{ position: "relative" }}>
                        <div>
                            <div className="fixed-update-header">
                                <div className="flex flex-row justify-start items-center">
                                    <Typography
                                        sx={{
                                            color: "#2F3645",
                                            fontSize: "1rem",
                                            fontWeight: "700",
                                            userSelect: "none",
                                            width: "100%",
                                        }}
                                    >
                                        {getActiveSection(id)}
                                    </Typography>
                                    <Tooltip title="Show information" arrow>
                                        <IconButton onClick={() => handleOpenInstruction()}>
                                            <InfoIcon
                                                sx={{
                                                    fontSize: "1.2rem",
                                                    color: "var(--black)",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div className={`${isEditorActive ? 'flex' : 'hidden'} justify-between gap-[1.5rem] items-center w-fit`}>
                                    <Typography
                                        sx={{
                                            color: "#2F3645",
                                            fontSize: "1rem",
                                            fontWeight: "400",
                                            userSelect: "none",
                                            width: "fit-content",
                                        }}
                                    >
                                        Have you finished?
                                    </Typography>
                                    <div className="flex gap-[1rem]">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            disabled={!edited}
                                            sx={{
                                                backgroundColor: "transparent",
                                                textTransform: "none",
                                            }}
                                            onClick={() => handleDiscardAll()}
                                        >
                                            Discard All Changes
                                        </Button>
                                        <Button
                                            variant="contained"
                                            disabled={!edited}
                                            sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
                                            onClick={(event) => handleSaveAll(event)}
                                        >
                                            Save All Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Outlet />
                        </div>
                    </Grid2>
                </Grid2>
            </Container>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                pauseOnFocusLoss
            />
            <Modal open={openNoteModal} onClose={handleNoteClose} slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{ zIndex: '1000000 !important' }}>
                <Fade in={openNoteModal}>
                    <Box sx={noteStyle}>
                        <div className="flex justify-center flex-col items-center mb-[2rem]">
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Admin feedback
                            </Typography>
                            <Typography sx={{ mt: '0.25rem', fontSize: '1rem', fontWeight: 400 }}>
                                Admin provides reasons to why this project is rejected.
                            </Typography>
                        </div>
                        <TextareaAutosize
                            minRows={10}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--light-grey)',
                                borderRadius: '4px',
                                outline: 'none',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                            }}
                            value={project?.note ?? null}
                            disabled
                            onFocus={(e) => (e.target.style.border = '1px solid var(--black)')}
                            onBlur={(e) => (e.target.style.border = '1px solid var(--light-grey)')}
                        />
                    </Box>
                </Fade>
            </Modal>
        </ProjectContext.Provider>
    );
}

export default UpdateFundingProjectLayout;
