import React from "react";
import "../styles/Login.css";
import "../styles/Cards.css";

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <div className="overview-card">
        <h2 className="login-title">Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="loginlabel">Email</label>
            <input type="email" id="email" placeholder="Enter email" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="loginlabel">Password</label>
            <input type="password" id="password" placeholder="Enter password" />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
