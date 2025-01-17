import CheckIcon from '@mui/icons-material/Check';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, CircularProgress, Dialog, Fade, IconButton, Modal, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import Lightbox from 'react-18-image-lightbox';
import NoImage from '../../../../assets/images/no-image.png';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    px: '2rem',
    py: '2rem',
    minHeight: '90%',
    borderRadius: 1,
    zIndex: 900
};

const packageType = {
    0: { name: "Free", backgroundColor: "var(--grey)", color: "var(--white)" },
    1: { name: "Package", backgroundColor: "var(--primary-green)", color: "var(--white)" },
}

function DonationHistoryModal({ donationList, openModal, handleClose, project }) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [selectedPackageEvidence, setSelectedPackageEvidence] = useState([]);
    const [photoIndex, setPhotoIndex] = useState(0);

    const handleClickOpen = (item) => {
        setSelectedItem(item);
        setOpen(true);
    }

    const handleCloseDiaglog = () => {
        setSelectedItem({});
        setOpen(false);
    };

    const handleOpenLightBox = (item) => {
        setSelectedPackageEvidence(item);
        setIsImageOpen(true);
    }

    const handleCloseLightBox = () => {
        setIsImageOpen(false);
        setSelectedPackageEvidence([]);
        setPhotoIndex(0);
    }

    return (
        <>
            <Modal open={openModal} onClose={handleClose} sx={{ zIndex: 1200 }}>
                <Fade in={openModal}>
                    <Box sx={style}>
                        {donationList != null && donationList.length > 0 &&
                            <>
                                <div className="mb-[1.5rem] mx-[0.5rem]">
                                    <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                        Donation History
                                    </Typography>
                                    <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                        Showing your package donation history in{" "}
                                        <span className="text-[var(--primary-green)] font-semibold">
                                            {project?.name}
                                        </span>
                                    </Typography>
                                </div>
                                <div className='mx-[0.5rem]'>
                                    <Paper
                                        sx={{
                                            width: '100%',
                                            p: '1rem',
                                            height: '2',
                                            borderRadius: '0.625rem',
                                            boxShadow: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            gap: '0.5rem',
                                            mb: '0.5rem'
                                        }}
                                        elevation={3}
                                    >
                                        <Typography sx={{ width: '15%', fontWeight: 600 }}>Image</Typography>
                                        <Typography sx={{ width: '25%', fontWeight: 600 }}>Name</Typography>
                                        <Typography sx={{ width: '15%', fontWeight: 600 }}>Date</Typography>
                                        <Typography sx={{ width: '10%', mr: '0.5rem', fontWeight: 600 }}>Type</Typography>
                                        <Typography sx={{ width: '25%', fontWeight: 600, textAlign: 'center' }}>Amount</Typography>
                                        <Typography sx={{ width: '10%', fontWeight: 600 }}>Items</Typography>
                                    </Paper>
                                </div>
                                <Box
                                    sx={{
                                        height: '27rem',
                                        overflowY: 'auto',
                                        overflowX: 'visible',
                                        px: '0.5rem',
                                        scrollbarWidth: 'none',
                                        '&::-webkit-scrollbar': {
                                            display: 'none'
                                        },
                                        pb: '1rem'
                                    }}
                                >
                                    {donationList.map((item, index) => <Paper
                                        index={index}
                                        sx={{
                                            width: '100%',
                                            mt: '1rem',
                                            p: '1rem',
                                            position: 'relative',
                                            height: 'fit-content',
                                            borderRadius: '0.625rem',
                                            boxShadow: item.evidenceImages != null && item.evidenceImages.length > 0 ? '0px 4px 8px rgba(27, 170, 100, 0.6)' : '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        elevation={3}
                                    >
                                        {item.evidenceImages != null && item.evidenceImages.length > 0 &&
                                            <div className='flex flex-row absolute bg-[var(--primary-green)] top-0 right-0 rounded-tr-[0.625rem] rounded-bl-[0.625rem] py-[0.25rem] px-[0.75rem] !text-[var(--white)]'>
                                                <div className='flex flex-row justify-center font-semibold text-[0.875rem] items-center'>
                                                    <CheckIcon sx={{ fontSize: '1rem', strokeWidth: '2px', mr: '0.25rem', stroke: 'currentcolor', }} />
                                                    Delivered
                                                </div>
                                                <span className='mx-[0.5rem] text-[0.875rem]'>|</span>
                                                <Tooltip onClick={() => handleOpenLightBox(item.evidenceImages)} title="Show evidence images" arrow>
                                                    <IconButton sx={{ padding: 0 }}>
                                                        <ImageIcon
                                                            sx={{
                                                                fontSize: '1rem',
                                                                color: "var(--white)",
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        }
                                        <div className='w-[15%]'>
                                            <div className="overflow-hidden flex justify-start items-center w-fit my-[0.5rem]">
                                                <img class=" object-cover rounded-[0.625rem] h-[6rem]" alt="Package image" src={item.packageUrl == '' ? NoImage : item.packageUrl} />
                                            </div>
                                        </div>
                                        <Typography sx={{ width: '25%' }}>
                                            <Typography
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 3,
                                                    width: '90%',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.packageName}
                                            </Typography>
                                        </Typography>
                                        <Typography sx={{ width: '15%', fontWeight: 400 }}>{new Date(item.createDate).toLocaleString()}</Typography>
                                        <Typography sx={{ width: '10%', mr: '0.5rem', fontWeight: 600, backgroundColor: packageType[item.types].backgroundColor, color: packageType[item.types].color, textAlign: 'center', fontSize: '0.75rem', height: 'fit-content', borderRadius: '0.625rem', py: '0.25rem' }}>{packageType[item.types].name}</Typography>
                                        <Typography sx={{ width: '25%', fontWeight: 600, textAlign: 'center' }}>{new Intl.NumberFormat('de-DE').format(item.donateAmount)} VND</Typography>
                                        <Typography sx={{ width: '10%', fontWeight: 600 }}>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#1BAA64", textTransform: "none", visibility: item.types == 0 ? 'hidden' : 'visible' }}
                                                onClick={() => handleClickOpen(item.rewardItems)}
                                            >
                                                Show
                                            </Button>
                                        </Typography>
                                    </Paper>)}
                                </Box>
                            </>
                        }
                    </Box>
                </Fade>
            </Modal>
            <Dialog
                open={open}
                onClose={handleCloseDiaglog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '30rem',
                        maxWidth: '30rem',
                        p: '2rem',
                    },
                }}
            >
                <Typography sx={{ fontSize: '1.5rem', fontWeight: '700', width: '100%', textAlign: 'left' }}>
                    Reward Item List
                </Typography>
                <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400, mb: '2rem' }}>
                    Showing all package reward items
                </Typography>
                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: '25rem',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    {selectedItem != null && selectedItem.length > 0 ?
                        selectedItem.map((item, index) =>
                            <div className='flex justify-between items-center mb-[1rem]' key={index}>
                                <img src={item.imageUrl ?? NoImage} style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: '0.625rem' }} />
                                <div className='flex flex-col justify-start'>
                                    <Typography sx={{ fontSize: '1.25rem', fontWeight: '700', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.rewardName}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: '400', mb: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '12rem' }}>
                                        {item.description}
                                    </Typography>
                                </div>
                                <div className='my-auto w-[6rem]'>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: '500', mb: '0.25rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '6rem', textAlign: 'right' }}>
                                        Qty: {item.quantity}
                                    </Typography>
                                </div>
                            </div>
                        ) : <div className='w-full flex justify-center'>
                            <CircularProgress sx={{ color: 'var(--grey)' }} />
                        </div>
                    }
                </Box>
            </Dialog>
            {isImageOpen && selectedPackageEvidence != null && selectedPackageEvidence.length > 0 && (
                <Lightbox
                    mainSrc={selectedPackageEvidence[photoIndex].url}
                    nextSrc={
                        photoIndex < selectedPackageEvidence.length - 1
                            ? selectedPackageEvidence[photoIndex + 1].url
                            : undefined
                    }
                    prevSrc={
                        photoIndex > 0
                            ? selectedPackageEvidence[photoIndex - 1].url
                            : undefined
                    }
                    onCloseRequest={handleCloseLightBox}
                    onMovePrevRequest={() =>
                        photoIndex > 0 && setPhotoIndex(photoIndex - 1)
                    }
                    onMoveNextRequest={() =>
                        photoIndex < selectedPackageEvidence.length - 1 && setPhotoIndex(photoIndex + 1)
                    }
                    reactModalStyle={{
                        overlay: {
                            zIndex: 2000,
                        },
                    }}
                />
            )}

        </>
    )
}

export default DonationHistoryModal