import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

function useAdminAnalytics() {

  const fetchCharts = async () => {
    const res = await API.get("/analytics/admin-charts");
    return res.data;
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ["adminCharts"],
    queryFn: fetchCharts,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false
  });

  return {
    chartData: data,
    isLoading
  };
}

export default useAdminAnalytics;