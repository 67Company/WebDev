import React from "react";
import "../styles/Settings.css";
import ThemeToggle from "../components/ThemeToggle";
import AchievementButton from "../components/AchievementButton";

const Settings: React.FC = () => {
  return (
    <main className="App-main">
      <section className="settings-card">
        <h2>⚙️ Settings</h2>
        <p>Manage your preferences and configurations.</p>

        <div className="setting-item">
          <h3>Theme</h3>
          <ThemeToggle />
          <p>Switch between light and dark mode.</p>
        </div>
      <AchievementButton/>

      </section>
    </main>
  );
};

export default Settings;
