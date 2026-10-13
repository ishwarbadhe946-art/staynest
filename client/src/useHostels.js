import { useCallback, useEffect, useState } from "react";
import { errorMessage, getHostels } from "./api";

export default function useHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setHostels(await getHostels());
    } catch (e) {
      setError(errorMessage(e, "Unable to load properties."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { hostels, loading, error, refresh };
}
