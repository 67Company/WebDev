import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminPanel.css';
import '../styles/Cards.css';
import { Event, EventDTO, EmployeeDTO, Company } from '../CalendarApi';
import { createApiClient, createAdminApiClient } from '../services/apiService';

// API Helper Functions
async function getAllCompanies() {
  const api = createApiClient();
  const response = await api.api.companyList();
  return response;
}

async function getAllEvents(companyId: number) {
  const api = createApiClient();
  const response = await api.api.eventList({ companyId });
  return response;
}

async function getEventAttendees(eventId: number) {
  const api = createApiClient();
  const response = await api.api.eventAttendeesList(eventId);
  return response;
}

async function createEvent(eventData: EventDTO) {
  const api = createAdminApiClient();
  const response = await api.api.eventCreate(eventData);
  return response;
}

async function updateEvent(eventId: number, eventData: EventDTO) {
  const api = createAdminApiClient();
  const response = await api.api.eventUpdate(eventId, eventData);
  return response;
}

async function deleteEvent(eventId: number) {
  const api = createAdminApiClient();
  const response = await api.api.eventDelete(eventId);
  return response;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  companyId: number;
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingAttendees, setViewingAttendees] = useState<{ eventId: number; title: string } | null>(null);
  const [attendees, setAttendees] = useState<EmployeeDTO[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0,
    companyId: 0
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const companyId = user.companyId || 1;

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchCompanies();
    fetchEvents();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      if (response.ok && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents(companyId);
      if (response.ok && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async (eventId: number) => {
    try {
      const response = await getEventAttendees(eventId);
      if (response.ok && response.data) {
        setAttendees(response.data);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'capacity' || name === 'companyId') ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData: EventDTO = {
        ...formData
      };
      
      const response = await createEvent(eventData);

      if (response.ok) {
        showNotification('Event created successfully!', 'success');
        setShowCreateForm(false);
        resetForm();
        fetchEvents();
      } else {
        showNotification('Failed to create event', 'error');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showNotification('Error creating event', 'error');
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const eventData: EventDTO = {
        ...formData
      };
      
      const response = await updateEvent(editingEvent.id!, eventData);

      if (response.ok) {
        showNotification('Event updated successfully!', 'success');
        setEditingEvent(null);
        resetForm();
        fetchEvents();
      } else {
        showNotification('Failed to update event', 'error');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      showNotification('Error updating event', 'error');
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      const response = await deleteEvent(event.id!);

      if (response.ok) {
        showNotification('Event deleted successfully!', 'success');
        setDeleteConfirm(null);
        fetchEvents();
      } else {
        showNotification('Failed to delete event', 'error');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      showNotification('Error deleting event', 'error');
    }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date?.split('T')[0] || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      capacity: event.capacity || 0,
      companyId: event.companyId || 0
    });
    setShowCreateForm(false);
  };

  const viewAttendees = (event: Event) => {
    setViewingAttendees({ eventId: event.id!, title: event.title || '' });
    fetchAttendees(event.id!);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: 0,
      companyId: 0
    });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    resetForm();
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <main className="App-main">
        <div className="overview-card">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="App-main">
      <section className="overview-card admin-container">
        <div className="admin-header">
          {!showCreateForm && !editingEvent && (
            <Link to="/admin">
              <button className="btn-secondary">← Back</button>
            </Link>
          )}
          <h2>📅 Event Management</h2>
          {!showCreateForm && !editingEvent && (
            <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
              Create New Event
            </button>
          )}
        </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="event-form-container">
          <div className="form-header">
            <h2>Create New Event</h2>
            <button className="btn-close" onClick={cancelCreate}>×</button>
          </div>
          <form onSubmit={handleCreateEvent} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyId">Company</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={cancelCreate}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Event Form */}
      {editingEvent && (
        <div className="event-form-container">
          <div className="form-header">
            <h2>Edit Event: {editingEvent.title}</h2>
            <button className="btn-close" onClick={cancelEdit}>×</button>
          </div>
          <form onSubmit={handleUpdateEvent} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyId">Company</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      {!showCreateForm && !editingEvent && (
        <div className="events-table-container">
          <h2>All Events</h2>
          <table className="events-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-events">No events found</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.title}</td>
                    <td className="description-cell">{event.description}</td>
                    <td>{event.date ? new Date(event.date).toLocaleDateString() : ''}</td>
                    <td>{event.startTime ? new Date(event.startTime).toLocaleTimeString() : ''}</td>
                    <td>{event.endTime ? new Date(event.endTime).toLocaleTimeString() : ''}</td>
                    <td>{event.location}</td>
                    <td>{event.capacity}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => viewAttendees(event)}
                          title="View Attendees"
                        >
                          👥
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => startEdit(event)}
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setDeleteConfirm(event)}
                          title="Delete Event"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the event "{deleteConfirm.title}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDeleteEvent(deleteConfirm)}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {viewingAttendees && (
        <div className="modal-overlay" onClick={() => setViewingAttendees(null)}>
          <div className="modal-content attendees-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Attendees for: {viewingAttendees.title}</h2>
              <button className="btn-close" onClick={() => setViewingAttendees(null)}>×</button>
            </div>
            <div className="attendees-list">
              {attendees.length === 0 ? (
                <p className="no-attendees">No attendees registered yet</p>
              ) : (
                <table className="attendees-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map(attendee => (
                      <tr key={attendee.id}>
                        <td>{attendee.id}</td>
                        <td>{attendee.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setViewingAttendees(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      </section>
    </main>
  );
};

export default AdminEvents;
