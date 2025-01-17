import { useState, useEffect } from "react";
import walletApiInstance from "../../ApiInstance/walletApiInstance";
import withdrawRequestApiInstance from "../../ApiInstance/withdrawRequestApiInstance";
import { useLoading } from "../../../contexts/LoadingContext";
import bankAccountApiInstance from "../../ApiInstance/bankAccountApiInstance";

export const useWalletApi = (endpoint, method = "GET", body = null, triggerReload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [bankAccData, setBankAccData] = useState(null);

  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await walletApiInstance.request({
          url: endpoint,
          method,
          data: body,
        });
        setData(response.data);

        if (response.data && response.data._data && response.data._data.id) {
          const bankAccountResponse = await bankAccountApiInstance.request({
            url: `/${response.data._data.id}`,
            method: "GET",
          });
          setBankAccData(bankAccountResponse.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, triggerReload]);

  return { data, error, bankAccData };
};

export const useWithdrawRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const createWithdrawRequest = async (requestData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await withdrawRequestApiInstance.post("/wallet-request", requestData);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createWithdrawRequest, loading, error, response };
};


