import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";

function EmployerProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    company: "",
    website: "",
  });

  const isOwner = user?.user?._id === id;

  useEffect(() => {
    fetchEmployer();
  }, []);

  const fetchEmployer = async () => {
    try {
      const res = await API.get(`/users/employer/${id}`);

      setEmployer(res.data);

      setForm({
        bio: res.data.bio || "",
        company: res.data.company || "",
        website: res.data.website || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to load employer profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await API.patch("/users/profile", form);

      setEditing(false);
      fetchEmployer();
    } catch (error) {
      console.error("Failed to update employer profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6">
        <p className="text-gray-500">Employer not found.</p>
      </div>
    );
  }

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

          <div className="text-center md:text-left flex-1">
            {/* NAME (READ ONLY) */}
            <h1 className="text-3xl font-bold text-blue-900">
              {employer.name}
            </h1>

            {/* COMPANY */}
            {editing ? (
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className="mt-2 border rounded px-3 py-1"
              />
            ) : (
              employer.company && (
                <p className="text-gray-600 mt-2">{employer.company}</p>
              )
            )}

            <p className="text-gray-500 mt-3">
              Member since {new Date(employer.createdAt).toLocaleDateString()}
            </p>
          </div>

          {isOwner && (
            <div>
              {editing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-900 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* PROFILE GRID */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* BIO */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              About Employer
            </h2>

            {editing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-500">
                {employer.bio || "Employer bio will appear here."}
              </p>
            )}
          </div>

          {/* WEBSITE */}
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Website
            </h2>

            {editing ? (
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border rounded px-3 py-2"
              />
            ) : employer.website ? (
              <a
                href={employer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {employer.website}
              </a>
            ) : (
              <p className="text-gray-500">No website provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerProfile;
