import "./ActivitySidebar.css";
import React, { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface ActivitySidebarProps {
  events: Event[];
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ events }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    
    const now = new Date();
    
    
    const upcoming = events
      .filter(event => event.start > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);

    setUpcomingEvents(upcoming);
  }, [events]);

  const formatEventDate = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return "Today";
    } else if (isTomorrow) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true
    });
  };

  const getTimeUntilEvent = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Starting soon';
    }
  };

  return (
    <div className="activity-sidebar">
      <div className="sidebar-header">
        <h2>Upcoming Activities</h2>
        <div className="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>

      <div className="sidebar-content">
        {upcomingEvents.length > 0 ? (
          <div className="events-list">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="event-card"
                style={{ 
                  '--event-color': event.color || '#667eea',
                  animationDelay: `${index * 0.1}s`
                } as React.CSSProperties}
              >
                <div 
                  className="event-color-indicator"
                  style={{ backgroundColor: event.color || '#667eea' }}
                ></div>
                
                <div className="event-details">
                  <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <span className="event-countdown">{getTimeUntilEvent(event.start)}</span>
                  </div>
                  
                  <div className="event-datetime">
                    <div className="event-date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{formatEventDate(event.start)}</span>
                    </div>
                    
                    <div className="event-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{formatEventTime(event.start)} - {formatEventTime(event.end)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
            </div>
            <h3>All Caught Up!</h3>
            <p>You have no upcoming activities scheduled.</p>
            <p className="empty-subtext">Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySidebar;
