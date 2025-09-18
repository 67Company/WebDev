import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to My App</h1>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Team Adtje Kratje.</p>
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </footer>

      </div>
    </Router>
  );
}

export default App;
