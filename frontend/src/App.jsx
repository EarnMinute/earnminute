import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import RoleSelectionPage from "./pages/auth/RoleSelectionPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostTask from "./pages/employer/PostTask";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";

import Tasks from "./pages/public/Tasks";
import TaskDetails from "./pages/public/TaskDetails";
import FreelancerProfile from "./pages/public/FreelancerProfile";
import GuestEmployerPage from "./pages/public/GuestEmployerPage";
import GuestFreelancerPage from "./pages/public/GuestFreelancerPage";
import FeedbackPage from "./pages/public/FeedbackPage";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";

import Forbidden from "./pages/misc/Forbidden";
import NotFound from "./pages/misc/NotFound";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<RoleSelectionPage />} />
          <Route path="/employers" element={<GuestEmployerPage />} />
          <Route path="/freelancers" element={<GuestFreelancerPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute role="admin">
                <AdminTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute role="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-task"
            element={
              <ProtectedRoute role="employer">
                <PostTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/profile/:id"
            element={<FreelancerProfile />}
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
