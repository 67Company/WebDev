import React, { useState } from "react";
import "../styles/Achievements.css";
import beericon from "../media/beer.png";
import trophyicon from "../media/trophy.png";


const createAchievement = (id: number, title: string, desc: string, stat: number, threshold: number, icon: any) => {
  return {
    Id: id,
    Title: title,
    Description: desc,
    Stat: stat,
    Threshold: threshold,
    Progress: getProgressInPercent(stat, threshold),
    Icon: icon
  };
};

const getStatFromStorage = (key: string): number => {
  const value = localStorage.getItem(key);
  return value !== null ? parseInt(value) : 0;
};

const getProgressInPercent = (Num: number, Goal: number): number => {
  if (Num >= Goal) return 100;
  else return Math.floor((Num / Goal) * 100);
}

const PAGE_SIZE = 6;

const AchievementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState<"high-low" | "low-high" | "high-low-completed-last">("high-low");

  const achievements = [
    createAchievement(1, "Morning Bloom", "Started your day before 9 AM. You’re unstoppable.", 75, 100, beericon),
    createAchievement(2, "Peaceful Focus", "Stayed focused for 30 minutes without distractions.", 40, 100, beericon),
    createAchievement(3, "Little Victories", "Completed three small tasks that made a big difference.", 100, 100, beericon),
    createAchievement(4, "Consistency Champ", "Showed up three days in a row. Keep it going.", 60, 100, beericon),
    createAchievement(5, "Mindful Break", "Took a break instead of scrolling endlessly.", 25, 100, beericon),
    createAchievement(6, "Task Tamer", "Finished everything on your to-do list you tryhard.", 100, 100, trophyicon),
    createAchievement(7, "Beer sipping", "Drinking an alcoholic bevvy during a meeting.", 50, 100, beericon),
    createAchievement(8, "Coworker Maxxing", "Annoy your colleague for at least 10 hours.", 25, 100, beericon),
    createAchievement(9, "Minesweeping is life", "Win 10 games of minesweeper during work hours.", 70, 100, beericon),
    createAchievement(10, "Email Ninja", "Replied to all unread emails in one sitting, you fast boy.", 90, 100, beericon),
    createAchievement(11, "Power Napper", "Successfully napped without oversleeping.", 100, 100, beericon),
    createAchievement(12, "Desk DJ", "Played deephouse bangers that boosted team morale.", 55, 100, beericon),
    createAchievement(13, "King Kebab", "Eat a kebab at your desk after a wild night out.", 35, 100, beericon),
    createAchievement(14, "Let's not get political", "Defuse atleast 10 arguments about politics.", 20, 100, beericon),
    createAchievement(15, "Find the hidden button", "Find the hidden button on our site and press it", getStatFromStorage("achievementCount"), 10, beericon)
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
