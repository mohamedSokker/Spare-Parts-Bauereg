import { useState, useEffect } from "react";

import useAxiosPrivate from "./useAxiosPrivate";
import { showToast } from "../functions/showToast";
import { getDistinctObjects } from "../functions/getDistinctObjects";

const useFetch = (url, method, depArray, body, isFiltered) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorBody, setErrorBody] = useState("");

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getData = async () => {
      try {
        const data = await axiosPrivate(url, {
          method: method,
          data: JSON.stringify(body),
        });
        if (isFiltered) {
          const distinctObjects = getDistinctObjects(data?.data, "OrderNo");
          setData(distinctObjects);
        } else {
          setData(data?.data);
        }

        setLoading(false);
      } catch (err) {
        showToast(
          `error`,
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.message
        );
        setLoading(false);
      }
    };

    getData();
  }, [...depArray]);

  return {
    data,
    error,
    errorBody,
    loading,
    setData,
    setLoading,
    setError,
    setErrorBody,
  };
};

export default useFetch;
