import { useState } from "react";

function FeedbackPage() {
  const [form, setForm] = useState({
    type: "suggestion",
    message: "",
    name: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Feedback submitted:", form);

    // later connect API here

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Help Improve EarnMinute</h1>

        <p className="text-blue-100 mt-4 max-w-xl mx-auto">
          EarnMinute is currently in beta. Your suggestions, bug reports, and
          ideas help us improve the platform and build a better experience for
          everyone.
        </p>
      </div>

      {/* FORM SECTION */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {submitted ? (
          <div className="bg-white shadow-md rounded-xl p-10 text-center">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Thank You!
            </h2>

            <p className="text-gray-600">
              Your feedback has been received. We appreciate you helping us
              improve EarnMinute.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-8 space-y-6"
          >
            <h2 className="text-2xl font-semibold text-blue-900">
              Share Your Feedback
            </h2>

            {/* FEEDBACK TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="ui">UI / Design Feedback</option>
                <option value="performance">Performance Issue</option>
                <option value="general">General Feedback</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>

              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your experience, suggestion, or issue..."
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* OPTIONAL CONTACT INFO */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 mb-4">
                Optional — Leave your details if you'd like us to follow up.
              </p>

              {/* NAME */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (optional)
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
