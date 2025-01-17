import { Button, Typography } from '@mui/material';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { useOutletContext } from 'react-router';
import likeApiInstance from '../../../utils/ApiInstance/likeApiInstance';

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

function AccountMarketplaceLiked({ project, fetchLikedMarketplaceList }) {
    const { notify } = useOutletContext();
    const token = Cookies.get("_auth");

    const [isLiked, setIsLiked] = useState(null);

    useEffect(() => {
        checkIsProjectLiked();
    }, [project])

    const checkIsProjectLiked = async () => {
        try {
            const response = await likeApiInstance.get(`/get-project-like/${project.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data._statusCode == 200) {
                setIsLiked(response.data._data.isLike);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLikedMarketplaceProject = async () => {
        try {
            const response = await likeApiInstance.post(`marketplace`, {
                projectId: project.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data._statusCode === 200) {
                fetchLikedMarketplaceList();
                notify("Removed successfully", "success");
            }
        } catch (error) {
            notify(
                error.response?.data?.message || error.message || "An error occurred",
                "error"
            );
        }
    }

    return (
        <>
            <div className="flex items-center justify-between rounded-lg">
                <div className="!w-[10rem] !h-[10rem] bg-[#EAEAEA] flex justify-center items-center rounded-lg">
                    <img src={project?.marketplaceFiles?.find(p => p.fileType == 2 && p.isDeleted == false).url} style={{ width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '0.625rem' }} />
                </div>
                <div className="flex-grow max-w-[41rem] h-fit">
                    <div className="flex items-center mb-[0.5rem] gap-[1rem]">
                        <a href={`/funding-detail/${project.id}`}>
                            <Typography
                                sx={{
                                    color: '#2F3645',
                                    maxWidth: "25rem",
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
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
                <div className='flex justify-end items-center min-w-[8rem]'>
                    {isLiked === true ? <Button
                        sx={{
                            backgroundColor: '#F5F7F8',
                            border: '2px solid var(--red)',
                            boxShadow: '0.4rem',
                            p: '0.75rem',
                            color: '#2F3645',
                            minWidth: '0',
                            '&:hover': {
                                backgroundColor: '#DDDDDD',
                            },
                            letterSpacing: '0.5px',
                            zIndex: 2
                        }}
                        onClick={() => handleLikedMarketplaceProject()}
                    >
                        <FaHeart size={'1rem'} style={{ strokeWidth: '1rem', color: 'var(--red)' }} />
                    </Button> : <Button
                        sx={{
                            backgroundColor: '#F5F7F8',
                            border: '2px solid var(--black)',
                            boxShadow: '0.4rem',
                            p: '0.75rem',
                            color: '#2F3645',
                            minWidth: '0',
                            '&:hover': {
                                backgroundColor: '#DDDDDD',
                            },
                            letterSpacing: '0.5px',
                            zIndex: 2
                        }}
                        onClick={() => handleLikedMarketplaceProject()}
                    >
                        <FaRegHeart size={'1rem'} style={{ strokeWidth: '1rem' }} />
                    </Button>}
                </div>
            </div>
        </>
    )
}

export default AccountMarketplaceLiked