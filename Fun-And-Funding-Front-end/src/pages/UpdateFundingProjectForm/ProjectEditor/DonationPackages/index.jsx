import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmptyIcon from '../../../../assets/images/image_empty.png';
import NoImage from '../../../../assets/images/no-image.png';
import ProjectContext from '../../../../layouts/UpdateFundingProjectLayout/UpdateFundingProjectContext';
import EditPackageModal from './EditPackageModal';
import './index.css';

function Packages() {
    const { id } = useParams();
    const { project, setProject, setIsEdited, setIsLoading, setLoadingStatus } = useContext(ProjectContext);
    const [projectPackages, setProjectPackages] = useState(project.packages || []);
    const [donationLimit, setDonationLimit] = useState(40000);
    const [donationError, setDonationError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageEdited, isPackageEdited] = useState(false);
    const [isNewPackage, setIsNewPackage] = useState(true);

    useEffect(() => {
        setProjectPackages(project.packages || []);
    }, [id, project]);

    const handleDonationLimit = (e) => {
        const value = e.target.value;
        if (value < 10000 || value > 100000) {
            setDonationError(true);
        } else {
            setDonationError(false);
        }
        setDonationLimit(value);
    };

    const handleOpenModal = (pkg) => {
        setSelectedPackage(pkg);
        setIsNewPackage(false);
        setOpenModal(true);
    };

    const handleOpenAddModal = () => {
        setSelectedPackage(null);
        setIsNewPackage(true);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDiscardAll = async () => {
        setIsLoading(true);
        setLoadingStatus(4);
        setProjectPackages(project.packages || []);
        setIsLoading(false);
        setLoadingStatus(0);
    }

    const handleSaveAll = async () => {
        setIsLoading(true);
        setLoadingStatus(2);
        const updatedProject = {
            ...project,
            packages: projectPackages,
        };
        setProject(updatedProject);
        setIsEdited(true);
        isPackageEdited(false);
        setIsLoading(false);
        setLoadingStatus(0);
    }

    const generateGUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const handleUpdatePackage = (updatedPackage) => {
        setIsLoading(true);
        setLoadingStatus(2);
        console.log(updatedPackage);
        if (updatedPackage.id) {
            const updatedPackages = projectPackages.map(pkg =>
                pkg.id === updatedPackage.id ? updatedPackage : pkg
            );
            setProjectPackages(updatedPackages);
        } else {
            updatedPackage.id = generateGUID();
            setProjectPackages((prevPackages) => [...prevPackages, updatedPackage]);
        }
        isPackageEdited(true);
        handleCloseModal();
        setIsLoading(false);
        setLoadingStatus(0);
    };

    return (
        <div className='w-full pb-[3rem]'>
            <div className='basic-info-section !mb-[2rem]'>
                <Typography
                    sx={{
                        color: '#2F3645',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        userSelect: 'none',
                        width: '70%',
                        marginBottom: '1rem'
                    }}
                >
                    Donation Packages
                </Typography>
                <Typography
                    sx={{
                        color: '#2F3645',
                        fontSize: '1rem',
                        fontWeight: '400',
                        userSelect: 'none',
                        width: '70%',
                    }}
                >
                    Set up your donate packages with corresponding rewards.
                </Typography>
            </div>
            <div className='basic-info-section !mb-[2rem]'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    All Packages<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%' }}
                >
                    Set up support packages along with accompanying items and perks.
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ borderColor: '#2F3645', color: '#2F3645', textTransform: 'none', mb: '1rem' }}
                    onClick={handleOpenAddModal}
                >
                    Add New Package
                </Button>
                <div className='w-[70%] block' style={{ borderRadius: '0.625rem', overflow: 'hidden' }}>
                    {projectPackages.length > 0 ? (
                        <Table width="100%" sx={{
                            borderCollapse: 'separate', borderSpacing: 0, borderRadius: '0.625rem', tableRow: {
                                "&:last-child th, &:last-child td": {
                                    borderBottom: '0 !important',
                                },
                            },
                        }}>
                            <TableHead sx={{ backgroundColor: '#2F3645', borderTopLeftRadius: '0.625rem', borderTopRightRadius: '0.625rem' }}>
                                <TableRow>
                                    <TableCell align="left" className='package-table-cell' sx={{ pl: '1.5rem !important' }}>
                                        Image
                                    </TableCell>
                                    <TableCell align="left" className='package-table-cell'>Name</TableCell>
                                    <TableCell align="right" className='package-table-cell'>Quantity</TableCell>
                                    <TableCell align="right" className='package-table-cell'>Price</TableCell>
                                    <TableCell align="right" className='package-table-cell'>Rewards</TableCell>
                                    <TableCell align="right" className='package-table-cell' sx={{ pr: '1.5rem !important' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projectPackages.map((row, index) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#F5F7F8' : '#EAEAEA',
                                            '&:last-child': { borderBottom: 'none !important' },
                                        }}
                                    >
                                        <TableCell component="th" scope="row" align="left" sx={{ pl: '1.5rem !important', border: 'none' }}>
                                            {row.url ? (
                                                <img className='w-[5rem] h-[5rem] object-cover rounded-[0.25rem]' src={row.url} alt={row.name} />
                                            ) : (
                                                <img className='w-[5rem] h-[5rem] object-cover rounded-[0.25rem]' src={NoImage} alt='No Image Available' />
                                            )}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="left" sx={{ fontWeight: '500', border: 'none' }}>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right" sx={{ border: 'none' }}>{row.limitQuantity}</TableCell>
                                        <TableCell align="right" sx={{ border: 'none' }}>{row.requiredAmount}</TableCell>
                                        <TableCell align="right" sx={{ border: 'none' }}>
                                            {row.rewardItems.length} item{row.rewardItems.length >= 2 ? 's' : ''}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ pr: '1.5rem !important', '&:last-of-type': { borderRadius: '0.625rem bottomLeft bottomRight' }, border: 'none' }}
                                        >
                                            <IconButton
                                                sx={{
                                                    color: '#2F3645',
                                                    border: '1px solid #2F3645',
                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    '&:hover': {
                                                        borderColor: '#2F3645',
                                                    },
                                                }}
                                                onClick={() => handleOpenModal(row)}
                                            >
                                                <EditIcon sx={{ color: '#2F3645' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className='bg-[#EAEAEA] w-full h-fit rounded flex justify-center items-center'>
                            <div className='my-[2rem]'>
                                <img className='w-[10rem] h-[10rem] mb-[1rem]' src={EmptyIcon} alt="data unavailable" />
                                <div className='font-semibold text-[#8D9098]'>Nothing to show here</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Box className='basic-info-section'>
                <div className='w-[70%]'>
                    <Divider sx={{ border: '1px solid #EAEAEA', borderRadius: '0.625rem' }} />
                </div>
            </Box>
            <div className='basic-info-section !mb-[2rem]'>
                <Typography
                    className='basic-info-title'
                    sx={{ width: '70%', }}
                >
                    Grading limit for free donation<span className='text-[#1BAA64]'>*</span>
                </Typography>
                <Typography
                    className='basic-info-subtitle'
                    sx={{ width: '70%' }}
                >
                    Although the project offer a free donation option, but if a backer donates over a certain amount, they can join other package donors in grading the project milestones.
                    This allows higher-tier supporters to participate in evaluating key progress updates.
                </Typography>
                <Box display="flex" justifyContent="start" alignItems="center" width="70%" mt="2rem" gap="3rem">
                    <Typography className='basic-info-subtitle !font-semibold'>
                        Free donation must be higher or equal to
                    </Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" width="100%" gap="1rem">
                        <Box sx={{ width: '100%', position: 'relative', height: '3.5rem' }}>
                            <TextField
                                value={donationLimit}
                                className="custom-update-textfield"
                                type='number'
                                placeholder="Enter your donation limit"
                                onChange={handleDonationLimit}
                                sx={{ width: '100%' }}
                                helperText={donationError ? "Value must be between 10,000 and 100,000" : " "}
                                slotProps={{
                                    htmlInput: {
                                        min: 10000,
                                        max: 100000,
                                        step: 1000
                                    },
                                }}
                            />
                        </Box>
                        <Typography sx={{ marginLeft: '0.5rem' }}>VND</Typography>
                    </Box>
                </Box>
            </div>
            <div className='basic-info-section !mb-0'>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '70%', gap: '1rem' }}>
                    <Button variant='outlined' color='error' disabled={!packageEdited} sx={{ backgroundColor: 'transparent', textTransform: 'none' }} onClick={() => handleDiscardAll()}>
                        Discard
                    </Button>
                    <Button variant='contained' disabled={!packageEdited} sx={{ backgroundColor: '#1BAA64', textTransform: 'none' }} onClick={() => handleSaveAll()}>
                        Save
                    </Button>
                </Box>
            </div>
            <EditPackageModal open={openModal} pkg={selectedPackage} handleClose={handleCloseModal} handleUpdatePackage={handleUpdatePackage} isNewPackage={isNewPackage} />
        </div >
    )
}

export default Packages