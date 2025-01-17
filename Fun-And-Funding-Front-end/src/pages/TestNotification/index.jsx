import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Cookies from "js-cookie";


const TestNotification = () => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState(null)

  const token = Cookies.get("_auth")

  useEffect(() => {
    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7044/notificationHub', { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveNotification', (notification) => {
        console.log("New notification for you:", notification);
        setMessage(notification.message)
      });
      try {
        await connection.start();
        setConnection(connection);
      } catch (error) {
        console.error('Error connecting to SignalR hub:', error);
      }
    };

    connect();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [message]);

  const handleSendNotification = async () => {
    if (connection) {
      try {
        const notification = {
          message: "Hello, this is a TEST notification!",
          notificationType: 0,
          objectId: '4fb92d5b-f332-4d12-4858-08dcf8e9388d',
          date: new Date(),
          isRead: false,
        };

        const userIdList = ["f766c910-4f6a-421e-a1a3-61534e6005c3", "408D9BDB-7AAF-4AAA-B31A-968E0BEF4813"];

        const payload = {
          notification,
          userIds: userIdList,
        };

        await fetch('https://localhost:7044/api/notification/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      console.error('Connection not established.');
    }
  };


  return (
    <div>
      <button onClick={handleSendNotification}>Send Notification</button>
      <div>Message: {message}</div>
    </div>
  );
};

export default TestNotification;
