import React from "react";
import "../styles/Settings.css";
import "../styles/Cards.css";
import ThemeToggle from "../components/ThemeToggle";

const Settings: React.FC = () => {
  return (
    <main className="App-main">
      <section className="overview-card">
        <h2>⚙️ Settings</h2>
        <p>Manage your preferences and configurations.</p>

        <div className="setting-item">
          <h2>Theme</h2>
          <ThemeToggle />
          <p>Switch between light and dark mode.</p>
        </div>

      </section>
    </main>
  );
};

export default Settings;
