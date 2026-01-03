import React, { useState, useEffect } from "react";
import "../styles/Calendar.css";
import CalendarDisplay from "../components/CalenderDisplay";
import ActivitySidebar from "../components/ActivitySidebar";
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
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Event | null>(null);
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const handleJoinEvent = async (eventId: string) => {
    if (!currentEmployeeId) return;
    
    try {
      const success = await joinEvent(parseInt(eventId), currentEmployeeId);
      if (success) {
        // Add to joined events
        setJoinedEventIds(prev => new Set(prev).add(eventId));
        
        // Add event to calendar
        const eventToAdd = allEvents.find(e => e.id === eventId);
        if (eventToAdd) {
          setCalendarEvents(prev => [...prev, eventToAdd]);
        }
      }
    } catch (err) {
      console.error('Failed to join event:', err);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!currentEmployeeId) return;
    
    try {
      const success = await leaveEvent(parseInt(eventId), currentEmployeeId);
      if (success) {
        // Remove from joined events
        setJoinedEventIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        
        // Remove event from calendar
        setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
      }
    } catch (err) {
      console.error('Failed to leave event:', err);
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
          id: event.id?.toString() || '',
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6',
          capacity: event.capacity,
          currentAttendees: event.currentAttendees,
          isFull: event.isFull
        }));
        
        // Transform joined events
        const transformedJoinedEvents: Event[] = (joinedEventsData || []).map((event: any) => ({
          id: event.id?.toString() || '',
          title: event.title || 'Untitled Event',
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          color: '#3b82f6'
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

  const handleBookRoom = async () => {
    if (!currentEmployeeId) {
      setBookingError('Please log in first.');
      return;
    }
    if (!bookingDate || selectedRoomId === "" || selectedTimeslotId === "") {
      setBookingError('Select a date, timeslot, and room.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingStatus(null);

    try {
      const bookingUrl = `${API_BASE_URL}/api/Reservation/book?employeeId=${currentEmployeeId}`;
      
      // Create a date string in local timezone to avoid date shifting
      const localDate = new Date(bookingDate);
      localDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      const body = {
        date: localDate.toISOString(),
        roomId: Number(selectedRoomId),
        timeslotId: Number(selectedTimeslotId)
      };

      console.log('Booking request:', { url: bookingUrl, body });

      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.ok) {
        const reservation = JSON.parse(responseText);
        
        // Find room and timeslot info to create the event
        const room = rooms.find(r => r.id === reservation.roomId);
        const timeslot = timeslots.find(t => t.id === reservation.timeslotId);
        
        if (timeslot) {
          const startDate = new Date(reservation.date);
          const startTime = new Date(timeslot.startTime || startDate);
          const endTime = new Date(timeslot.endTime || startDate);
          
          startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          const endDate = new Date(startDate);
          endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          
          const newEvent: Event = {
            id: `reservation-${reservation.id}`,
            title: room?.name ? `Booked: ${room.name}` : 'Booked Room',
            start: startDate,
            end: endDate,
            color: '#10b981',
            reservationId: reservation.id,
            roomName: room?.name || 'Unknown Room',
            roomId: reservation.roomId,
            timeslotId: reservation.timeslotId
          };
          
          // Add to calendar immediately
          setCalendarEvents(prev => [...prev, newEvent]);
          
          // Update all reservations to reflect new booking
          setAllReservations(prev => [...prev, reservation]);
          if (companyId) {
            refreshCompanyReservations(companyId);
          }
        }
        
        setBookingStatus('Room booked successfully!');
        setSelectedRoomId("");
        setSelectedTimeslotId("");
      } else {
        try {
          const errorData = JSON.parse(responseText);
          setBookingError(errorData?.message || 'Booking failed.');
          console.error('Booking error:', errorData);
        } catch {
          setBookingError(`Booking failed: ${responseText || response.statusText}`);
          console.error('Booking error (non-JSON):', responseText);
        }
      }
    } catch (err: any) {
      const message = err?.message ?? 'Booking failed.';
      setBookingError(message);
      console.error('Booking exception:', err);
    } finally {
      setBookingLoading(false);
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

  const getRoomAvailability = (roomId: number) => {
    if (!bookingDate || selectedTimeslotId === "") return { available: true, count: 0 };
    
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Count bookings for this room on selected date and timeslot
    const bookingsForRoom = allReservations.filter(r => {
      const reservationDate = new Date(r.date);
      reservationDate.setHours(0, 0, 0, 0);
      
      return r.roomId === roomId && 
             r.timeslotId === selectedTimeslotId &&
             reservationDate.getTime() === selectedDate.getTime();
    });
    
    return { available: bookingsForRoom.length === 0, count: bookingsForRoom.length };
  };

  const getAvailableTimeslots = () => {
    // If no date selected or not today, return all timeslots
    if (!bookingDate) return timeslots;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    // If selected date is not today, return all timeslots
    if (selectedDate.getTime() !== today.getTime()) {
      return timeslots;
    }
    
    // If selected date is today, filter out timeslots that have already ended
    const now = new Date();
    return timeslots.filter(slot => {
      if (!slot.endTime) return true;
      
      const endTime = new Date(slot.endTime);
      // Compare end time with current time
      return endTime > now;
    });
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
            setBookingStatus(null);
            setBookingError(null);
          }}
          onEventClick={(event) => {
            // Only show modal for reservations
            if (event.id.startsWith('reservation-')) {
              setSelectedBooking(event);
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
          <div className="booking-card">
            <div className="booking-header">
              <h3>Book a room</h3>
            </div>
            <form className="booking-form">
              <div className="form-field">
                <label htmlFor="booking-date">Date</label>
                <input
                  id="booking-date"
                  type="date"
                  min={getLocalDateString(new Date())}
                  value={bookingDate ? getLocalDateString(bookingDate) : ''}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) => {
                    if (e.target.value) {
                      setBookingDate(new Date(e.target.value + 'T00:00:00'));
                    } else {
                      setBookingDate(null);
                    }
                  }}
                />
              </div>

              <div className="form-field">
                <label htmlFor="booking-timeslot">Timeslot</label>
                <select
                  id="booking-timeslot"
                  value={selectedTimeslotId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedTimeslotId(value === "" ? "" : Number(value));
                  }}
                >
                  <option value="" disabled>Select a timeslot</option>
                  {getAvailableTimeslots().map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Availability Overview */}
              {bookingDate && selectedTimeslotId !== "" && (
                <div className="room-availability-section">
                  <label className="availability-label">Room Availability</label>
                  <div className="room-list">
                    {rooms.map(room => {
                      const availability = getRoomAvailability(room.id ?? 0);
                      return (
                        <div 
                          key={room.id} 
                          className={`room-item ${availability.available ? 'available' : 'booked'} ${selectedRoomId === room.id ? 'selected' : ''}`}
                          onClick={() => {
                            if (!availability.available) return;
                            setSelectedRoomId(room.id ?? "");
                          }}
                          style={{ cursor: availability.available ? 'pointer' : 'not-allowed' }}
                        >
                          <div className="room-name">{room.name}</div>
                          <div className={`room-status ${availability.available ? 'status-available' : 'status-booked'}`}>
                            {availability.available ? '✓ Available' : '✗ Booked'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="booking-button"
                  disabled={bookingLoading}
                  onClick={handleBookRoom}
                >
                  {bookingLoading ? 'Booking...' : 'Book room'}
                </button>

                {bookingStatus && <div className="booking-status success">{bookingStatus}</div>}
                {bookingError && <div className="booking-status error">{bookingError}</div>}
              </div>
            </form>
          </div>
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
    </main>
  );
};

export default Calendar;
