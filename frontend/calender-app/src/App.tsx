import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import adtjeKratje from "./media/adtje_kratje.png";
import Settings from "./pages/Settings";
import ThemeToggle from "./components/ThemeToggle";
import Achievements from "./pages/Achievements";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">
            <img className="Logoimg" src={adtjeKratje} alt="Logo" />
          </Link>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
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
