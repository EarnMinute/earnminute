import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeedbacks,
  markFeedbackReviewed,
} from "@/services/feedbackService";

function useAdminFeedbacks() {
  const queryClient = useQueryClient();

  const fetchFeedbacks = async () => {
    const data = await getFeedbacks();
    return data.feedbacks || [];
  };

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["adminFeedbacks"],
    queryFn: fetchFeedbacks,
  });

  const markReviewed = async (id) => {
    await markFeedbackReviewed(id);
    queryClient.invalidateQueries(["adminFeedbacks"]);
  };

  return {
    feedbacks,
    isLoading,
    markReviewed,
  };
}

export default useAdminFeedbacks;