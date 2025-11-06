import React, { useState } from "react";
import "./Achievements.css";
import sampicon from "../media/adtje_kratje.png";
import beericon from "../media/beer.png";

interface Achievement {
  Id: number;
  Title: string;
  Description: string;
  Progress: number; // 0–100
  Icon?: string;
}

const getProgressFromStorage = (key: string): number => {
  const stored = localStorage.getItem(key);
  return stored !== null ? parseInt(stored, 10) : 0;
};

const PAGE_SIZE = 6;

const AchievementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState<"high-low" | "low-high" | "high-low-completed-last">("high-low");

  const achievements: Achievement[] = [
  { Id: 1, Title: "Morning Bloom", Description: "Started your day before 9 AM. You’re unstoppable.", Progress: 75, Icon: beericon},
  { Id: 2, Title: "Peaceful Focus", Description: "Stayed focused for 30 minutes without distractions.", Progress: 40, Icon: beericon },
  { Id: 3, Title: "Little Victories", Description: "Completed three small tasks that made a big difference.", Progress: 100, Icon: beericon },
  { Id: 4, Title: "Consistency Champ", Description: "Showed up three days in a row. Keep it going.", Progress: 60, Icon: beericon },
  { Id: 5, Title: "Mindful Break", Description: "Took a break instead of scrolling endlessly.", Progress: 25, Icon: beericon },
  { Id: 6, Title: "Task Tamer", Description: "Finished everything on your to-do list you tryhard.", Progress: 100, Icon: beericon },
  { Id: 7, Title: "Beer sipping", Description: "Drinking an alcoholic bevvy during a meeting.", Progress: 50, Icon: beericon },
  { Id: 8, Title: "Coworker Maxxing", Description: "Annoy your colleague for at least 10 hours.", Progress: 25, Icon: beericon },
  { Id: 9, Title: "Minesweeping is life", Description: "Win 10 games of minesweeper during work hours.", Progress: 70, Icon: beericon },
  { Id: 10, Title: "Email Ninja", Description: "Replied to all unread emails in one sitting, you fast boy.", Progress: 90, Icon: beericon },
  { Id: 11, Title: "Power Napper", Description: "Successfully napped without oversleeping.", Progress: 100, Icon: beericon },
  { Id: 12, Title: "Desk DJ", Description: "Played deephouse bangers that boosted team morale.", Progress: 55, Icon: beericon },
  { Id: 13, Title: "King Kebab", Description: "Eat a kebab at your desk after a wild night out.", Progress: 35, Icon: beericon },
  { Id: 14, Title: "Let's not get political", Description: "Defuse atleast 10 arguments about politics.", Progress: 20, Icon: beericon },
  { Id: 15, Title: "Find the hidden button", Description: "Find the hidden button on our site and press it", Progress: getProgressFromStorage("achievementCount") * 10, Icon: beericon}
  ];
  
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (sortMode === "high-low") return b.Progress - a.Progress;
    if (sortMode === "low-high") return a.Progress - b.Progress;
    if (sortMode === "high-low-completed-last") {
      if (a.Progress === 100 && b.Progress !== 100) return 1;
      if (b.Progress === 100 && a.Progress !== 100) return -1;
      return b.Progress - a.Progress;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedAchievements.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleAchievements = sortedAchievements.slice(startIndex, startIndex + PAGE_SIZE);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="achievement-page">
      <h1 className="achievement-title">✨ Your Achievements ✨</h1>

      <div className="sort-controls">
        <select
          id="sort"
          value={sortMode}
          onChange={(e) => {
            setSortMode(e.target.value as any);
            setCurrentPage(1);
          }}
        >
          <option value="high-low">High to Low</option>
          <option value="low-high">Low to High</option>
          <option value="high-low-completed-last">High to Low (Completed Last)</option>
        </select>
      </div>

      <div className="achievements-wrapper">
        <div className="achievements">
          {visibleAchievements.map((a) => (
            <div className="achievement-card" key={a.Id}>
              <img
              src={a.Icon || "/media/adtje_kratje.png"}
              alt={a.Title}
              className="achievement-icon"/>
              <h2 className="achievement-name">{a.Title}</h2>
              <p className="achievement-Description">{a.Description}</p>
              <div className="Progress-container">
                <div
                  className="Progress-bar"
                  style={{
                    width: `${a.Progress}%`,
                    backgroundColor: a.Progress === 100 ? "#28a745" : "#007bff",
                  }}
                ></div>
              </div>
              <p className="achievement-Progress">{a.Progress}%</p>
            </div>
          ))}

          {Array.from({ length: PAGE_SIZE - visibleAchievements.length }).map((_, i) => (
            <div key={`filler-${i}`} className="achievement-card placeholder"></div>
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
    </div>
  );
};

export default AchievementPage;
