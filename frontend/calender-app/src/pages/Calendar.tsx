import React, { useState, useEffect } from "react";
import "../styles/Calendar.css";
import CalendarDisplay from "../components/CalenderDisplay";
import ActivitySidebar from "../components/ActivitySidebar";
import { Api } from "../CalendarApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  location?: string;
  description?: string;
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

const Calendar: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]); // Events shown in calendar (joined only)
  const [allEvents, setAllEvents] = useState<Event[]>([]); // All company events for sidebar
  const [joinedEventIds, setJoinedEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);

  const handleDayClick = (date: Date | null) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
        
        // Increment EventsAttended stat
        try {
          await fetch(`http://localhost:5000/api/Employee/increment/${currentEmployeeId}/EventsAttended`, {
            method: 'POST'
          });
        } catch (statErr) {
          console.error('Failed to increment EventsAttended stat:', statErr);
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
        
        // Decrement EventsAttended stat
        try {
          await fetch(`http://localhost:5000/api/Employee/decrement/${currentEmployeeId}/EventsAttended`, {
            method: 'POST'
          });
        } catch (statErr) {
          console.error('Failed to decrement EventsAttended stat:', statErr);
        }
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
          color: '#3b82f6',
          location: event.location,
          description: event.description,
          capacity: event.capacity,
          currentAttendees: allEventsData?.find((e: any) => e.id === event.id)?.currentAttendees
        }));
        
        // Track which events are joined
        const joinedIds = new Set(transformedJoinedEvents.map(e => e.id));
        
        setAllEvents(transformedAllEvents);
        setCalendarEvents(transformedJoinedEvents);
        setJoinedEventIds(joinedIds);
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
      <div style={{ display: 'flex' }}>
        <CalendarDisplay events={calendarEvents} />
        <ActivitySidebar 
          events={allEvents} 
          joinedEventIds={joinedEventIds}
          onJoinEvent={handleJoinEvent}
          onLeaveEvent={handleLeaveEvent}
        />
      </div>
    </main>
  );
};

export default Calendar;
