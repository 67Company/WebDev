import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Code makes it so darkmode cookie will load before the page.
const match = document.cookie.match(/(?:^| )theme=([^;]+)/);
const theme = match ? decodeURIComponent(match[1]) : null;
if (theme === "dark") {
  document.documentElement.classList.add("dark-mode");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
