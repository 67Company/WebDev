import "./CalenderDisplay.css";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

type ViewMode = "day" | "week";

const CalendarDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    // Sample events for demonstration
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(2025, 8, 25, 9, 0),
      end: new Date(2025, 8, 25, 10, 0),
      color: "#3b82f6"
    },
    {
      id: "2",
      title: "Project Review",
      start: new Date(2025, 8, 26, 14, 0),
      end: new Date(2025, 8, 26, 15, 30),
      color: "#10b981"
    },
    {
      id: "3",
      title: "Client Call",
      start: new Date(2025, 8, 27, 11, 0),
      end: new Date(2025, 8, 27, 12, 0),
      color: "#f59e0b"
    }
  ]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const difference = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(difference);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventPosition = (event: Event) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = (startHour * 60 + startMinute) / 60 * 60; // 60px per hour
    const height = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60 * 60;

    return { top, height };
  };

  const getCurrentTimePosition = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes) / 60 * 60; // 60px per hour
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = viewMode === "week" ? getWeekDays(currentDate) : [currentDate];

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button 
            className="nav-button" 
            onClick={() => navigateDate("prev")}
            aria-label={`Previous ${viewMode}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <div className="date-display">
            {viewMode === "day" ? (
              <h2>{formatDate(currentDate)}</h2>
            ) : (
              <h2>
                {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
              </h2>
            )}
          </div>
          
          <button 
            className="nav-button" 
            onClick={() => navigateDate("next")}
            aria-label={`Next ${viewMode}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        <div className="header-right">
          <button 
            className="today-button"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
          
          <div className="view-toggle">
            <button 
              className={`toggle-button ${viewMode === "day" ? "active" : ""}`}
              onClick={() => setViewMode("day")}
            >
              Day
            </button>
            <button 
              className={`toggle-button ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Time Column */}
        <div className="time-column">
          <div className="time-header"></div>
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              {hour > 0 && <span className="time-label">{formatTime(hour)}</span>}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <div className={`day-header ${isToday(day) ? "today" : ""}`}>
              <div className="day-name">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="day-number">
                {day.getDate()}
              </div>
            </div>
            
            <div className="day-timeline">
              {/* Hour grid lines */}
              {hours.map(hour => (
                <div key={hour} className="hour-line"></div>
              ))}
              
              {/* Current time indicator */}
              {isToday(day) && (
                <div 
                  className="current-time-line"
                  style={{ top: `${getCurrentTimePosition()}px` }}
                >
                  <div className="current-time-dot"></div>
                </div>
              )}
              
              {/* Events */}
              {getEventsForDate(day).map(event => {
                const { top, height } = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="event"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: event.color,
                    }}
                  >
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">
                      {event.start.toLocaleTimeString("en-US", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDisplay;

