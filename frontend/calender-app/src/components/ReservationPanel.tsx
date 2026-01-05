import React, { useState } from "react";
import { Api, Room, Timeslot } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  reservationId?: number;
  roomName?: string;
  roomId?: number;
  timeslotId?: number;
}

interface ReservationPanelProps {
  currentEmployeeId: number | null;
  rooms: Room[];
  timeslots: Timeslot[];
  selectedRoomId: number | "";
  selectedTimeslotId: number | "";
  bookingDate: Date | null;
  allReservations: any[];
  companyId: number | null;
  onRoomSelect: (roomId: number | "") => void;
  onTimeslotSelect: (timeslotId: number | "") => void;
  onDateChange: (date: Date | null) => void;
  onBookingSuccess: (reservation: any, event: Event) => void;
  onCalendarEventsUpdate: (events: Event[]) => void;
}

const ReservationPanel: React.FC<ReservationPanelProps> = ({
  currentEmployeeId,
  rooms,
  timeslots,
  selectedRoomId,
  selectedTimeslotId,
  bookingDate,
  allReservations,
  companyId,
  onRoomSelect,
  onTimeslotSelect,
  onDateChange,
  onBookingSuccess,
  onCalendarEventsUpdate
}) => {
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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
    if (!bookingDate) return timeslots;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() !== today.getTime()) {
      return timeslots;
    }
    
    const now = new Date();
    return timeslots.filter(slot => {
      if (!slot.endTime) return true;
      const endTime = new Date(slot.endTime);
      return endTime > now;
    });
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
      
      const localDate = new Date(bookingDate);
      localDate.setHours(12, 0, 0, 0);
      
      const body = {
        date: localDate.toISOString(),
        roomId: Number(selectedRoomId),
        timeslotId: Number(selectedTimeslotId)
      };

      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const responseText = await response.text();

      if (response.ok) {
        const reservation = JSON.parse(responseText);
        
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
          
          onBookingSuccess(reservation, newEvent);
        }
        
        setBookingStatus('Room booked successfully!');
        onRoomSelect("");
        onTimeslotSelect("");
      } else {
        try {
          const errorData = JSON.parse(responseText);
          setBookingError(errorData?.message || 'Booking failed.');
        } catch {
          setBookingError(`Booking failed: ${responseText || response.statusText}`);
        }
      }
    } catch (err: any) {
      setBookingError(err?.message ?? 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
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
                onDateChange(new Date(e.target.value + 'T00:00:00'));
              } else {
                onDateChange(null);
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
              onTimeslotSelect(value === "" ? "" : Number(value));
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
                      onRoomSelect(room.id ?? "");
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
  );
};

export default ReservationPanel;
