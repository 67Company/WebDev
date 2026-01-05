import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import adtjeKratje from "./media/adtje_kratje.png";
import Settings from "./pages/Settings";
import ThemeToggle from "./components/ThemeToggle";
import Achievements from "./pages/Achievements";
import Admin from "./pages/Admin";
import AdminEvents from "./pages/AdminEvents";
import AdminAchievements from "./pages/AdminAchievements";
import AdminEmployees from "./pages/AdminEmployees";
import OfficeAttendance from "./pages/OfficeAttendance";
import { Api } from "./CalendarApi";

const API_BASE_URL = "http://localhost:5000";

async function fetchCurrentSession() {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.authSessionList();
  return response;
}

async function logoutSession() {
  const api = new Api({ baseUrl: API_BASE_URL });
  await api.api.authLogoutCreate();
}

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check server-side session on initial load and when user changes
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetchCurrentSession();
        
        if (response.status === 200 && response.data) {
          const sessionData = response.data as any;
          const userData = {
            id: sessionData.id,
            email: sessionData.email,
            companyId: sessionData.companyId,
            isAdmin: sessionData.isAdmin,
          };
          setUser(userData);
          // Store in localStorage for other pages to access
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err: any) {
        // No active session - this is expected when not logged in
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Luistert naar custom login/logout events
    window.addEventListener('userChanged', checkUser);
    return () => window.removeEventListener('userChanged', checkUser);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch (err) {
      // Logout failed silently
    }
    setUser(null);
    localStorage.removeItem('user'); // Clear cached user data
    navigate('/');
    window.dispatchEvent(new Event('userChanged'));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
        <header className="App-header">
          <Link to="/">
            <img className="Logoimg" src={adtjeKratje} alt="Logo" />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            {user && (
              <>
                <span style={{ color: '#fff' }}>{user.email}</span>
                {user.isAdmin && (
                  <Link to="/admin">
                    <button className="login-button">Admin Panel</button>
                  </Link>
                )}
                <button className="login-button" onClick={handleLogout}>Logout</button>
              </>
            )}
            {!user && (
              <Link to="/login">
                <button className="login-button">Login</button>
              </Link>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/office-attendance" element={<OfficeAttendance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin" element={
            user && user.isAdmin ? <Admin /> : <Navigate to="/login" replace />
          } />
          <Route path="/admin/events" element={
            user && user.isAdmin ? <AdminEvents /> : <Navigate to="/login" replace />
          } />
          <Route path="/admin/achievements" element={
            user && user.isAdmin ? <AdminAchievements /> : <Navigate to="/login" replace />
          } />
          <Route path="/admin/employees" element={
            user && user.isAdmin ? <AdminEmployees /> : <Navigate to="/login" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Team Adtje Kratje.</p>
        </div>
      </footer>

      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
