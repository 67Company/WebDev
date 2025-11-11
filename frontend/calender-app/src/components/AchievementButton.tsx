import { useState, useEffect } from "react";
import "../styles/AchievementButton.css";

const AchievementButton = () => {
  const [count, setCount] = useState(() => {
    const stored = localStorage.getItem("achievementCount");
    return stored ? parseInt(stored, 10) : 0;
  });

  // Update storage when count changes
  useEffect(() => {
    localStorage.setItem("achievementCount", count.toString());
  }, [count]);

  return (
    <button
    className="achievement-button"
    onClick={() => setCount(count === 10 ? 0 : count + 1)}
    >
    Wowie Hidden button: {count}
    </button>

  );
};

export default AchievementButton;
