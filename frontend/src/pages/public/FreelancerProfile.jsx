import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

function FreelancerProfile() {
  const { id } = useParams();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancer();
  }, []);

  const fetchFreelancer = async () => {
    try {
      const res = await API.get(`/users/freelancer/${id}`);
      setFreelancer(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load freelancer profile:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <p className="text-gray-500">Freelancer not found.</p>
      </div>
    );
  }

  const ratingAvg = freelancer?.rating?.average || 0;
  const ratingCount = freelancer?.rating?.count || 0;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-10">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <img
            src="https://i.pravatar.cc/200"
            alt="profile"
            className="w-32 h-32 rounded-full object-cover"
          />

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-blue-900">
              {freelancer.name}
            </h1>

            <p className="text-yellow-500 text-lg mt-2">
              ⭐ {ratingAvg.toFixed(1)} ({ratingCount} reviews)
            </p>

            <p className="text-gray-500 mt-3">
              Member of EarnMinute freelance marketplace.
            </p>
          </div>
        </div>

        {/* PROFILE GRID */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* SKILLS */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Skills</h2>

            <p className="text-gray-500">
              Skills will be displayed here in future updates.
            </p>
          </div>

          {/* COMPLETED TASKS */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Completed Tasks
            </h2>

            <p className="text-gray-500">
              Task completion statistics will appear here later.
            </p>
          </div>

          {/* BIO */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              About Freelancer
            </h2>

            <p className="text-gray-500">
              Freelancer bio and experience will be shown here in future
              versions.
            </p>
          </div>

          {/* REVIEWS */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Client Reviews
            </h2>

            <p className="text-gray-500">
              Detailed employer reviews will appear here later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProfile;
