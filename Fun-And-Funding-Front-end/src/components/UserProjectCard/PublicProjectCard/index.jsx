import { Button, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import packageBackerApiInstance from "../../../utils/ApiInstance/packageBackerApiInstance";
import DonationHistoryModal from './DonationHistoryModal';

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

function PublicProjectCard({ project, projectType }) {
    const token = Cookies.get("_auth");
    const [openModal, setOpenModal] = useState(false);
    const [donationHistory, setDonationHistory] = useState([])

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        if (projectType == "Funding") {
            fetchDonationHistory();
        }
    }, [project])

    const fetchDonationHistory = async () => {
        try {
            const res = await packageBackerApiInstance.get(`donated-project?projectId=${project.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data._statusCode == 200) {
                console.log(res.data._data);
                setDonationHistory(res.data._data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="flex items-center rounded-lg gap-[2rem]">
                <div className="w-[10rem] h-[10rem] bg-[#EAEAEA] flex justify-center items-center rounded-lg">
                    <img src={projectType == "Funding" ? project?.fundingFiles?.find(p => p.filetype == 2 && p.isDeleted == false).url : project?.marketplaceFiles?.find(p => p.fileType == 2 && p.isDeleted == false).url} style={{ width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '0.625rem' }} />
                </div>
                <div className="flex-grow !w-[12rem] h-fit">
                    <div className="flex items-center mb-[0.5rem] gap-[1rem]">
                        <a href={projectType == "Funding" ? `/funding-detail/${project.id}` : `/marketplace-detail/${project.id}`}>
                            <Typography
                                sx={{
                                    color: '#2F3645',
                                    maxWidth: "25rem",
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    WebkitBoxOrient: 'vertical',
                                }}
                                className='user-project-card'
                            >
                                {project.name}
                            </Typography>
                        </a>
                        <div className='flex items-center'>
                            <span className="ml-[1rem] bg-[#1BAA64] text-[0.75rem] text-[#EAEAEA] px-[0.5rem] py-[0.25rem] rounded font-semibold"
                                style={{ backgroundColor: projectStatus[project.status].color }}>
                                {projectStatus[project.status].name}
                            </span>
                        </div>
                    </div>
                    <Typography sx={{ color: '#2F3645', fontWeight: '600', fontSize: '1rem', mb: '1.25rem' }} >
                        by <span className='text-[#1BAA64]'>{project?.user.userName}</span>
                    </Typography>
                    <Typography
                        sx={{
                            color: '#2F3645',
                            fontWeight: '300',
                            fontSize: '1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                        }}
                    >
                        {project.description}
                    </Typography>
                </div>
                <div className={`min-w-[8rem] ${projectType == "Funding" ? 'visible' : 'hidden'}`}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1BAA64", textTransform: "none" }}
                        onClick={() => handleOpen()}
                    >
                        Show Donation History
                    </Button>
                </div>
            </div>
            <DonationHistoryModal donationList={donationHistory} openModal={openModal} handleClose={handleClose} project={project} />
        </>
    );
}

export default PublicProjectCard;