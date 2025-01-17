import { useState, useEffect } from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import categoryApiInstace from "../../ApiInstance/categoryApiInstance";

export const useCategoryApi = (endpoint, method = "GET", body = null, reload = false) => {
  const [cateData, setCateData] = useState(null);
  const [error, setError] = useState(null);

  const { isLoading, setIsLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await categoryApiInstace.request({
          url: endpoint,
          method,
          data: body,
        });
        setCateData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, reload]);

  return { cateData, error };
};