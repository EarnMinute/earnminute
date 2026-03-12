import { useState } from "react";
import API from "@/services/api";

function RatingModal({ taskId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setMessage("Please select a rating.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.post(`/tasks/${taskId}/rate`, {
        rating: Number(rating),
        review,
      });

      setMessage("Rating submitted successfully.");

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } catch (error) {
      console.error("Rating error:", error);
      setMessage(error?.response?.data?.message || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-6">
          Rate Freelancer
        </h2>

        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Select Rating</p>

          <div className="flex justify-center gap-2 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                className={`transition ${
                  num <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Review (optional)
          </label>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
            placeholder="Share your feedback..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
          />
        </div>

        {message && (
          <p className="text-sm text-center text-blue-700 mb-4">{message}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
