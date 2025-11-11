import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <main className="App-main">
      <section className="overview-card">
        <h2>📅 Calendar</h2>
        <p>Take a look at your calendar here.</p>
        <Link to="/Calendar">
        <Button variant="contained">Click for more</Button>
        </Link>
      </section>

      <section className="overview-card">
        <h2>⚙️ Settings</h2>
        <p>Manage your preferences and configurations.</p>
        <Link to="/Settings">
        <Button variant="contained">Click for more</Button>
        </Link>
      </section>

      <section className="overview-card">
        <h2>👀 Achievements</h2>
        <p>Need help? Reach out to our support team anytime.</p>
        <Link to="/Achievements">
        <Button variant="contained">Full list here</Button>
        </Link>
      </section>
    </main>
  );
};

export default Home;
