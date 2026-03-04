import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import PostTask from "./pages/PostTask";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import FreelancerProfile from "./pages/FreelancerProfile";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
