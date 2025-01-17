/* eslint-disable no-unused-vars */
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import Aos from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { FaClipboardList } from "react-icons/fa";
import { FaFolderOpen, FaUserTie } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import homeLogo from "../../assets/images/logo-alt.png";
import defaultLogo from "../../assets/images/logo-text.png";
import { useCart } from "../../contexts/CartContext";
import userApiInstace from "../../utils/ApiInstance/userApiInstance";
import { useNotificationApi } from "../../utils/Hooks/Notification";
import useSignalR from "../../utils/Hooks/SignalR";
import CartDrawer from "../CartDrawer";
import NotificationMenu from "../Notification/NotificationMenu";
import AuthDialog from "../Popup";

const FunFundingAppBar = () => {
  const { cartItems, cartCount, setCartItems, setCartCount } = useCart();
  const [role, setRole] = useState("GameOwner");

  const pages = [
    { label: "Home", route: "/home", index: 0 },
    { label: "Crowdfunding", route: "/funding", index: 1 },
    // { label: "About Us", route: "/about-us", index: 2 },
    { label: "Marketplace", route: "/marketplace", index: 2 },
  ];

  const profileMenu = [
    {
      label: "Profile",
      route: "/account/profile",
      icon: <FaUserTie style={{ fontSize: "1.25rem" }} />,
    },
    {
      label: "Wallet",
      route: "/account/wallet",
      icon: <AccountBalanceWalletIcon />,
    },
  ];

  const filteredProfileMenu = profileMenu.filter(
    (item) => !(role === "GameOwner" && (item.label === "Wallet"))
  );

  const projectMenu = [
    {
      label: "Projects",
      route: "/account/projects",
      icon: <FaFolderOpen style={{ fontSize: "1.25rem" }} />,
    },
    {
      label: "Orders",
      route: "/account/orders",
      icon: <FaClipboardList style={{ fontSize: "1.25rem" }} />,
    },
  ];

  const filteredProjectMenu = projectMenu.filter(
    (item) => !(role === "GameOwner" && (item.label === "Orders"))
  );

  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("_auth");
  const [isLogined, setIsLogined] = useState(
    Cookies.get("_auth") !== undefined
  );

  const [name, setName] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const openAuthDialog = () => setIsAuthDialogOpen(true);
  const closeAuthDialog = () => setIsAuthDialogOpen(false);

  useEffect(() => {
    Aos.init({ duration: 2000 });
    if (token) {
      fetchUser();
    }
  }, [isLogined, token]);

  useEffect(() => {
    const activePage = pages.find((page) => page.route === location.pathname);
    if (activePage) {
      setTabValue(activePage.index);
    } else {
      setTabValue(false);
    }
  }, [location.pathname]);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const res = await userApiInstace.get("/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data._statusCode == 200) {
        const user = res.data._data;
        setUser(user);
        setName(user.userName);
        const roleRes = await userApiInstace.get(`/user-role/${user.id}`);
        if (roleRes.data._statusCode == 200) {
          if (roleRes.data._data == "Administrator") {
            setIsLogined(false);
            setRole(roleRes.data._data);
          } else {
            setIsLogined(true);
            setRole(roleRes.data._data);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUserLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(pages[newValue].route);
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      if (!isHovering) {
        setAnchorEl(null);
      }
    }, 100);
    setIsHovering(false);
    return () => clearTimeout(timeoutId);
  };

  const handleMenuClick = (route) => {
    setAnchorEl(null);
    if (route === "logout") {
      Swal.fire({
        title: "Warning",
        text: "Do you want to log out?",
        icon: "warning",
        iconColor: "#FBB03B",
        showCancelButton: true,
        confirmButtonColor: "#1BAA64",
        cancelButtonColor: "D8D8D8",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          signOut();
          window.location.href = "/home";
        }
      });
    } else {
      navigate(route);
    }
  };

  const signOut = useSignOut();

  const handleCartOpen = () => {
    setCartOpen(!cartOpen);
  };

  const isPage =
    location.pathname === "/home" ||
    location.pathname === "/choose-project-plan";
  const appBarStyles = {
    background: isPage ? "transparent" : "var(--white)",
    boxShadow: "none",
    height: "4rem",
    justifyContent: "center",
    display: "flex",
    px: "4rem",
    zIndex: "100",
  };

  const tabStyles = {
    fontWeight: "900 !important",
    fontSize: ".9rem",
    textTransform: "none",
    color: isPage ? "#F5F7F8" : "#2F3645",
    "&.Mui-selected": {
      color: "#1BAA64 !important",
    },
    mr: 2,
    "&:hover": {
      color: "#1BAA64",
      transition: "all 0.3s ease-in-out",
    },
    transition: "color 0.3s ease-in-out",
  };

  // for noti

  const decoded = token ? jwtDecode(token) : null;
  const userId = token
    ? decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ]
    : null;
  const [openNoti, setOpenNoti] = useState(false);

  const { notiData, error, fetchNotifications } = useNotificationApi(
    `/${userId}`
  );

  const message = useSignalR();
  const previousMessageRef = useRef(null);

  useEffect(() => {
    if (message !== previousMessageRef.current) {
      previousMessageRef.current = message;
      if (message) {
        fetchNotifications();
        setOpenNoti(true);
      }
    }
  }, [message, fetchNotifications]);

  const notiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <AppBar position="relative" sx={appBarStyles}>
        <Container maxWidth="false">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 4,
                display: { xs: "none", lg: "flex" },
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/home")}
            >
              <img
                src={isPage ? homeLogo : defaultLogo}
                style={{ height: "2.5rem" }}
                alt="Logo"
              />
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "5rem",
              }}
            >
              <Tabs
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#1BAA64",
                    height: "2.2px",
                  },
                }}
                value={tabValue}
                onChange={handleTabChange}
                sx={{ flexGrow: 1, display: "flex" }}
                error="false"
              >
                {pages.map((page, index) => (
                  <Tab
                    key={page.label}
                    label={page.label}
                    sx={{
                      ...tabStyles,
                      color: isPage
                        ? tabValue === index
                          ? "#1BAA64"
                          : "#F5F7F8"
                        : tabValue === index
                          ? "#1BAA64"
                          : "#2F3645",
                      fontWeight: "700 !important",
                    }}
                    error="false"
                  />
                ))}
              </Tabs>
            </Box>
            {isLogined ? (
              <Box
                sx={{ maxWidth: "100%", display: "flex", alignItems: "center" }}
              >
                <Badge
                  badgeContent={cartCount == 0 ? null : cartCount}
                  max={9}
                  showZero
                  sx={{
                    marginRight: "2rem",
                    "& .MuiBadge-badge": {
                      backgroundColor: "#1BAA64 !important",
                    },
                    display: role === "GameOwner" ? 'none' : "block"
                  }}
                >
                  <ShoppingCartIcon
                    fontSize="large"
                    sx={{
                      color: isPage ? "#F5F7F8" : "#2F3645",
                      transition: "color 0.3s",
                      "&:hover": { color: "#c5c9cb" },
                      cursor: "pointer",
                      fontSize: "1.8rem",
                    }}
                    onClick={handleCartOpen}
                  />
                </Badge>
                <div className="relative" ref={notiRef}>
                  <Badge
                    badgeContent={notiData?.length}
                    max={99}
                    showZero
                    sx={{
                      marginRight: "2rem",
                      "& .MuiBadge-badge": {
                        backgroundColor: "#1BAA64 !important",
                      },
                    }}
                    // onMouseEnter={() => setOpenNoti(true)}
                    // onMouseLeave={() => setOpenNoti(false)}
                    onClick={() => setOpenNoti(!openNoti)}
                  >
                    <NotificationsIcon
                      fontSize="large"
                      sx={{
                        cursor: "pointer",
                        transition: "color 0.3s",
                        "&:hover": { color: "#c5c9cb" },
                        color: isPage ? "#F5F7F8" : "#2F3645",
                        fontSize: "1.8rem",
                      }}
                    />
                  </Badge>
                  <div className={`${openNoti ? '' : 'hidden'} absolute !z-[100001] right-0 top-11`}>
                    <NotificationMenu notiData={notiData} />
                  </div>
                </div>

                <div className="relative">
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconButton href="account/profile" component="a">
                      <Avatar
                        alt="User"
                        src={user?.avatar}
                        sx={{ height: "2rem", width: "2rem" }}
                      />
                    </IconButton>
                  </div>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    onMouseEnter={() => {
                      setIsHovering(true), setOpenNoti(false);
                    }}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                      "& .MuiPaper-root": {
                        width: "20rem",
                        borderRadius: "10px",
                        padding: "1rem",
                        boxShadow:
                          "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)",
                        background: "var(--white)",
                        color: "var(--black)",
                      },
                      color: "var(--black)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        pointerEvents: "none",
                        backgroundColor: "var(--white)",
                        "&:hover": {
                          backgroundColor: "var(--white)",
                        },
                      }}
                    >
                      <Avatar
                        alt="User"
                        src={user?.avatar}
                        sx={{ mb: "1rem", width: "6rem", height: "6rem" }}
                      />
                      {userLoading ? (
                        <CircularProgress
                          sx={{ color: "var(--grey)", fontSize: "1rem" }}
                        ></CircularProgress>
                      ) : (
                        <>
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              width: "fit-content",
                              padding: "4px 8px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                              bgcolor: "var(--primary-green)",
                              color: "var(--white)",
                              borderRadius: "0.5rem",
                              mb: "0.5rem",
                            }}
                          >
                            {role.replace(/([a-z])([A-Z])/g, "$1 $2")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              width: "10rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                              mb: "0.25rem",
                            }}
                          >
                            {name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: "400",
                              width: "15rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                            }}
                          >
                            {user?.email}
                          </Typography>
                        </>
                      )}
                    </Box>

                    <Divider sx={{ my: "1rem !important" }} />

                    {filteredProfileMenu.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => handleMenuClick(item.route)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "0.625rem",
                          "&:hover": {
                            backgroundColor: "var(--primary-green)",
                            color: "var(--white)",
                            "& .MuiListItemIcon-root": {
                              color: "var(--white)",
                            },
                          },
                          color: "var(--black)",
                          py: "0.5rem",
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: "var(--black)", mr: "1rem" }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            sx: { fontWeight: "500 !important" },
                          }}
                        >
                          {item.label}
                        </ListItemText>
                      </MenuItem>
                    ))}

                    <Divider sx={{ my: "1rem !important" }} />

                    {filteredProjectMenu.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => handleMenuClick(item.route)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": {
                            backgroundColor: "var(--primary-green)",
                            color: "var(--white)",
                            "& .MuiListItemIcon-root": {
                              color: "var(--white)",
                            },
                          },
                          color: "var(--black)",
                          borderRadius: "0.625rem",
                          py: "0.5rem",
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: "var(--black)", mr: "1rem" }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{
                            sx: { fontWeight: "500 !important" },
                          }}
                        >
                          {item.label}
                        </ListItemText>
                      </MenuItem>
                    ))}

                    <Divider sx={{ my: "1rem !important" }} />

                    <MenuItem
                      onClick={() => handleMenuClick("logout")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "var(--red)",
                          color: "var(--white)",
                          "& .MuiListItemIcon-root": {
                            color: "var(--white)",
                          },
                        },
                        color: "var(--black)",
                        borderRadius: "0.625rem",
                        py: "0.5rem",
                      }}
                    >
                      <ListItemIcon sx={{ color: "var(--black)", mr: "1rem" }}>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          sx: { fontWeight: "500 !important" },
                        }}
                      >
                        Log Out
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </Box>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1BAA64",
                  fontWeight: "600",
                  textTransform: "none",
                  px: "3rem",
                  height: "2.5rem",
                  fontSize: "1rem",
                  visibility: role == "Administrator" ? 'hidden' : 'visible'
                }}
                onClick={openAuthDialog}
              >
                Sign In
              </Button>
            )}
            <AuthDialog isOpen={isAuthDialogOpen} onClose={closeAuthDialog} />
          </Toolbar>
        </Container>
      </AppBar>
      <CartDrawer cartOpen={cartOpen} setCartOpen={handleCartOpen} />
    </div>
  );
};

export default FunFundingAppBar;
