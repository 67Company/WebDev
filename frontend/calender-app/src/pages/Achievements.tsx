import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Achievements.css";
import "../styles/Cards.css";
import beericon from "../media/beer.png";
import trophyicon from "../media/trophy.png";
import { Api, Achievement } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";

async function fetchEmployeeDetails(employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.authMeDetail(employeeId);
  return response.data
}

async function fetchCompanyAchievements(companyId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.achievementCompanyDetail(companyId);
  return response.data;
}

const getProgressInPercent = (Num: number, Goal: number): number => {
  if (Num >= Goal) return 100;
  else return Math.floor((Num / Goal) * 100);
}

const PAGE_SIZE = 6;

const AchievementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam) : 1;
  });
  const [sortMode, setSortMode] = useState<"high-low" | "low-high" | "high-low-completed-last">(() => {
    const sortParam = searchParams.get('sort') as "high-low" | "low-high" | "high-low-completed-last";
    return sortParam || "high-low";
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        
        // get logged in user van local storage
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('Please log in to view achievements');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        
        // fetch employee details om stats te krijgen
        const employeeData = await fetchEmployeeDetails(user.id);
        
        if (!employeeData || !employeeData.stats || !employeeData.companyId) {
          setError('Invalid employee data');
          setLoading(false);
          return;
        }
        
        const stats = employeeData.stats;
        const companyId = employeeData.companyId;
        
        // fetch achievements van employee's company
        const achievementsData = await fetchCompanyAchievements(companyId);
        
        // transform API data and calculate progress based on employee stats
        const transformedData = achievementsData.map((achievement: any) => {
          const statKey = achievement.statToTrack
            ? achievement.statToTrack.charAt(0).toLowerCase() + achievement.statToTrack.slice(1)
            : "";
          const statValue = (stats as any)[statKey] || 0;
          const progress = getProgressInPercent(statValue, achievement.threshold);
          
          return {
            Id: achievement.id || 0,
            Title: achievement.title || "Unknown",
            Description: achievement.description || "No description",
            Icon: trophyicon,
            Threshold: achievement.threshold || 0,
            StatToTrack: achievement.statToTrack || "",
            Stat: statValue,
            Progress: progress
          };
        });
        
        setAchievements(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to load achievements:', err);
        setError('Failed to load achievements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();

    // Dit is zodat de page automatisch refreshed every so often om nieuwe achievements te laden
    const intervalId = setInterval(() => {
      loadAchievements();
    }, 60000); // Refresh 60 sec

    return () => clearInterval(intervalId);
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

  const nextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(newPage);
    setSearchParams({ sort: sortMode, page: newPage.toString() });
  };
  const prevPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    setSearchParams({ sort: sortMode, page: newPage.toString() });
  };

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
                const newSort = e.target.value as any;
                setSortMode(newSort);
                setCurrentPage(1);
                setSearchParams({ sort: newSort, page: '1' });
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