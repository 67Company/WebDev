import React, { useState } from "react";
import "../styles/Calendar.css";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  capacity?: number;
  currentAttendees?: number;
  isFull?: boolean;
  description?: string;
  location?: string;
}

interface EventDetailPanelProps {
  event: Event | null;
  onClose: () => void;
  onLeave: (eventId: string) => Promise<void>;
}

const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  onClose,
  onLeave
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  if (!event) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLeaveEvent = async () => {
    setIsLeaving(true);
    setLeaveError(null);

    try {
      await onLeave(event.id);
      onClose();
    } catch (err) {
      setLeaveError("Failed to leave event. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="event-detail-overlay" onClick={onClose}>
      <div className="event-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="event-detail-header">
          <h2>{event.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="event-detail-content">
          <div className="event-detail-section">
            <h3>Date & Time</h3>
            <p><strong>Date:</strong> {formatDate(event.start)}</p>
            <p><strong>Start:</strong> {formatTime(event.start)}</p>
            <p><strong>End:</strong> {formatTime(event.end)}</p>
          </div>

          {event.location && (
            <div className="event-detail-section">
              <h3>Location</h3>
              <p>{event.location}</p>
            </div>
          )}

          {event.description && (
            <div className="event-detail-section">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-detail-section">
            <h3>Attendance</h3>
            <p>
              {event.currentAttendees || 0} / {event.capacity || 'Unlimited'} attendees
              {event.isFull && <span className="full-badge"> (Full)</span>}
            </p>
          </div>

          {leaveError && (
            <div className="error-message">
              {leaveError}
            </div>
          )}

          <div className="event-detail-actions">
            <button 
              className="leave-event-button"
              onClick={handleLeaveEvent}
              disabled={isLeaving}
            >
              {isLeaving ? "Leaving..." : "Leave Event"}
            </button>
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPanel;
