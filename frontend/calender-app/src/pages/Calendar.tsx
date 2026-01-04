import React, { useState, useEffect } from "react";
import "../styles/Calendar.css";
import CalendarDisplay from "../components/CalenderDisplay";
import ActivitySidebar from "../components/ActivitySidebar";
import ReservationPanel from "../components/ReservationPanel";
import ReviewModal from "../components/ReviewModal";
import { Api, Room, Timeslot } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  capacity?: number;
  currentAttendees?: number;
  isFull?: boolean;
  reservationId?: number;
  roomName?: string;
  roomId?: number;
  timeslotId?: number;
  description?: string;
  location?: string;
}

async function fetchEmployeeDetails(employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.authMeDetail(employeeId);
  return response.data;
}

async function fetchCompanyEvents(companyId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.eventWithCapacityList({ companyId });
  return response.data;
}

async function fetchJoinedEvents(employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.eventJoinedDetail(employeeId);
  return response.data;
}

async function joinEvent(eventId: number, employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.eventJoinCreate(eventId, employeeId);
  return response.ok;
}

async function leaveEvent(eventId: number, employeeId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.eventLeaveDelete(eventId, employeeId);
  return response.ok;
}

async function submitReview(eventId: number, employeeId: number, rating: number, content: string) {
  const response = await fetch(`${API_BASE_URL}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId,
      employeeId,
      rating,
      content
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit review');
  }
  
  return response.json();
}

async function fetchRooms(companyId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.roomCompanyDetail(companyId);
  return response.data ?? [];
}

async function fetchTimeslots() {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.timeslotList();
  return response.data ?? [];
}

async function fetchEmployeeReservations(employeeId: number, companyId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.reservationEmployeeDetail(employeeId, { companyId });
  return response.data ?? [];
}

async function fetchCompanyReservations(companyId: number) {
  const api = new Api({ baseUrl: API_BASE_URL });
  const response = await api.api.reservationList({ companyId });
  return response.data ?? [];
}

const Calendar: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]); // Events shown in calendar (joined only)
  const [allEvents, setAllEvents] = useState<Event[]>([]); // All company events for sidebar
  const [joinedEventIds, setJoinedEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<number | "">("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Event | null>(null);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleJoinEvent = async (eventId: string) => {
    if (!currentEmployeeId || !companyId) return;
    
    try {
      // Remove 'event-' prefix if present for API call
      const numericId = eventId.replace('event-', '');
      const success = await joinEvent(parseInt(numericId), currentEmployeeId);
      if (success) {
        // Add to joined events (eventId already has 'event-' prefix from allEvents)
        setJoinedEventIds(prev => new Set(prev).add(eventId));
        
        // Refetch all events to get updated attendee counts
        const allEventsData = await fetchCompanyEvents(companyId);
        const transformedAllEvents: Event[] = (allEventsData || []).map((event: any) => ({
          id: `event-${event.id}`,
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6',
          capacity: event.capacity,
          currentAttendees: event.currentAttendees,
          isFull: event.isFull,
          description: event.description,
          location: event.location
        }));
        setAllEvents(transformedAllEvents);
        
        // Add event to calendar with updated data
        const eventToAdd = transformedAllEvents.find(e => e.id === eventId);
        if (eventToAdd) {
          setCalendarEvents(prev => [...prev, eventToAdd]);
        }
        
        // Update selected event if it's the one being joined
        if (selectedEvent && selectedEvent.id === eventId && eventToAdd) {
          setSelectedEvent(eventToAdd);
        }
      }
    } catch (err) {
      console.error('Failed to join event:', err);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!currentEmployeeId || !companyId) return;
    
    try {
      // Remove 'event-' prefix if present
      const numericId = eventId.replace('event-', '');
      const success = await leaveEvent(parseInt(numericId), currentEmployeeId);
      if (success) {
        // Remove from joined events
        setJoinedEventIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        
        // Refetch all events to get updated attendee counts
        const allEventsData = await fetchCompanyEvents(companyId);
        const transformedAllEvents: Event[] = (allEventsData || []).map((event: any) => ({
          id: `event-${event.id}`,
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6',
          capacity: event.capacity,
          currentAttendees: event.currentAttendees,
          isFull: event.isFull,
          description: event.description,
          location: event.location
        }));
        setAllEvents(transformedAllEvents);
        
        // Remove event from calendar
        setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
        
        // Close modal if the event being left is currently selected
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(null);
        }
      }
    } catch (err) {
      console.error('Failed to leave event:', err);
    }
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!currentEmployeeId || !selectedEvent) return;

    try {
      const numericId = selectedEvent.id.replace('event-', '');
      await submitReview(parseInt(numericId), currentEmployeeId, rating, content);
      setShowReviewModal(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        
        // Get logged in user from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('Please log in to view events');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        setCurrentEmployeeId(user.id);
        
        // Fetch employee details to get companyId
        const employeeData = await fetchEmployeeDetails(user.id);
        
        if (!employeeData || !employeeData.companyId) {
          setError('Invalid employee data');
          setLoading(false);
          return;
        }
        
        // Fetch all company events for sidebar
        const allEventsData = await fetchCompanyEvents(employeeData.companyId);
        
        // Fetch events the employee has joined for calendar
        const joinedEventsData = await fetchJoinedEvents(user.id);

        // Fetch rooms and timeslots for booking
        const [roomsData, timeslotsData, employeeReservationsData, companyReservationsData] = await Promise.all([
          fetchRooms(employeeData.companyId),
          fetchTimeslots(),
          fetchEmployeeReservations(user.id, employeeData.companyId),
          fetchCompanyReservations(employeeData.companyId)
        ]);
        
        // Store all company reservations for availability checking
        setAllReservations(companyReservationsData);
        setCompanyId(employeeData.companyId ?? null);
        
        // Transform all events with capacity info
        const transformedAllEvents: Event[] = (allEventsData || []).map((event: any) => ({
          id: `event-${event.id}`,
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6',
          capacity: event.capacity,
          currentAttendees: event.currentAttendees,
          isFull: event.isFull,
          description: event.description,
          location: event.location
        }));
        
        // Transform joined events
        const transformedJoinedEvents: Event[] = (joinedEventsData || []).map((event: any) => ({
          id: `event-${event.id}`,
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6',
          description: event.description,
          location: event.location,
          capacity: event.capacity,
          currentAttendees: event.currentAttendees,
          isFull: event.isFull
        }));
        
        // Transform reservations into events
        const transformedReservations: Event[] = (employeeReservationsData || []).map((reservation: any) => {
          const timeslot = timeslotsData.find(t => t.id === reservation.timeslotId);
          const room = roomsData.find(r => r.id === reservation.roomId);
          
          if (!timeslot) return null;
          
          const startDate = new Date(reservation.date);
          const startTime = new Date(timeslot.startTime || startDate);
          const endTime = new Date(timeslot.endTime || startDate);
          
          startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          
          return {
            id: `reservation-${reservation.id}`,
            title: room?.name ? `Booked: ${room.name}` : 'Booked Room',
            start: startDate,
            end: endDate,
            color: '#10b981', // green for bookings
            reservationId: reservation.id,
            roomName: room?.name || 'Unknown Room',
            roomId: reservation.roomId,
            timeslotId: reservation.timeslotId
          };
        }).filter(Boolean) as Event[];
        
        // Track which events are joined
        const joinedIds = new Set(transformedJoinedEvents.map(e => e.id));
        
        setAllEvents(transformedAllEvents);
        // Combine events and reservations for calendar display
        setCalendarEvents([...transformedJoinedEvents, ...transformedReservations]);
        setJoinedEventIds(joinedIds);
        setRooms(roomsData);
        setTimeslots(timeslotsData);
        if (timeslotsData.length && selectedTimeslotId === "") {
          setSelectedTimeslotId(timeslotsData[0].id ?? "");
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Periodically refresh company reservations so availability updates when others book
  useEffect(() => {
    if (!companyId) return;
    let isMounted = true;

    const load = async () => {
      const data = await fetchCompanyReservations(companyId);
      if (isMounted) setAllReservations(data);
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [companyId]);

  const refreshCompanyReservations = async (companyIdValue: number) => {
    try {
      const data = await fetchCompanyReservations(companyIdValue);
      setAllReservations(data);
    } catch (err) {
      console.error('Failed to refresh reservations:', err);
    }
  };

  const handleCancelReservation = async () => {
    if (!currentEmployeeId || !selectedBooking?.reservationId) return;

    // Check if reservation is more than 24 hours away
    const hoursUntilReservation = (selectedBooking.start.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilReservation < 24) {
      alert('Reservations can only be cancelled more than 24 hours in advance');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const api = new Api({ baseUrl: API_BASE_URL });
      const response = await api.api.reservationDelete(
        selectedBooking.reservationId,
        { employeeId: currentEmployeeId }
      );

      if (response.ok) {
        // Remove from calendar
        setCalendarEvents(prev => prev.filter(e => e.id !== selectedBooking.id));
        // Remove from all reservations
        setAllReservations(prev => prev.filter(r => r.id !== selectedBooking.reservationId));
        setSelectedBooking(null);
        alert('Reservation cancelled successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to cancel reservation');
      }
    } catch (err: any) {
      console.error('Cancel reservation error:', err);
      alert(err?.message || 'Failed to cancel reservation');
    }
  };

  const formatTime = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <main className="calendar-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading events...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="calendar-container">
        <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="calendar-container">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <CalendarDisplay 
          events={calendarEvents}
          timeslots={timeslots}
          onSlotSelect={({ date, timeslotId }) => {
            setBookingDate(date);
            if (timeslotId !== undefined) {
              setSelectedTimeslotId(timeslotId);
            }
          }}
          onEventClick={(event) => {
            // Only show modal for reservations
            if (event.id.startsWith('reservation-')) {
              setSelectedBooking(event);
            } 
            // Show event detail panel for joined events
            else if (event.id.startsWith('event-')) {
              setSelectedEvent(event);
            }
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '360px' }}>
          <ActivitySidebar 
            events={allEvents} 
            joinedEventIds={joinedEventIds}
            onJoinEvent={handleJoinEvent}
            onLeaveEvent={handleLeaveEvent}
          />
          <ReservationPanel
            currentEmployeeId={currentEmployeeId}
            rooms={rooms}
            timeslots={timeslots}
            selectedRoomId={selectedRoomId}
            selectedTimeslotId={selectedTimeslotId}
            bookingDate={bookingDate}
            allReservations={allReservations}
            companyId={companyId}
            onRoomSelect={setSelectedRoomId}
            onTimeslotSelect={setSelectedTimeslotId}
            onDateChange={setBookingDate}
            onBookingSuccess={(reservation, event) => {
              setCalendarEvents(prev => [...prev, event]);
              setAllReservations(prev => [...prev, reservation]);
              if (companyId) {
                refreshCompanyReservations(companyId);
              }
            }}
            onCalendarEventsUpdate={setCalendarEvents}
          />
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content booking-card" onClick={(e) => e.stopPropagation()}>
            <div className="booking-header">
              <h3>Booking Details</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="booking-details">
              <div className="detail-row">
                <span className="detail-label">Room:</span>
                <span className="detail-value">{selectedBooking.roomName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {selectedBooking.start.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">
                  {formatTime(selectedBooking.start.toISOString())} - {formatTime(selectedBooking.end.toISOString())}
                </span>
              </div>
              <div className="form-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="booking-button"
                  style={{
                    background: ((selectedBooking.start.getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 24 ? '#cbd5e0' : '#ef4444',
                    cursor: ((selectedBooking.start.getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 24 ? 'not-allowed' : 'pointer'
                  }}
                  disabled={((selectedBooking.start.getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 24}
                  onClick={handleCancelReservation}
                >
                  {((selectedBooking.start.getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 24 
                    ? 'Cannot cancel (less than 24h)' 
                    : 'Cancel Reservation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Panel */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content booking-card" onClick={(e) => e.stopPropagation()}>
            <div className="booking-header">
              <h3>{selectedEvent.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="booking-details">
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {selectedEvent.start.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">
                  {formatTime(selectedEvent.start.toISOString())} - {formatTime(selectedEvent.end.toISOString())}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.description && (
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedEvent.description}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Attendance:</span>
                <span className="detail-value">
                  {selectedEvent.currentAttendees || 0} / {selectedEvent.capacity || 'Unlimited'} attendees
                  {selectedEvent.isFull && <span style={{ color: '#c53030', fontWeight: 'bold' }}> (Full)</span>}
                </span>
              </div>
              <div className="form-actions" style={{ marginTop: '16px' }}>
                {new Date() > selectedEvent.end && (
                  <button
                    type="button"
                    className="booking-button"
                    style={{
                      background: '#8b5cf6'
                    }}
                    onClick={() => setShowReviewModal(true)}
                  >
                    Leave a Review
                  </button>
                )}
                <button
                  type="button"
                  className="booking-button"
                  style={{
                    background: '#ef4444'
                  }}
                  onClick={async () => {
                    await handleLeaveEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                >
                  Leave Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedEvent && currentEmployeeId && (
        <ReviewModal
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          employeeId={currentEmployeeId}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </main>
  );
};

export default Calendar;
