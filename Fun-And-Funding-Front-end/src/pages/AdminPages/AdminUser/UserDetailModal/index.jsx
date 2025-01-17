import { Avatar, Backdrop, Box, Button, Fade, Grid2, Modal, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsCalendar2Date } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa6";
import { FiCalendar } from 'react-icons/fi';
import { IoWallet } from "react-icons/io5";
import { PiGenderIntersexBold } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import userApiInstance from "../../../../utils/ApiInstance/userApiInstance";
import './index.css';
import UserTransactionTable from "./UserTransactionTable";

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

const userGender = [
    "Male",
    "Female",
    "Other"
];

const UserDetailModal = ({ selectedUserId, openModal, setOpenModal, fetchUserList }) => {
    const token = Cookies.get("_auth");
    const [selectedUser, setSelectedUser] = useState(null);

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
        borderRadius: 1
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedUser(null);
    }

    useEffect(() => {
        if (openModal && selectedUserId) {
            fetchUser();
        }
    }, [selectedUserId, openModal])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('de-DE').format(price);
    };

    const fetchUser = async () => {
        try {
            const res = await userApiInstance.get(`${selectedUserId}`)
            if (res.status == 200) {
                setSelectedUser(res.data._data);
            }
        } catch (error) {
            notify(error.response?.data?.message || error.message || "An error occurred", "error");
        }
    }

    const handleChangeStatus = (status) => {
        try {
            const message = status === 1 ? "Do you want to block this user?" : "Do you want to unblock this user?";
            const actionText = status === 1 ? "Block" : "Unblock";

            Swal.fire({
                title: "Are you sure?",
                text: message,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--red)",
                cancelButtonColor: "var(--grey)",
                cancelButtonText: "Cancel",
                confirmButtonText: "Yes",
                customClass: {
                    popup: 'manage-user-detail-popup',
                    cancelButton: 'manage-user-detail-popup-cancel-button',
                    confirmButton: 'manage-user-detail-popup-confirm-button',
                },
                didOpen: () => {
                    const swalPopup = document.querySelector('.manage-user-detail-popup');
                    swalPopup.style.zIndex = 9999;
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await userApiInstance.patch(`status/${selectedUserId}`, '', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(res.data);
                    if (res.status === 200) {
                        fetchUser();
                        fetchUserList();
                        Swal.fire({
                            title: `${actionText}ed!`,
                            text: `${actionText} the user successfully.`,
                            icon: "success",
                            confirmButtonColor: "var(--primary-green)",
                            confirmButtonText: "I understand",
                            customClass: {
                                popup: 'manage-user-detail-popup',
                            },
                        });
                    }
                }
            });
        } catch (error) {
            notify(error.response?.data?.message || error.message || "An error occurred", "error");
        }
    }

    return (
        <>
            {selectedUser != null && JSON.stringify(selectedUser) !== '{}' && <Modal
                open={openModal}
                onClose={handleClose}
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{ zIndex: '50 !important' }}
            >
                <Fade in={openModal}>
                    <Box sx={style}>
                        <div className="mb-[1.5rem] mx-[0.5rem]">
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Account detail
                            </Typography>
                            <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                Showing account detail of{' '}
                                <span className="text-[var(--primary-green)] font-semibold">
                                    {selectedUser?.userName}
                                </span>
                            </Typography>
                        </div>
                        <Box
                            sx={{
                                height: '30rem',
                                overflowY: 'auto',
                                overflowX: 'visible',
                                px: '0.5rem',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                },
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    bgcolor: 'var(--white)',
                                    py: '1rem',
                                    px: '2rem',
                                    mt: '0.25rem',
                                    mb: '1.5rem',
                                    borderRadius: '0.625rem',
                                }}
                            >
                                <Grid2 container columnSpacing={4} alignItems="center">
                                    <Grid2 xs={4.5}>
                                        <Avatar
                                            src={selectedUser?.avatar ?? ''}
                                            sx={{ width: '6rem', height: '6rem' }}
                                        />
                                    </Grid2>
                                    <Grid2 xs={7.5}>
                                        <Typography sx={{ fontSize: '1.25rem', fontWeight: '600', mb: '0.25rem' }}>
                                            {selectedUser.userName}
                                        </Typography>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: '400' }}>
                                            {selectedUser.email}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                            </Paper>
                            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                                Personal information
                            </Typography>
                            <div className="w-full mb-[2rem]">
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <FaRegAddressCard size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Full name
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.fullName ? '500' : '400',
                                                color: selectedUser.fullName ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {selectedUser.fullName}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <PiGenderIntersexBold size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Gender
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.gender ? '500' : '400',
                                                color: selectedUser.gender ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {selectedUser.gender ? userGender[selectedUser.gender] : "Not set"}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <BsCalendar2Date size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Date of birth
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.dayOfBirth ? '500' : '400',
                                                color: selectedUser.dayOfBirth ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {selectedUser.dayOfBirth ? new Date(selectedUser.dayOfBirth).toLocaleString() : "Not set"}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <AiOutlineHome size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Address
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.address ? '500' : '400',
                                                color: selectedUser.address ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {selectedUser.address ? selectedUser.address : "Not set"}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                            </div>
                            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                                Account information
                            </Typography>
                            <div className="w-full mb-[2rem]">
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <IoWallet size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Wallet balance
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.wallet?.balance ? '500' : '400',
                                                color: selectedUser.wallet?.balance ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {formatPrice(selectedUser.wallet?.balance)} <span className="text-[0.75rem]">VND</span>
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                                <div className="w-full">
                                    <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '1rem' }}>
                                        <Grid2 xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                <FiCalendar size={16} />
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                }}>
                                                    Created Date
                                                </Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 xs={1} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                color: 'var(--grey)'
                                            }}>
                                                :
                                            </Typography>
                                        </Grid2>

                                        <Grid2 xs={8}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                fontWeight: selectedUser.createdDate ? '500' : '400',
                                                color: selectedUser.createdDate ? 'var(--black)' : 'var(--grey)'
                                            }}>
                                                {selectedUser.createdDate ? new Date(selectedUser.createdDate).toLocaleString() : "Not found"}
                                            </Typography>
                                        </Grid2>
                                    </Grid2>
                                </div>
                            </div>
                            <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                                Account transactions
                            </Typography>
                            <UserTransactionTable
                                transactions={
                                    [...(selectedUser.wallet?.transactions || [])].sort(
                                        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                                    )
                                }
                            />
                        </Box>
                        <div className="mx-[0.5rem] pt-[1rem] flex justify-end gap-[1rem] shadow-[0_-4px_4px_-2px_rgba(0,0,0,0.1)]">
                            <Button
                                variant="contained"
                                className="manage-user-detail-cancel-button"
                                onClick={() => handleClose()}
                            >
                                Cancel
                            </Button>
                            {selectedUser?.userStatus === 1 ? <Button
                                variant="contained"
                                className="manage-user-detail-block-button"
                                onClick={() => handleChangeStatus(selectedUser?.userStatus)}
                            >
                                Block Account
                            </Button> :
                                <Button
                                    variant="contained"
                                    className="manage-user-detail-unblock-button"
                                    onClick={() => handleChangeStatus(selectedUser?.userStatus)}
                                >
                                    Unblock Account
                                </Button>}
                        </div>
                    </Box>
                </Fade>
            </Modal >
            }
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                pauseOnFocusLoss
            />
        </>
    )
}

export default UserDetailModal