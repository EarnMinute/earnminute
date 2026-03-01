import { useState } from "react";
import API from "../services/api";

function RatingModal({ taskId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a rating");

    try {
      setLoading(true);

      await API.patch(`/tasks/${taskId}/rate`, {
        rating,
        review,
      });

      alert("Rating submitted successfully");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Rating error:", error);
      alert("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Rate Freelancer</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Rating (1–5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Write your feedback..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-800 text-white rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
