import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Backdrop, Box, Button, Fade, Grid2, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineHome } from "react-icons/ai";
import { BsCalendar2Date } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { PiGenderIntersexBold } from "react-icons/pi";
import Swal from "sweetalert2";
import { useLoading } from "../../../../contexts/LoadingContext";
import userApiInstance from "../../../../utils/ApiInstance/userApiInstance";
import './index.css';

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

const userGender = [
    "Male",
    "Female",
    "Other"
];

const userStatus = [
    "Inactive",
    "Active",
];

const userRole = [
    "Backer",
    "Game Owner",
];

const CreateUserModal = ({ openCreateModal, setOpenCreateModal, fetchUserList }) => {
    const { isLoading, setIsLoading } = useLoading();
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            userName: '',
            fullName: '',
            file: null,
            gender: null,
            phoneNumber: null,
            role: 0,
            userStatus: 1,
            dateOfBirth: null,
            address: null,
            password: '',
        }
    });

    const token = Cookies.get("_auth");
    const fileInputRef = useRef(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || "Please enter a valid email address.";
    };

    const validatePhoneNumber = (phone) => {
        if (!phone) {
            return true;
        }
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone) || "Please enter a valid 10-digit phone number.";
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        return passwordRegex.test(password) || "Password must contain at least 7 letter, 1 number, 1 capital letter and 1 special letter.";
    };

    const handleClose = () => {
        setAvatarUrl('');
        reset();
        setOpenCreateModal(false);
    }

    const handleChangeAvatar = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarUrl(URL.createObjectURL(file));
        setValue('file.URL', file);
        setValue('file.name', file.name)
    };

    const onSubmit = async (data) => {
        const isValidPassword = await checkValidConfirmPassword();
        if (!isValidPassword) {
            return;
        }
        else {
            try {
                setIsLoading(true);
                const formData = new FormData();

                formData.append('userName', data.userName);
                formData.append('email', data.email);
                formData.append('fullName', data.fullName);
                if (data.gender) {
                    formData.append('gender', data.Gender);
                }
                formData.append('phoneNumber', data.phoneNumber);
                formData.append('role', data.role);
                formData.append('userStatus', data.userStatus);
                formData.append('dateOfBirth', data.dateOfBirth);
                formData.append('address', data.address);
                formData.append('password', data.password);

                if (data.file) {
                    formData.append('file.URL', data.file.URL);
                    formData.append('file.name', data.file.name);
                }

                console.log("FormData contents:");
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }

                const res = await userApiInstance.post(``, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                console.log(res);
                if (res.status == 200) {
                    Swal.fire({
                        title: `User created!`,
                        text: `Create user successfully.`,
                        icon: "success",
                        timer: 2000,
                        confirmButtonColor: "var(--primary-green)",
                        confirmButtonText: "I understand",
                        customClass: {
                            popup: 'manage-user-detail-popup',
                        },
                    });
                    fetchUserList();
                    handleClose();
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: `${error.response?.data?.message || error.message || "An error occurred"}`,
                    text: `Try again later`,
                    icon: "error",
                    confirmButtonColor: "var(--grey)",
                    confirmButtonText: "I understand",
                    customClass: {
                        popup: 'manage-user-detail-popup',
                    },
                });
            } finally {
                setIsLoading(false);
            }
        }
    }

    const checkValidConfirmPassword = () => {
        return new Promise((resolve) => {
            const inputPassword = watch("password");
            if (confirmPassword !== inputPassword) {
                Swal.fire({
                    title: `Error!`,
                    text: `Confirm Password does not match!`,
                    icon: "error",
                    confirmButtonColor: "var(--primary-green)",
                    confirmButtonText: "I understand",
                    customClass: {
                        popup: 'manage-user-detail-popup',
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve(false);
                    }
                });
            } else {
                resolve(true);
            }
        });
    };


    const twelveYearsAgo = dayjs().subtract(12, "year");

    return (
        <>
            <Modal
                open={openCreateModal}
                onClose={handleClose}
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{ zIndex: '50 !important' }}
            >
                <Fade in={openCreateModal}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={style}>
                            <div className="mb-[1.5rem] mx-[0.5rem]">
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                    Create an account
                                </Typography>
                                <Typography sx={{ mt: '0.5rem', fontSize: '1rem', fontWeight: 400 }}>
                                    Fill in neccessary information to create an account
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
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', mb: '2rem' }}>
                                    <div className="rounded-full bg-[#F5F7F8] w-[14rem] h-[14rem] flex justify-center items-center relative mb-[1.5rem]">
                                        <Avatar
                                            alt="User"
                                            src={avatarUrl}
                                            sx={{ width: "12rem", height: "12rem" }}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 5,
                                                right: 12,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    cursor: "pointer",
                                                    backgroundColor: "white",
                                                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                                                    color: "#2F3645",
                                                    "&:hover": {
                                                        backgroundColor: "var(--black)",
                                                        color: "white",
                                                        transition: "all 0.3s",
                                                    },
                                                }}
                                            >
                                                <CameraAltIcon onClick={handleChangeAvatar} />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: "none" }}
                                                    onChange={onFileChange}
                                                    accept="image/*"
                                                />
                                            </Avatar>
                                        </div>
                                    </div>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', mb: '2rem' }}>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: '400', color: 'var(--grey)' }}>
                                            Username<span className="text-[var(--primary-green)] font-semibold">*</span> :
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            placeholder="Type in username..."
                                            className="manage-user-create-small-textfield"
                                            {...register("userName", { required: "Username is required" })}
                                            error={!!errors.userName}
                                            helperText={errors.userName?.message}
                                            slotProps={{
                                                input: {
                                                    className: "manage-user-create-small-textfield-input",
                                                },
                                            }}
                                            sx={{
                                                width: '12rem',
                                                '& .MuiFormHelperText-root': {
                                                    position: 'absolute',
                                                    bottom: '-20px'
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', mb: '1rem' }}>
                                        <Typography sx={{ fontSize: '1rem', fontWeight: '400', color: 'var(--grey)' }}>
                                            Email Address<span className="text-[var(--primary-green)] font-semibold">*</span> :
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            {...register("email", { required: "Email Address is required", validate: validateEmail })}
                                            placeholder="Type in email address..."
                                            className="manage-user-create-small-textfield"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            slotProps={{
                                                input: {
                                                    className: "manage-user-create-small-textfield-input",
                                                },
                                            }}
                                            sx={{
                                                width: '20rem',
                                                '& .MuiFormHelperText-root': {
                                                    position: 'absolute',
                                                    bottom: '-20px'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                                    Personal information
                                </Typography>
                                <div className="w-full mb-[2rem]">
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <FaRegAddressCard size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Full name<span className="text-[var(--primary-green)] font-semibold">*</span>
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
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Type in full name..."
                                                    className="manage-user-create-small-textfield"
                                                    {...register("fullName", { required: "Full Name is required" })}
                                                    error={!!errors.fullName}
                                                    helperText={errors.fullName?.message}
                                                    slotProps={{
                                                        input: {
                                                            className: "manage-user-create-small-textfield-input",
                                                        },
                                                    }}
                                                    sx={{
                                                        width: '20rem',
                                                        '& .MuiFormHelperText-root': {
                                                            position: 'absolute',
                                                            bottom: '-20px'
                                                        }
                                                    }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
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
                                                <Select
                                                    displayEmpty
                                                    inputProps={{
                                                        px: '2rem'
                                                    }}
                                                    {...register("gender")}
                                                    sx={{
                                                        width: '20rem',
                                                        height: '2.5rem',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        }
                                                    }}
                                                >
                                                    {userGender.map((gender, index) => (
                                                        <MenuItem key={index} value={index}>
                                                            {gender}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
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
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        maxDate={twelveYearsAgo}
                                                        {...register("dateOfBirth")}
                                                        slotProps={{
                                                            textField: {
                                                                sx: {
                                                                    width: "20rem",
                                                                    "& .MuiInputBase-root": {
                                                                        height: "2.5rem",
                                                                    },
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "var(--grey) !important"
                                                                    },
                                                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "var(--grey) !important"
                                                                    },
                                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "var(--grey) !important"
                                                                    }
                                                                },
                                                            },
                                                            day: {
                                                                sx: {
                                                                    "&.MuiPickersDay-today": {
                                                                        backgroundColor: "var(--black) !important",
                                                                        color: "var(--white) !important",
                                                                        border: "none !important",
                                                                        "&:hover": {
                                                                            backgroundColor: "var(--black) !important",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            "& .MuiPickersDay-root.Mui-selected": {
                                                                backgroundColor: "var(--black) !important",
                                                                color: "var(--white)",
                                                                "&:hover": {
                                                                    backgroundColor: "var(--black) !important",
                                                                },
                                                            },
                                                            "& .MuiPickersDay-root": {
                                                                "&:focus": {
                                                                    backgroundColor: "var(--black) !important",
                                                                },
                                                            },
                                                            "& .MuiIconButton-root": {
                                                                color: "inherit !important",
                                                            },
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <MdOutlinePhoneInTalk size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Phone number
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
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Type in phone number..."
                                                    {...register("phoneNumber", { validate: validatePhoneNumber })}
                                                    className="manage-user-create-small-textfield"
                                                    error={!!errors.phoneNumber}
                                                    helperText={errors.phoneNumber?.message}
                                                    slotProps={{
                                                        input: {
                                                            className: "manage-user-create-small-textfield-input",
                                                        },
                                                    }}
                                                    sx={{
                                                        width: '20rem',
                                                        '& .MuiFormHelperText-root': {
                                                            position: 'absolute',
                                                            bottom: '-20px'
                                                        }
                                                    }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
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
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Type in address..."
                                                    {...register("address")}
                                                    className="manage-user-create-small-textfield"
                                                    slotProps={{
                                                        input: {
                                                            className: "manage-user-create-small-textfield-input",
                                                        },
                                                    }}
                                                    sx={{ width: '35rem' }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                </div>
                                <Typography sx={{ fontSize: '1rem', fontWeight: '600', mb: '1rem' }}>
                                    Account information
                                </Typography>
                                <div className="w-full mb-[2rem]">
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <FaRegAddressCard size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Password<span className="text-[var(--primary-green)] font-semibold">*</span>
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
                                                <TextField
                                                    type="password"
                                                    variant="outlined"
                                                    {...register("password", { required: "Password is required", validate: validatePassword })}
                                                    placeholder="Type in password..."
                                                    className="manage-user-create-small-textfield"
                                                    error={!!errors.password}
                                                    helperText={errors.password?.message}
                                                    slotProps={{
                                                        input: {
                                                            className: "manage-user-create-small-textfield-input",
                                                        },
                                                    }}
                                                    sx={{
                                                        width: '20rem',
                                                        '& .MuiFormHelperText-root': {
                                                            position: 'absolute',
                                                            bottom: '-20px'
                                                        }
                                                    }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <FaRegAddressCard size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Confirm password<span className="text-[var(--primary-green)] font-semibold">*</span>
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
                                                <TextField
                                                    type="password"
                                                    variant="outlined"
                                                    placeholder="Confirm your password..."
                                                    className="manage-user-create-small-textfield"
                                                    slotProps={{
                                                        input: {
                                                            className: "manage-user-create-small-textfield-input",
                                                        },
                                                    }}
                                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                                    sx={{ width: '20rem' }}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <PiGenderIntersexBold size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Role<span className="text-[var(--primary-green)] font-semibold">*</span>
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
                                                <Select
                                                    defaultValue={0}
                                                    displayEmpty
                                                    inputProps={{
                                                        px: '2rem'
                                                    }}
                                                    {...register("role", { required: "Role is required" })}
                                                    sx={{
                                                        width: '20rem',
                                                        height: '2.5rem',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        }
                                                    }}
                                                >
                                                    {userRole.map((role, index) => (
                                                        <MenuItem key={index} value={index}>
                                                            {role}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                    <div className="w-full">
                                        <Grid2 container columnSpacing={2} alignItems="center" sx={{ width: '100%', mb: '2rem' }}>
                                            <Grid2 xs={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--grey)', width: '12rem' }}>
                                                    <PiGenderIntersexBold size={16} />
                                                    <Typography sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: '400',
                                                    }}>
                                                        Status<span className="text-[var(--primary-green)] font-semibold">*</span>
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
                                                <Select
                                                    defaultValue={1}
                                                    displayEmpty
                                                    inputProps={{
                                                        px: '2rem'
                                                    }}
                                                    {...register("userStatus", { required: "Status is required" })}
                                                    sx={{
                                                        width: '20rem',
                                                        height: '2.5rem',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--grey) !important'
                                                        }
                                                    }}
                                                >
                                                    {userStatus.map((status, index) => (
                                                        <MenuItem key={index} value={index}>
                                                            {status}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid2>
                                        </Grid2>
                                    </div>
                                </div>
                            </Box>
                            <div className="mx-[0.5rem] pt-[1rem] flex justify-end gap-[1rem] shadow-[0_-4px_4px_-2px_rgba(0,0,0,0.1)]">
                                <Button
                                    variant="contained"
                                    className="manage-user-detail-cancel-button"
                                    onClick={() => handleClose()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    className="manage-user-detail-unblock-button"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Create
                                </Button>
                            </div>
                        </Box>
                    </form>
                </Fade>
            </Modal >
        </>
    )
}

export default CreateUserModal