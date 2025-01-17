import { useState, useEffect } from "react";
import projectMilestoneApiInstace from "../../ApiInstance/projectMilestoneApiInstance";
import { useLoading } from "../../../contexts/LoadingContext";

export const useProjectMilestoneApi = (endpoint, method = "GET", body = null, triggerReload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { isLoading, setIsLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        setIsLoading(true);
        const response = await projectMilestoneApiInstace.request({
          url: endpoint,
          method,
          data: body,
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, triggerReload]);

  return { data, error };
};