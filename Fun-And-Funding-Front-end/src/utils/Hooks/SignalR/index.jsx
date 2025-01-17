// useSignalR.js
import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cookies from "js-cookie";

const useSignalR = () => {
  const [message, setMessage] = useState(null);
  const token = Cookies.get("_auth");

  useEffect(() => {
    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7044/notificationHub', { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveNotification', (notification) => {
        // console.log("New notification:", notification);
        setMessage(notification.message);
      });

      try {
        await connection.start();
        console.log("SignalR connection established");
      } catch (error) {
        console.error('Error connecting to SignalR hub:', error);
      }

      return () => {
        connection.stop();
      };
    };

    connect();
  }, [token]);

  return message;
};

export default useSignalR;
