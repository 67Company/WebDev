import React, { useState } from "react";
import "./Achievements.css";

interface Achievement {
  id: number;
  name: string;
  description: string;
  progress: number; // 0–100
}

const achievements: Achievement[] = [
  { id: 1, name: "Morning Bloom", description: "Started your day before 9 AM. You’re unstoppable.", progress: 75 },
  { id: 2, name: "Peaceful Focus", description: "Stayed focused for 30 minutes without distractions.", progress: 40 },
  { id: 3, name: "Little Victories", description: "Completed three small tasks that made a big difference.", progress: 100 },
  { id: 4, name: "Consistency Champ", description: "Showed up three days in a row. Keep it going.", progress: 60 },
  { id: 5, name: "Mindful Break", description: "Took a break instead of scrolling endlessly.", progress: 25 },
  { id: 6, name: "Task Tamer", description: "Finished everything on your to-do list.", progress: 100 },
  { id: 7, name: "Beer sipping", description: "Drinking a bevvy during a meeting.", progress: 50 },
  { id: 8, name: "Coworker Maxxing", description: "Annoy your colleague for at least 10 hours.", progress: 25 },
  { id: 9, name: "Minesweeper during office hours", description: "Win 10 games of minesweeper during work hours.", progress: 70 },
  { id: 10, name: "Email Ninja", description: "Replied to all unread emails in one sitting.", progress: 90 },
  { id: 11, name: "Power Napper", description: "Successfully napped without oversleeping.", progress: 100 },
  { id: 12, name: "Desk DJ", description: "Played music that boosted team morale.", progress: 55 },
];

const AchievementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const achievementsPerPage = 6;

  const totalPages = Math.ceil(achievements.length / achievementsPerPage);
  const startIndex = (currentPage - 1) * achievementsPerPage;
  const endIndex = startIndex + achievementsPerPage;
  const currentAchievements = achievements.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="achievement-page">
      <h1 className="achievement-title">✨ Your Achievements ✨</h1>

      <div className="achievements">
        {currentAchievements.map((a) => (
          <div className="achievement-card" key={a.id}>
            <h2 className="achievement-name">{a.name}</h2>
            <p className="achievement-description">{a.description}</p>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${a.progress}%`,
                  backgroundColor: a.progress === 100 ? "#28a745" : "#007bff",
                }}
              ></div>
            </div>

            <p className="achievement-progress">{a.progress}%</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          ⬅ Previous
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="pagination-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default AchievementPage;
