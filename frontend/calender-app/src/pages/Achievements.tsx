import React, { useState, useEffect } from "react";
import "../styles/Achievements.css";
import "../styles/Cards.css";
import beericon from "../media/beer.png";
import trophyicon from "../media/trophy.png";
import { Api, Achievement } from "../CalendarApi";

async function fetchAllAchievements(companyId: number): Promise<Achievement[]> {
  const api = new Api();
  
  const res = await api.api.achievementCompanyDetail(companyId);
  const data = res.data;
  console.log(data);
  
  return data;
}

const getProgressInPercent = (Num: number, Goal: number): number => {
  if (Num >= Goal) return 100;
  else return Math.floor((Num / Goal) * 100);
}

const PAGE_SIZE = 6;

const AchievementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState<"high-low" | "low-high" | "high-low-completed-last">("high-low");
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        const data = await fetchAllAchievements(1); // Replace with actual companyId
        setAchievements(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load achievements:', err);
        setError('Failed to load achievements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);
  
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

      {error && (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading achievements...
        </div>
      ) : (
        <>
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
            <div className="achievements" key={currentPage}>
              {visibleAchievements.map((a, i) => (
                <div
                  className="overview-card animated-card"
                  key={a.Id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <img
                    src={a.Icon || "/media/adtje_kratje.png"}
                    alt={a.Title}
                    className="achievement-icon"
                  />
                  <h2 className="achievement-name">{a.Title}</h2>
                  <p className="achievement-description">{a.Description}</p>
                  <div className="Progress-container">
                    <div
                      className={`Progress-bar ${a.Progress === 100 ? "full" : ""}`}
                      style={{ width: `${a.Progress}%` }}
                    ></div>
                  </div>
                  <div className="achievement-stats">
                    <p>{a.Stat} / {a.Threshold}</p>
                    <p className="achievement-progress">{a.Progress}%</p>
                  </div>
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
        </>
      )}
    </div>
  );
};

export default AchievementPage;