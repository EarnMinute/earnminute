import { useLocation, useNavigate } from "react-router-dom";

function FloatingFeedbackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/feedback") return null;

  return (
    <button
      onClick={() => navigate("/feedback")}
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg transition z-50"
    >
      💬 Feedback
    </button>
  );
}

export default FloatingFeedbackButton;
