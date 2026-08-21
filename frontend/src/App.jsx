import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Causes from './pages/Causes';
import Impact from './pages/Impact';
import Stories from './pages/Stories';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Visitor Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="causes" element={<Causes />} />
          <Route path="impact" element={<Impact />} />
          <Route path="stories" element={<Stories />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />
        </Route>

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Dashboard Workspace */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
