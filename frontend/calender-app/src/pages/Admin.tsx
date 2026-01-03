import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Cards.css";

const Admin: React.FC = () => {
  return (
    <main className="App-main">
      <section className="overview-card">
        <h2>📅 Event Management</h2>
        <p>Manage all company events - create, edit, and delete events.</p>
        <Link to="/admin/events">
          <button className="button">Click for more</button>
        </Link>
      </section>

      <section className="overview-card">
        <h2>🏆 Achievement Management</h2>
        <p>Manage company achievements and milestones.</p>
        <Link to="/admin/achievements">
          <button className="button">Click for more</button>
        </Link>
      </section>
    </main>
  );
};

export default Admin;
