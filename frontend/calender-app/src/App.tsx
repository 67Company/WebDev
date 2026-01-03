import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

function App() {
  const [user, setUser] = useState<any>(null);

  // Checkt localStorage eerste keer laden en luistert naar login/logout events
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Luistert naar custom login/logout events
    window.addEventListener('userChanged', checkUser);
    return () => window.removeEventListener('userChanged', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userChanged'));
  };

  return (
    <Router>
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
          <Route path="/settings" element={<Settings />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin" element={
            user && user.isAdmin ? <Admin /> : <Login />
          } />
          <Route path="/admin/events" element={
            user && user.isAdmin ? <AdminEvents /> : <Login />
          } />
          <Route path="/admin/achievements" element={
            user && user.isAdmin ? <AdminAchievements /> : <Login />
          } />
        </Routes>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Team Adtje Kratje.</p>
        </div>
      </footer>

      </div>
    </Router>
  );
}

export default App;
