import { useEffect, useState } from "react";

export function useFetch(fetchFunction, initialData = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedData = await fetchFunction();
        setData(fetchedData);
      } catch (error) {
        setError({
          message: error.message || "Failed to fetch user places.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchFunction]);

  return { data, loading, error, setData, setError };
}
