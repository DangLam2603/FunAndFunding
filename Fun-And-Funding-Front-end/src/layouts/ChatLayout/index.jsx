import { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Container,
  Avatar,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import chatApiInstace from "../../utils/ApiInstance/chatApiInstance";
import userApiInstace from "../../utils/ApiInstance/userApiInstance";
import SearchBarChat from "../../components/Chat/SearchBarChat";
import ContactedUser from "../../components/Chat/ContactedUser";
import empty from "../../assets/images/image_empty.png";

function ChatLayout() {
  //variables
  //token
  const token = Cookies.get("_auth");
  const { receiverId } = useParams();

  //hooks
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contactedUsers, setContactedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(receiverId);
  const [searchMode, setSearchMode] = useState(false);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchReceiver(receiverId);
  }, []);

  useEffect(() => {
    if (!user || searchMode) return;
    fetchContactedUsers();
  }, [user, contactedUsers]);

  //fetch user
  const fetchUserData = () => {
    userApiInstace
      .get("/info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data._data;

        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  //fetch contacted users
  const fetchContactedUsers = () => {
    chatApiInstace
      .get(`/users/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data._data;

          setContactedUsers(data);
        } else {
          Swal.fire({
            title: "Error",
            text: "Fetch chat users failed.",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setTimeout();
          });
        }
      });
  };

  //fetch receiver
  const fetchReceiver = (userId) => {
    userApiInstace
      .get(`/${userId}`)
      .then((response) => {
        const data = response.data._data;

        setReceiver(data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  //handle select user
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    fetchReceiver(userId);
    navigate(`/chat/${userId}`);
  };

  const handleSearchResults = (results) => {
    if (results.length > 0) {
      setSearchMode(true); // Enter search mode when search results are shown
      setContactedUsers(results);
    } else {
      setSearchMode(false); // Exit search mode when clearing search
      fetchContactedUsers(); // Optionally re-fetch the contacted users when search is cleared
    }
  };

  return (
    <Container
      sx={{
        width: "100% !important",
        maxWidth: "100% !important",
        height: "calc(100vh - 5rem - 2rem)",
        mt: "1rem",
      }}
    >
      <Grid2
        container
        columnSpacing={"1rem"}
        sx={{ height: "100% !important" }}
      >
        <Grid2
          size={4}
          sx={{
            backgroundColor: "#F5F7F9",
            height: "100% !important",
            overflowY: "auto",
            px: "1.5rem",
            py: "1.5rem",
            borderRadius: "0.625rem",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
          }}
        >
          <div className="flex flex-col gap-y-4">
            <div className="w-full">
              <SearchBarChat
                onSearchResults={handleSearchResults}
                userId={user?.id}
              />
            </div>
            <div className="gap-y-2">
              {contactedUsers.length > 0 ? (
                contactedUsers.map((u, index) => (
                  <div key={index}>
                    <ContactedUser
                      user={u}
                      isSelected={u.userId === selectedUserId}
                      onSelect={() => handleUserSelect(u.userId)}
                    />
                  </div>
                ))
              ) : (
                <p>Let's get in contact with someone...</p>
              )}
            </div>
          </div>
        </Grid2>
        <Grid2
          size={8}
          sx={{
            backgroundColor: "#F5F7F9",
            height: "100% !important",
            overflowY: "auto",
            borderRadius: "0.625rem",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
            position: "relative",
          }}
          className="scrollbar-hidden"
        >
          {receiverId ? (
            <>
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "#F5F7F9",
                  px: "1.5rem",
                  py: "1rem",
                  borderTopLeftRadius: "0.625rem",
                  borderTopRightRadius: "0.625rem",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  zIndex: 1000,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "1rem",
                    "&:hover": {
                      cursor: "pointer",
                    },
                    width: "fit-content",
                    borderRadius: "0.625rem",
                  }}
                >
                  <Avatar alt={receiver?.fullName} src={receiver?.avatar} />
                  <Typography sx={{ fontSize: "1rem", fontWeight: "600" }}>
                    {receiver?.fullName}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ px: "1.5rem" }}>
                <Outlet />
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={empty} className="h-[10rem] mb-[2rem]"></img>
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: "500",
                    color: "#2F3645",
                    mt: "2rem",
                  }}
                >
                  No chats selected.
                </Typography>
              </Box>
            </>
          )}
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default ChatLayout;
