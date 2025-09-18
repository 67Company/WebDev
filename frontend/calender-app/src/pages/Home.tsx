import React from "react";
import Button from '@mui/material/Button';
import "./Home.css";

const Home: React.FC = () => {
  return (
    <main className="App-main">
      <section className="overview-card">
        <h2>📊 Dashboard</h2>
        <p>Get a quick snapshot of your data and insights here.</p>
      </section>

      <section className="overview-card">
        <h2>⚙️ Settings</h2>
        <p>Manage your preferences and configurations.</p>
      </section>

      <section className="overview-card">
        <h2>👀 Achievements</h2>
        <p>Need help? Reach out to our support team anytime.</p>
        <Button variant="contained">Volledige lijst bekijken</Button>
      </section>
    </main>
  );
};

export default Home;
