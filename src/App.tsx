import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import ForgotPassword from "./pages/ForgotPassword";
import AppLayout from "./layouts/AppLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminCategories from "./pages/AdminCategories";
import AdminStudents from "./pages/AdminStudents";
import AdminIssue from "./pages/AdminIssue";
import AdminReturn from "./pages/AdminReturn";
import AdminProfile from "./pages/AdminProfile";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
     <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<GuestRoute />}>
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/student" element={<StudentLogin />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Layout */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AppLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="issue" element={<AdminIssue />} />
            <Route path="return" element={<AdminReturn />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={<AppLayout role="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
     <Toaster richColors position="top-right" />
    </>
  );
  
}

export default App;
