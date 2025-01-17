import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Container,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaFolderOpen, FaUserTie } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoMdWallet } from "react-icons/io";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import userApiInstace from "../../../utils/ApiInstance/userApiInstance";
import "./index.css";

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
      zIndex: '10000 !important'
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

function UserProfileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState("");
  const [avatarName, setAvatarName] = useState(null);
  const fileInputRef = useRef(null);

  //cookie
  const token = Cookies.get("_auth");
  // const [walletPath, setWalletPath] = useState("");

  // useEffect(() => {
  //   if (token) {
  //     const decoded = jwtDecode(token);
  //     const userRole =
  //       decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  //     if (userRole == "GameOwner") setWalletPath("/account/wallet-game-owner");
  //     else setWalletPath("/account/wallet");
  //   }
  // }, [token, walletPath]);

  const titleList = [
    { text: "Profile", path: "/account/profile" },
    { text: "Projects", path: "/account/projects" },
    { text: "Social", path: "/account/social" },
    { text: "Orders", path: "/account/orders" },
    { text: "Wallet", path: "/account/wallet" },
  ];

  const filteredTitleList = titleList.filter(
    (item) => !(role === "GameOwner" && (item.text === "Orders" || item.text === "Wallet"))
  );

  const iconMapping = {
    0: <FaUserTie style={{ fontSize: "1.6rem" }} />,
    1: <FaFolderOpen style={{ fontSize: "1.6rem" }} />,
    2: <HiMiniUserGroup style={{ fontSize: "1.6rem" }} />,
    3: <FaClipboardList style={{ fontSize: "1.6rem" }} />,
    4: <IoMdWallet style={{ fontSize: "1.6rem" }} />,
  };

  const onClickMapping = {
    0: () => navigate("/account/profile"),
    1: () => navigate("/account/projects"),
    2: () => navigate("/account/social"),
    3: () => navigate("/account/orders"),
    4: () => navigate("/account/wallet"),
  };

  //fetch api
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    userApiInstace
      .get("/info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userData = response.data._data;

        setUser(userData);
        setAvatar(userData.avatar);
        console.log(userData);
        userApiInstace.get(`/user-role/${userData.id}`).then((roleRes) => {
          if (roleRes.data._statusCode == 200) {
            setRole(roleRes.data._data);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  //functions
  const handleChangeAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input dialog
    }
  };

  const handleUpdateAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("URL", file); // "URL" field for the file
    formData.append("Name", "avatar_" + user.userName); // Add the file name

    try {
      const response = await userApiInstace.patch("/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAvatar(response.data._data.avatar); // Update the avatar on success

        Swal.fire({
          title: "Success",
          text: "Update avatar successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          fetchUserData();
        });
      } else {
        throw new Error("Fetch API failed");
      }
    } catch (error) {
      console.error("Upload avatar failed:", error);
    }
  };

  const getActiveSection = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const activeTitle = titleList.find((item) =>
      currentPath.startsWith(item.path)
    );

    return activeTitle ? activeTitle.text : "Unknown Section";
  };

  return (
    <>
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
              color: "#F5F7F8",
              display: "flex",
              flexDirection: "column",
              pt: "2.4rem",
              justifyContent: "space-between",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div className="sticky top-[2.4rem] z-10">
              <div className="flex w-full flex-row justify-center items-center px-[2rem] mb-[1.5rem]">
                <div className="rounded-full bg-[var(--white)] w-[10rem] h-[10rem] flex justify-center items-center relative">
                  {true ? (
                    <Avatar
                      alt="User"
                      src={user?.avatar || ""}
                      sx={{ width: "8.8rem", height: "8.8rem" }}
                    />
                  ) : (
                    <Avatar
                      alt="User"
                      src={""}
                      sx={{ width: "8.8rem", height: "8.8rem" }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 8,
                    }}
                  >
                    <Avatar
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "white",
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                        color: "#2F3645",
                        "&:hover": {
                          backgroundColor: "#1BAA64",
                          color: "white",
                          transition: "all 0.3s",
                        },
                        width: "2rem",
                        height: "2rem",
                      }}
                    >
                      <EditIcon
                        sx={{ width: "1.2rem", height: "1.2rem" }}
                        onClick={handleChangeAvatar}
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleUpdateAvatar}
                      />
                    </Avatar>
                  </div>
                </div>
              </div>
              {user ? (
                <div className="flex flex-col justify-center items-center overflow-hidden px-[2rem] mb-[1rem]">
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      width: "fit-content",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                      bgcolor: "var(--primary-green)",
                      color: "var(--white)",
                      borderRadius: "0.25rem",
                      mb: "0.25rem",
                    }}
                  >
                    {role.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  </Typography>
                  <div className="w-[14rem] overflow-hidden">
                    <h1 className="!text-[1.5rem] text-[var(--white)] font-bold leading-relaxed overflow-hidden text-ellipsis mb-[0.25rem] text-center">
                      {user?.userName}
                    </h1>
                    <h1 className="!text-[1rem] text-[var(--white)] font-medium leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap text-center">
                      {user?.email}
                    </h1>
                  </div>
                </div>
              ) : null}
              <Box
                sx={{
                  width: "100%",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <List sx={{ mx: "2rem", flexGrow: 1, mt: "0.8rem" }}>
                  {filteredTitleList.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <ListItem
                        key={item.text}
                        onClick={onClickMapping[index]}
                        sx={{ p: 0, mb: "0.8rem", borderRadius: "0.4rem" }}
                      >
                        <ListItemButton
                          component={NavLink}
                          sx={{
                            borderRadius: "0.4rem",
                            backgroundColor: isActive ? "#1BAA64" : "transparent",
                            color: "var(--white)",
                            "&:hover": {
                              boxShadow: "inset 0 0 0 1px #1BAA64",
                              backgroundColor: "var(--primary-green)",
                              borderColor: "var(--primary-green) !important",
                              color: "var(--white) !important",
                              "& .MuiListItemIcon-root": {
                                color: "var(--white)",
                              },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: "var(--white)",
                              "&:hover": {
                                color: "#F5F7F8",
                              },
                            }}
                          >
                            {iconMapping[index]}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: "1rem",
                              fontWeight: "600",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </div>
          </Grid2>
          <Grid2 size={9.5} style={{ position: "relative" }}>
            <div>
              <div className="fixed-update-header">
                <div>
                  <Typography
                    sx={{
                      color: "#2F3645",
                      fontSize: "1rem",
                      fontWeight: "700",
                      userSelect: "none",
                      width: "100%",
                    }}
                  >
                    Account / {getActiveSection()}
                  </Typography>
                </div>
              </div>
              <Outlet context={{ notify }} />
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
    </>
  );
}

export default UserProfileLayout;
