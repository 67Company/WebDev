import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminPanel.css';
import '../styles/Cards.css';
import { Achievement, AchievementDTO, Company } from '../CalendarApi';
import { createAdminApiClient, createApiClient } from '../services/apiService';

// Achievement API Helper Functions
async function getAllCompanies() {
  const api = createApiClient();
  const response = await api.api.companyList();
  return response;
}

async function getAllAchievements(companyId: number) {
  const api = createApiClient();
  const response = await api.api.achievementCompanyDetail(companyId);
  return response;
}

async function createAchievement(achievementData: AchievementDTO, companyId: number) {
  const api = createAdminApiClient();
  const response = await api.api.achievementCreate(achievementData, { companyId });
  return response;
}

async function updateAchievement(achievementId: number, achievementData: AchievementDTO) {
  const api = createAdminApiClient();
  const response = await api.api.achievementUpdate(achievementId, achievementData);
  return response;
}

async function deleteAchievement(achievementId: number) {
  const api = createAdminApiClient();
  const response = await api.api.achievementDelete(achievementId);
  return response;
}

interface AchievementFormData {
  title: string;
  description: string;
  icon: string;
  statToTrack: string;
  threshold: number;
  companyId: number;
}

const AdminAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCreateAchievementForm, setShowCreateAchievementForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [deleteAchievementConfirm, setDeleteAchievementConfirm] = useState<Achievement | null>(null);

  const [achievementFormData, setAchievementFormData] = useState<AchievementFormData>({
    title: '',
    description: '',
    icon: '',
    statToTrack: '',
    threshold: 0,
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
    fetchAchievements();
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

  const fetchAchievements = async () => {
    try {
      const response = await getAllAchievements(companyId);
      if (response.ok && response.data) {
        setAchievements(response.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAchievementInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAchievementFormData(prev => ({
      ...prev,
      [name]: (name === 'threshold' || name === 'companyId') ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createAchievement(achievementFormData, achievementFormData.companyId);
      if (response.ok) {
        showNotification('Achievement created successfully!', 'success');
        setShowCreateAchievementForm(false);
        resetAchievementForm();
        fetchAchievements();
      } else {
        showNotification('Failed to create achievement', 'error');
      }
    } catch (error) {
      console.error('Error creating achievement:', error);
      showNotification('Error creating achievement', 'error');
    }
  };

  const handleUpdateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;

    try {
      const response = await updateAchievement(editingAchievement.id!, achievementFormData);
      if (response.ok) {
        showNotification('Achievement updated successfully!', 'success');
        setEditingAchievement(null);
        resetAchievementForm();
        fetchAchievements();
      } else {
        showNotification('Failed to update achievement', 'error');
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
      showNotification('Error updating achievement', 'error');
    }
  };

  const handleDeleteAchievement = async (achievement: Achievement) => {
    try {
      const response = await deleteAchievement(achievement.id!);
      if (response.ok) {
        showNotification('Achievement deleted successfully!', 'success');
        setDeleteAchievementConfirm(null);
        fetchAchievements();
      } else {
        showNotification('Failed to delete achievement', 'error');
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      showNotification('Error deleting achievement', 'error');
    }
  };

  const startEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementFormData({
      title: achievement.title || '',
      description: achievement.description || '',
      icon: achievement.icon || '',
      statToTrack: achievement.statToTrack || '',
      threshold: achievement.threshold || 0,
      companyId: achievement.companyId || 0
    });
    setShowCreateAchievementForm(false);
  };

  const resetAchievementForm = () => {
    setAchievementFormData({
      title: '',
      description: '',
      icon: '',
      statToTrack: '',
      threshold: 0,
      companyId: 0
    });
  };

  const cancelEditAchievement = () => {
    setEditingAchievement(null);
    resetAchievementForm();
  };

  const cancelCreateAchievement = () => {
    setShowCreateAchievementForm(false);
    resetAchievementForm();
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
          {!showCreateAchievementForm && !editingAchievement && (
            <Link to="/admin">
              <button className="btn-secondary">← Back</button>
            </Link>
          )}
          <h2>🏆 Achievement Management</h2>
          {!showCreateAchievementForm && !editingAchievement && (
            <button className="btn-primary" onClick={() => setShowCreateAchievementForm(true)}>
              Create New Achievement
            </button>
          )}
        </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Create Achievement Form */}
      {showCreateAchievementForm && (
        <div className="event-form-container">
          <div className="form-header">
            <h2>Create New Achievement</h2>
            <button className="btn-close" onClick={cancelCreateAchievement}>×</button>
          </div>
          <form onSubmit={handleCreateAchievement} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={achievementFormData.title}
                onChange={handleAchievementInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={achievementFormData.description}
                onChange={handleAchievementInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyId">Company</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={achievementFormData.companyId}
                  onChange={handleAchievementInputChange}
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
                <label htmlFor="statToTrack">Stat to Track</label>
                <input
                  type="text"
                  id="statToTrack"
                  name="statToTrack"
                  value={achievementFormData.statToTrack}
                  onChange={handleAchievementInputChange}
                  list="statToTrackOptions"
                  placeholder="Select or type a stat to track"
                  required
                />
                <datalist id="statToTrackOptions">
                  <option value="meetingsAttended">Meetings Attended</option>
                  <option value="teamAmount">Team Amount</option>
                  <option value="totalMeetingTime">Total Meeting Time</option>
                  <option value="eventsAttended">Events Attended</option>
                  <option value="eventsOrganized">Events Organized</option>
                  <option value="roomsBooked">Rooms Booked</option>
                </datalist>
              </div>
              <div className="form-group">
                <label htmlFor="threshold">Threshold</label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={achievementFormData.threshold}
                  onChange={handleAchievementInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={cancelCreateAchievement}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Achievement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Achievement Form */}
      {editingAchievement && (
        <div className="event-form-container">
          <div className="form-header">
            <h2>Edit Achievement: {editingAchievement.title}</h2>
            <button className="btn-close" onClick={cancelEditAchievement}>×</button>
          </div>
          <form onSubmit={handleUpdateAchievement} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={achievementFormData.title}
                onChange={handleAchievementInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={achievementFormData.description}
                onChange={handleAchievementInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyId">Company</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={achievementFormData.companyId}
                  onChange={handleAchievementInputChange}
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
                <label htmlFor="statToTrack">Stat to Track</label>
                <input
                  type="text"
                  id="statToTrack"
                  name="statToTrack"
                  value={achievementFormData.statToTrack}
                  onChange={handleAchievementInputChange}
                  list="statToTrackOptionsEdit"
                  placeholder="Select or type a stat to track"
                  required
                />
                <datalist id="statToTrackOptionsEdit">
                  <option value="meetingsAttended">Meetings Attended</option>
                  <option value="teamAmount">Team Amount</option>
                  <option value="totalMeetingTime">Total Meeting Time</option>
                  <option value="eventsAttended">Events Attended</option>
                  <option value="eventsOrganized">Events Organized</option>
                  <option value="roomsBooked">Rooms Booked</option>
                </datalist>
              </div>
              <div className="form-group">
                <label htmlFor="threshold">Threshold</label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={achievementFormData.threshold}
                  onChange={handleAchievementInputChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={cancelEditAchievement}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Achievement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Achievements Table */}
      {!showCreateAchievementForm && !editingAchievement && (
        <div className="events-table-container">
          <h2>All Achievements</h2>
          <table className="events-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Stat to Track</th>
                <th>Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-events">No achievements found</td>
                </tr>
              ) : (
                achievements.map(achievement => (
                  <tr key={achievement.id}>
                    <td>{achievement.id}</td>
                    <td>{achievement.title}</td>
                    <td className="description-cell">{achievement.description}</td>
                    <td>{achievement.statToTrack}</td>
                    <td>{achievement.threshold}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => startEditAchievement(achievement)}
                          title="Edit Achievement"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setDeleteAchievementConfirm(achievement)}
                          title="Delete Achievement"
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

      {/* Delete Achievement Confirmation Modal */}
      {deleteAchievementConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteAchievementConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the achievement "{deleteAchievementConfirm.title}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteAchievementConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDeleteAchievement(deleteAchievementConfirm)}>
                Delete Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      </section>
    </main>
  );
};

export default AdminAchievements;
