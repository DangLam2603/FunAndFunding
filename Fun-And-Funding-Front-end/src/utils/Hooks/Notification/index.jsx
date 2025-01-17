import { useState, useEffect } from "react";
import notificationApiInstance from "../../ApiInstance/notificationApiInstance";

import { useLoading } from "../../../contexts/LoadingContext";

export const useNotificationApi = (endpoint, method = "GET", body = null) => {
  const [notiData, setNotiData] = useState(null);
  const [error, setError] = useState(null);
  const { isLoading, setIsLoading } = useLoading();

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationApiInstance.request({
        url: endpoint,
        method,
        data: body,
      });
      setNotiData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [endpoint, method, body]);

  return { notiData, error, fetchNotifications };
};
