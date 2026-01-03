import "./CalenderDisplay.css";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface CalendarDisplayProps {
  events: Event[];
  timeslots?: { id?: number; startTime?: string; endTime?: string }[];
  onSlotSelect?: (args: { date: Date; timeslotId?: number; start?: Date }) => void;
  onEventClick?: (event: Event) => void;
}

type ViewMode = "day" | "week";

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({ events, timeslots = [], onSlotSelect, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentTime, setCurrentTime] = useState(new Date());

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const timeslotStarts = timeslots
    .map(slot => {
      if (!slot.startTime) return null;
      const d = new Date(slot.startTime);
      return {
        id: slot.id,
        start: d,
        minutes: d.getHours() * 60 + d.getMinutes(),
      };
    })
    .filter(Boolean) as { id?: number; start: Date; minutes: number }[];

  const pickTimeslot = (minutes: number) => {
    if (!timeslotStarts.length) return null;
    // pick closest timeslot that starts at or after click; fallback to last
    const sorted = [...timeslotStarts].sort((a, b) => a.minutes - b.minutes);
    const match = sorted.find(t => t.minutes >= minutes) ?? sorted[sorted.length - 1];
    return match;
  };

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

  // Handle mouse events to prevent page scrolling
  const handleMouseEnter = () => {
    document.body.style.overflow = 'hidden';
  };

  const handleMouseLeave = () => {
    document.body.style.overflow = 'auto';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div 
      className="calendar-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
        {/* Sticky Header Row */}
        <div className="calendar-scrollable-body">
          {/* Scrollable Calendar Body */}
          <div className="calendar-sticky-header">
            {/* Time Header Cell */}
            <div className="time-header-cell"></div>
            
            {/* Day Headers */}
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
              </div>
            ))}
          </div>

          <div className="calendar-content">
            {/* Time Column */}
            <div className="time-column">
              {hours.map(hour => (
                <div key={hour} className="time-slot">
                  {hour > 0 && <span className="time-label">{formatTime(hour)}</span>}
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="day-column-body"
                onClick={(e) => {
                  if (!onSlotSelect) return;
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const scrollParent = (e.currentTarget as HTMLDivElement).parentElement;
                  const scrollOffset = scrollParent?.scrollTop || 0;
                  const y = e.clientY - rect.top + scrollOffset;
                  // Each hour = 60px, so divide by 60 to get hours, then multiply by 60 to convert to minutes
                  const minutes = Math.round((y / 60) * 60);
                  const slot = pickTimeslot(minutes);
                  if (!slot) {
                    console.warn('No timeslot found for minutes:', minutes);
                    return;
                  }
                  const selectedDate = new Date(day);
                  selectedDate.setHours(slot.start.getHours(), slot.start.getMinutes(), 0, 0);
                  console.log('Selected slot:', { date: selectedDate, timeslotId: slot.id, slot: slot.start.toISOString() });
                  onSlotSelect({ date: selectedDate, timeslotId: slot.id, start: slot.start });
                }}
                role={onSlotSelect ? "button" : undefined}
                tabIndex={onSlotSelect ? 0 : undefined}
              >
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
                    const formatTime24 = (date: Date) => {
                      return date.toLocaleTimeString("nl-NL", { 
                        hour: "2-digit", 
                        minute: "2-digit",
                        hour12: false
                      });
                    };
                    return (
                      <div
                        key={event.id}
                        className="event"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: event.color,
                          cursor: onEventClick ? 'pointer' : 'default',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) onEventClick(event);
                        }}
                      >
                        <div className="event-title">{event.title}</div>
                        <div className="event-time">
                          {formatTime24(event.start)} - {formatTime24(event.end)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDisplay;

