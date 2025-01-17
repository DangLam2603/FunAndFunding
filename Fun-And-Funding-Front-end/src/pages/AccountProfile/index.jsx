import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import userApiInstace from "../../utils/ApiInstance/userApiInstance";
// import { Modal as BaseModal, Modal } from "@mui/base/Modal";
import {
  ArrowForward,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  FaBirthdayCake,
  FaTransgenderAlt,
  FaUser
} from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { ImBin2 } from "react-icons/im";
import { MdEmail, MdSwitchAccount } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import QuillEditor from "../../components/AccountProfile/QuillEditor";

//date variables
const today = dayjs();
const minDate = today.subtract(100, "year");

// Gender options
const gender = ["Male", "Female", "Other"];
const genderMapping = {
  0: "Male",
  1: "Female",
  2: "Other",
};

//custom
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    fontSize: "0.875rem",
    color: "#1BAA64 !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#1BAA64",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1BAA64 !important",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: "1rem",
  },
}));

const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& button": {
    outline: "none",
  },
  "& label": {
    fontSize: "0.875rem",
    color: "#1BAA64 !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#1BAA64 !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1BAA64 !important",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: "1rem",
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& label": {
    fontSize: "0.875rem",
    color: "#1BAA64 !important",
    borderColor: "#1BAA64 !important",
  },
  "& .MuiInputLabel-root": {
    color: "#1BAA64 !important",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px !important",
    "&:hover fieldset": {
      borderColor: "#1BAA64 !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1BAA64 !important",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: "1rem",
    borderRadius: "10px !important",
    color: "#2F3645 !important",
    borderColor: "#1BAA64 !important",
  },
  "& .MuiSelect-select": {
    color: "#2F3645 !important", // Select text color
  },
  "& .MuiSelect-select.Mui-focused": {
    borderColor: "#1BAA64 !important", // Focused state border color
  },
  "& .MuiSelected": {
    fontSize: "1rem !important",
    borderColor: "#1BAA64 !important",
  },
  textAlign: "left",
  borderRadius: "10px !important",
}));

