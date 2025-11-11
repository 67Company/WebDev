import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Cards.css";


const Home: React.FC = () => {
  return (
    <main className="App-main">
      <section className="overview-card">
        <h2>Calendar</h2>
        <p>Take a look at your calendar here.</p>
        <Link to="/Calendar">
        <button className="button">Click for more</button>
        </Link>
      </section>

      <section className="overview-card">
        <h2>Achievements</h2>
        <p>Need help? Reach out to our support team anytime.</p>
        <Link to="/Achievements">
        <button className="button">Click for more</button>
        </Link>
      </section>
      
      <section className="overview-card">
        <h2>Settings</h2>
        <p>Manage your preferences and configurations.</p>
        <Link to="/Settings">
        <button className="button">Click for more</button>
        </Link>
      </section>
    </main>
  );
};

export default Home;
