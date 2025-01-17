import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChat } from "../../contexts/ChatContext";
import chatApiInstace from "../../utils/ApiInstance/chatApiInstance";
import Cookies from "js-cookie";
import userApiInstace from "../../utils/ApiInstance/userApiInstance";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import { MdSend } from "react-icons/md";

function Chat() {
  const token = Cookies.get("_auth");
  const [senderId, setSenderId] = useState(null);
  const { receiverId } = useParams();
  const [socket, setSocket] = useState(null);
  const { messages, addMessage, setMessages } = useChat();
  const [message, setMessage] = useState({
    SenderId: senderId,
    ReceiverId: receiverId,
    Message: "",
  });
  const [receivedMessage, setReceivedMessage] = useState(null);

  // Ref to the chat container to auto-scroll
  const chatContainerRef = useRef(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      return "Invalid date";
    }
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (senderId !== null) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        SenderId: senderId,
      }));
    }
  }, [senderId]);

  useEffect(() => {
    if (receiverId) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        ReceiverId: receiverId,
      }));
    }
  }, [receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  //fetch sender
  const fetchUserData = () => {
    userApiInstace
      .get("/info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data._data;

        setSenderId(data.id);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  //fetch chat conversation
  useEffect(() => {
    if (senderId && receiverId) {
      const fetchChatConversation = async () => {
        try {
          const response = await chatApiInstace.get(
            `/conversation/${senderId}/${receiverId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Initialize the messages in the global state (ChatContext)
          setMessages(response.data._data);
        } catch (error) {
          console.error("Error fetching chat conversation:", error);
        }
      };

      fetchChatConversation();
    }
  }, [senderId, receiverId, setMessages]);

  useEffect(() => {
    if (senderId && receiverId) {
      const webSocket = new WebSocket(
        `wss://localhost:7044/ws?SenderId=${senderId}&ReceiverId=${receiverId}`
      );

      webSocket.onopen = () => {
        console.log("WebSocket connection established");
      };

      webSocket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          setReceivedMessage(response);
          console.log("Received message:", response);

          // Add the received message to the global chat state (ChatContext)
          addMessage({
            senderId: response.SenderId,
            receiverId: response.ReceiverId,
            message: response.Message,
            createdDate: Date.now(),
          });
        } catch (e) {
          console.warn("Received non-JSON message:", event.data);
        }
      };

      webSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setSocket(webSocket);

      return () => {
        webSocket.close();
      };
    }
  }, [senderId, receiverId, addMessage]);

  const sendMessage = () => {
    if (socket && message.Message !== "") {
      // Stringify the message object before sending
      socket.send(JSON.stringify(message));

      // Reset the message text but keep SenderId and ReceiverId
      setMessage({ ...message, Message: "" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          paddingTop: "1rem",
          margin: "0 !important",
        }}
        className="scrollbar-hidden"
        ref={chatContainerRef}
      >
        {messages.length > 0 ? (
          messages.slice().map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.senderId === senderId ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Tooltip
                title={formatDate(new Date(msg.createdDate))}
                arrow
                placement="left"
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    backgroundColor:
                      msg.senderId === senderId ? "#1BAA64" : "#EAEAEA",
                    color: msg.senderId === senderId ? "#F5F7F9" : "#2F3645",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  {msg.message}
                </Box>
              </Tooltip>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#2F3645",
                mt: "2rem",
              }}
            >
              Send some messages to get connected.
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          py: 3,
          backgroundColor: "#F5F7F9",
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={message.Message}
          onChange={(e) =>
            setMessage((prevMessage) => ({
              ...prevMessage,
              Message: e.target.value,
            }))
          }
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.625rem",
            },
            "&:hover fieldset": {
              borderColor: "#1BAA64 !important",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1BAA64 !important",
            },
          }}
        />
        {/* <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            borderRadius: "0.625rem",
            // minWidth: "6.25rem",
            backgroundColor: "#1BAA64",
            maxHeight: "100%",
          }}
        > */}
        <span
          onClick={sendMessage}
          className="text-[#1BAA64] hover:cursor-pointer"
        >
          <MdSend size={"2rem"} />
        </span>
        {/* </Button> */}
      </Box>
    </Box>
  );
}

export default Chat;
