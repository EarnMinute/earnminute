import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

function useAdminDashboard() {

  const fetchDashboard = async () => {
    const res = await API.get("/analytics/admin-dashboard");
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5
  });

  return {
    data,
    isLoading
  };
}

export default useAdminDashboard;