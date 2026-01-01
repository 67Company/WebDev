import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Cards.css";
import { Api } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";

async function loginUser(email: string, password: string) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.authLoginCreate({
    email,
    passwordHash: password,
  });
  return response;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      
      if (response.ok) {
        const data = response.data as any;
        // Store user in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify({
          id: data.employee.id,
          email: data.employee.email,
          isAdmin: data.isAdmin,
        }));
        // Notify App component that user has logged in
        window.dispatchEvent(new Event('userChanged'));
        navigate("/"); // Redirect after successful login
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="overview-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="loginlabel">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="loginlabel">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
