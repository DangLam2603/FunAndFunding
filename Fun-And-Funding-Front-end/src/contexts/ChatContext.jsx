import { useState, useContext, createContext } from "react";

// Create the context
const ChatContext = createContext();

// Custom hook to access the context
export const useChat = () => useContext(ChatContext);

// ChatProvider to wrap components with chat functionality
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // Store all chat messages

  // Function to add a new message
  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