function AccountProfile() {
  //hooks
  // const { setIsLoading } = useOutletContext();
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);

  //user profile
  const [selectedGender, setSelectedGender] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [userName, setUserName] = useState("");
  const [userBirthDate, setUserBirthDate] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userBio, setUserBio] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowChangedPassword, setIsShowChangedPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  //password
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //avatar
  const [avatar, setAvatar] = useState(null);
  const [avatarName, setAvatarName] = useState(null);

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //token
  const token = Cookies.get("_auth");

  //functions

  //edit profile
  const handleEditProfile = () => {
    setIsEditProfile(!isEditProfile);
  };

  //update profile
  const handleUpdateProfile = () => {
    // setIsLoading(true);

    const userUpdateRequest = {
      fullName: accountName,
      userName: userName,
      userPhone: userPhone,
      dayOfBirth:
        userBirthDate == null
          ? null
          : `${userBirthDate.get("year")} - ${userBirthDate.get("month") + 1 < 10
            ? `0${userBirthDate.get("month") + 1}`
            : userBirthDate.get("month") + 1
          } - ${userBirthDate.get("date")}`,
      address: userAddress,
      gender: Object.keys(genderMapping).find(
        (key) => genderMapping[key] === selectedGender
      ),
      bio: userBio,
      userStatus: user.userStatus,
    };

    //fetch update profile api
    userApiInstace
      .patch("/info", userUpdateRequest, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: "Success",
            text: "Update profile successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setTimeout();
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Update profile failed.",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            fetchUserData();
            setTimeout();
          });
        }
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          title: "Error",
          text: "Update failed!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          fetchUserData();
          setTimeout();
        });
      })
      .finally(() => {
        setIsEditProfile(false);
        // setIsLoading(false);
      });
  };

  //edit pass
  const handleEditPassword = () => {
    setIsEditPassword(!isEditPassword);
  };

  //validate pass
  const handleValidatePassword = async () => {
    try {
      const response = await userApiInstace.get(
        `/password?password=${password}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        handleClose();
        setIsEditPassword(true);
      }
    } catch (error) {
      if (error.response) {
        // Logs the error response object to inspect it.
        console.log(error.response);

        if (error.response.status === 400) {
          handleClose();

          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Something went wrong. Please try again.",
            icon: "error",
            showConfirmButton: true,
          });
        }
      } else {
        console.error("Validate password failed: ", error);
      }
    }
  };

  //update pass
  const handleUpdatePassword = async () => {
    try {
      //request
      const request = {
        oldPassword: password,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      //response
      const response = await userApiInstace.patch("/password", request, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Update password successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setIsEditPassword(false);
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");

          navigate("/home");
        });
      }
    } catch (error) {
      if (error.response) {
        // Logs the error response object to inspect it.
        console.log(error.response);

        if (error.response.status === 400) {
          handleClose();

          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Something went wrong. Please try again.",
            icon: "error",
            showConfirmButton: true,
          });
        }
      } else {
        console.error("Update password failed: ", error);
      }
    }
  };

  //show pass
  const handleClickShowPassword = () => setIsShowPassword((prev) => !prev);
  const handleClickShowChangedPassword = () =>
    setIsShowChangedPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setIsShowConfirmPassword((prev) => !prev);

  //fetch api
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    userApiInstace
      .get("/info", {
        // headers: { Authorization: `Bearer ${token}` },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userData = response.data._data;

        setUser(userData);
        setUserEmail(userData.email || "");
        setAccountName(userData.fullName || "");
        setUserName(userData.userName || "");
        setUserAddress(userData.address || "");
        setSelectedGender(
          userData.gender == null ? "" : genderMapping[userData.gender]
        );
        setUserBirthDate(
          userData.dayOfBirth ? dayjs(userData.dayOfBirth) : null
        );
        setUserBio(userData.bio || "");
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  return (
    <div className="pl-[4rem] pr-[5.5rem] mt-[2rem] mb-[4rem]">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="w-full">
          <div className="flex justify-between gap-[1rem] items-center mb-[4rem]">
            <div className="flex justify-start gap-[1rem] items-start flex-col">
              <h1 className="!text-[1.5rem] text-left font-bold text-[#2F3645]">
                Personal Information
              </h1>
              <Typography
                sx={{
                  color: '#2F3645',
                  fontSize: '1rem',
                  fontWeight: '400',
                  userSelect: 'none',
                  width: '85%',
                }}
              >
                Manage and update your personal details, including your name, email, phone number, and other essential information to keep your account up to date.
              </Typography>
            </div>
            {!isEditProfile ? (
              <div className="flex justify-end gap-4 profileButton !w-[20rem]">
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#1BAA64",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    ".MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex justify-center gap-4 profileButton">
                <Button
                  variant="contained"
                  startIcon={<ImBin2 />}
                  onClick={handleEditProfile}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#D9534F",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    ".MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleUpdateProfile}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#1BAA64",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <Grid2 container columnSpacing={4} rowSpacing={8}>
            <Grid2 size={6}>
              <CustomTextField
                label="Email"
                variant="outlined"
                value={userEmail}
                fullWidth
                disabled={true}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <MdEmail style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <CustomTextField
                label="Username"
                variant="outlined"
                value={userName}
                fullWidth
                disabled={!isEditProfile}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <MdSwitchAccount style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <CustomTextField
                label="Full Name"
                variant="outlined"
                value={accountName}
                fullWidth
                disabled={!isEditProfile}
                onChange={(e) => {
                  setAccountName(e.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <FaUser style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomDatePicker
                  disabled={!isEditProfile}
                  label="Date of Birth"
                  value={userBirthDate}
                  onChange={(newValue) => setUserBirthDate(newValue)}
                  minDate={minDate}
                  maxDate={today}
                  slotProps={{
                    textField: {
                      InputProps: {
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ ml: "0.4rem" }}
                          >
                            <FaBirthdayCake style={{ color: "#2F3645" }} />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid2>
            <Grid2 size={6}>
              <FormControl fullWidth sx={{ height: "100%" }}>
                <InputLabel
                  sx={{
                    fontSize: "0.875rem !important",
                    color: "#1BAA64",
                  }}
                >
                  Gender
                </InputLabel>
                <CustomSelect
                  disabled={!isEditProfile}
                  labelId="gender-select-label"
                  id="gender-select"
                  value={selectedGender || ""}
                  placeholder={"Gender"}
                  label="Gender"
                  onChange={(e) => {
                    setSelectedGender(e.target.value);
                  }}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                      <FaTransgenderAlt style={{ color: "#2F3645" }} />
                    </InputAdornment>
                  }
                  sx={{
                    height: "100%",
                  }}
                >
                  {gender.map((g, index) => (
                    <MenuItem key={index} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid2>
            <Grid2 size={6}>
              <CustomTextField
                label="Address"
                variant="outlined"
                value={userAddress}
                fullWidth
                disabled={!isEditProfile}
                onChange={(e) => {
                  setUserAddress(e.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <GoHomeFill style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={12} marginBottom={6}>
              <div className="flex gap-[1rem] items-center mb-[1.5rem]">
                <h1 className="!text-[1rem] text-left font-bold text-[#2F3645]">
                  Biography
                </h1>
              </div>
              <QuillEditor
                className="w-full !important"
                value={userBio}
                data={userBio}
                setData={setUserBio}
                isEnabled={isEditProfile}
                onChange={(e) => {
                  setUserBio(e.target.value);
                }}
              />
            </Grid2>
          </Grid2>
        </div>
      </div>
      <Box>
        <div className='my-[4rem]'>
          <Divider sx={{ border: '1px solid #EAEAEA', borderRadius: '0.625rem' }} />
        </div>
      </Box>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="w-full mb-[3.2rem]">
          <div className="flex justify-between gap-[1rem] items-center mb-[4rem]">
            <div className="flex justify-between gap-[1rem] items-start flex-col">
              <h1 className="text-[1rem] text-left font-bold text-[#2F3645]">
                Change Password
              </h1>
              <Typography
                sx={{
                  color: '#2F3645',
                  fontSize: '1rem',
                  fontWeight: '400',
                  userSelect: 'none',
                  width: '85%',
                }}
              >
                Secure your account by managing your password. Update your current password or reset it to enhance account protection.
              </Typography>
            </div>
            {!isEditPassword ? (
              <div className="flex justify-end gap-4 profileButton !w-[20rem]">
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleOpen}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#1BAA64",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    ".MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex justify-center gap-4 profileButton">
                <Button
                  variant="contained"
                  startIcon={<ImBin2 />}
                  onClick={handleEditPassword}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#D9534F",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    ".MuiButton-startIcon": {
                      marginRight: "12px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleUpdatePassword}
                  sx={{
                    color: "#2F3645",
                    backgroundColor: "#F5F7F8",
                    textTransform: "none !important",
                    "&:hover": {
                      backgroundColor: "#1BAA64",
                      color: "#F5F7F8",
                    },
                    "&:active": {
                      outline: "none !important",
                    },
                    "&:focus": {
                      outline: "none !important",
                    },
                    fontWeight: "bold",
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <Grid2 container columnSpacing={4} rowSpacing={0}>
            <Grid2 size={6}>
              <CustomTextField
                label="New Password"
                variant="outlined"
                type={isShowChangedPassword ? "text" : "password"}
                fullWidth
                disabled={!isEditPassword}
                required={true}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <PiPasswordFill style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: "0.4rem" }}>
                        <IconButton
                          sx={{ outline: "none !important" }}
                          aria-label="toggle password visibility"
                          onClick={handleClickShowChangedPassword}
                          edge="end"
                          disabled={!isEditPassword}
                        >
                          {isShowChangedPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <CustomTextField
                label="Confirm Password"
                variant="outlined"
                type={isShowConfirmPassword ? "text" : "password"}
                fullWidth
                disabled={!isEditPassword}
                required={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: "0.4rem" }}>
                        <PiPasswordFill style={{ color: "#2F3645" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: "0.4rem" }}>
                        <IconButton
                          sx={{ outline: "none !important" }}
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          disabled={!isEditPassword}
                        >
                          {isShowConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex", // Enable Flexbox on the Modal itself
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Ensure items stack vertically
            justifyContent: "center", // Center content within the box
            alignItems: "center", // Center content within the box
            height: "28vh",
            px: "4rem",
            backgroundColor: "#F5F7F8",
            margin: "auto",
            width: "40%",
            borderRadius: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "1.5rem",
              color: "#2F3645",
              textAlign: "center",
              marginBottom: "2rem",
              width: '100%'
            }}
          >
            Enter your password to continue
          </Typography>

          <Grid2
            container
            columnSpacing={4}
            rowSpacing={0}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid2 size={8.5}>
              <CustomTextField
                label="Password"
                variant="outlined"
                type={isShowPassword ? "text" : "password"}
                sx={{ width: "100%" }}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: "0.4rem" }}>
                        <IconButton
                          sx={{ outline: "none !important" }}
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {isShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
            <Grid2 size={3.5}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleValidatePassword}
                sx={{
                  color: "var(--white)",
                  backgroundColor: "var(--primary-green)",
                  px: '1rem',
                  textTransform: "none !important",
                  "&:active": {
                    outline: "none !important",
                  },
                  "&:focus": {
                    outline: "none !important",
                  },
                  fontWeight: "bold",
                  height: "51px",
                  borderRadius: '0.625rem'
                }}
              >
                Continue
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Modal>
    </div>
  );
}

export default AccountProfile;
