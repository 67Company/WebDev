import "./ThemeToggle.css";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return getCookie("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      setCookie("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      setCookie("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="theme-toggle-button"
    >
      {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
