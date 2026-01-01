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
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* temp: laat email zien voor testen */}
              <span style={{ color: '#fff' }}>{user.email}</span>
              <button className="login-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          )}
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/achievements" element={<Achievements />} />
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
