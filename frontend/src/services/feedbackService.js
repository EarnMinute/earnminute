import api from "./api";

export const getFeedbacks = async (params = {}) => {
  const { data } = await api.get("/feedback", { params });
  return data;
};

export const markFeedbackReviewed = async (id) => {
  const { data } = await api.patch(`/feedback/${id}/review`);
  return data;
};