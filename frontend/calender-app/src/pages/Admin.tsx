import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import '../styles/Admin.css';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  statToTrack: string;
  threshold: number;
  companyId: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  companyId: number;
}

interface Employee {
  id: number;
  email: string;
  admin: boolean;
  companyId: number;
  isDeleted: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'achievement' | 'event' | 'employee'>('achievement');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);

  // Achievement state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    icon: '',
    statToTrack: '',
    threshold: 0
  });

  // Event state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: 0
  });

  // Employee state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeForm, setEmployeeForm] = useState({
    email: '',
    password: '',
    admin: false
  });

  useEffect(() => {
    // Check if user is admin
    const userString = localStorage.getItem('user');
    if (!userString) {
      setError('Please log in to access admin panel');
      return;
    }

    const user = JSON.parse(userString);
    setIsAdmin(user.isAdmin || false);

    if (!user.isAdmin) {
      setError('Access denied. Admin privileges required.');
      return;
    }

    // Fetch full employee details to get companyId
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Auth/me/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const fetchedCompanyId = data.companyId;
          setCompanyId(fetchedCompanyId);
          // Load data after we have companyId, passing it directly
          loadAchievements(fetchedCompanyId);
          loadEvents(fetchedCompanyId);
          loadEmployees();
        }
      } catch (err) {
        console.error('Failed to fetch employee details:', err);
        setError('Failed to load user details');
      }
    };

    fetchEmployeeDetails();
  }, []);

  const loadAchievements = async (id?: number) => {
    const targetCompanyId = id || companyId;
    if (!targetCompanyId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/Achievement/company/${targetCompanyId}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
    }
  };

  const loadEvents = async (id?: number) => {
    const targetCompanyId = id || companyId;
    if (!targetCompanyId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/Event?companyId=${targetCompanyId}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Employee');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.filter((e: Employee) => !e.isDeleted));
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleOpenDialog = (type: 'achievement' | 'event' | 'employee') => {
    setDialogType(type);
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset forms
    setAchievementForm({ title: '', description: '', icon: '', statToTrack: '', threshold: 0 });
    setEventForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', capacity: 0 });
    setEmployeeForm({ email: '', password: '', admin: false });
  };

  const handleCreateAchievement = async () => {
    // Validation
    if (!achievementForm.title || !achievementForm.description || !achievementForm.statToTrack || achievementForm.threshold <= 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    if (!companyId) {
      setError('Company ID not available');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/Achievement?companyId=${companyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementForm)
      });

      if (response.ok) {
        setSuccess('Achievement created successfully!');
        loadAchievements();
        handleCloseDialog();
      } else {
        const errorText = await response.text();
        setError(`Failed to create achievement: ${errorText}`);
        console.error('Achievement creation failed:', errorText);
      }
    } catch (err) {
      setError(`Error creating achievement: ${err}`);
      console.error('Achievement creation error:', err);
    }
  };

  const handleCreateEvent = async () => {
    // Validation
    if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime || eventForm.capacity <= 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    if (!companyId) {
      setError('Company ID not available');
      return;
    }

    try {
      const startDateTime = new Date(`${eventForm.date}T${eventForm.startTime}`);
      const endDateTime = new Date(`${eventForm.date}T${eventForm.endTime}`);

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

      const response = await fetch('http://localhost:5000/api/Event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          date: startDateTime.toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          location: eventForm.location,
          capacity: eventForm.capacity,
          companyId
        })
      });

      if (response.ok) {
        setSuccess('Event created successfully!');
        loadEvents();
        handleCloseDialog();
      } else {
        const errorText = await response.text();
        setError(`Failed to create event: ${errorText}`);
        console.error('Event creation failed:', errorText);
      }
    } catch (err) {
      setError(`Error creating event: ${err}`);
      console.error('Event creation error:', err);
    }
  };

  const handleCreateEmployee = async () => {
    // Validation
    if (!employeeForm.email || !employeeForm.password) {
      setError('Email and password are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password strength validation
    if (employeeForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!companyId) {
      setError('Company ID not available');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/Employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: employeeForm.email,
          passwordHash: employeeForm.password,
          admin: employeeForm.admin,
          companyId: companyId,
          meetingsAttended: 0,
          largestTeamSize: 0,
          totalMeetingTime: 0,
          eventsAttended: 0,
          eventsOrganized: 0,
          roomsBooked: 0,
          isDeleted: false
        })
      });

      if (response.ok) {
        setSuccess('Employee created successfully!');
        loadEmployees();
        handleCloseDialog();
      } else {
        const errorText = await response.text();
        setError(`Failed to create employee: ${errorText}`);
        console.error('Employee creation failed:', errorText);
      }
    } catch (err) {
      setError(`Error creating employee: ${err}`);
      console.error('Employee creation error:', err);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/Employee/soft/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Employee deleted successfully!');
        loadEmployees();
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      setError('Error deleting employee');
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-container">
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}

      <Paper sx={{ width: '100%', mt: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Achievements" />
          <Tab label="Events" />
          <Tab label="Employees" />
        </Tabs>

        {/* Achievements Tab */}
        <TabPanel value={currentTab} index={0}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('achievement')}
            sx={{ mb: 2 }}
          >
            Create Achievement
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Stat</TableCell>
                  <TableCell>Threshold</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell>{achievement.title}</TableCell>
                    <TableCell>{achievement.description}</TableCell>
                    <TableCell>{achievement.statToTrack}</TableCell>
                    <TableCell>{achievement.threshold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={currentTab} index={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('event')}
            sx={{ mb: 2 }}
          >
            Create Event
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Capacity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Employees Tab */}
        <TabPanel value={currentTab} index={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('employee')}
            sx={{ mb: 2 }}
          >
            Create Employee
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.admin ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteEmployee(employee.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Create Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create {dialogType === 'achievement' ? 'Achievement' : dialogType === 'event' ? 'Event' : 'Employee'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'achievement' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={achievementForm.description}
                onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Icon URL"
                value={achievementForm.icon}
                onChange={(e) => setAchievementForm({ ...achievementForm, icon: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Stat to Track</InputLabel>
                <Select
                  value={achievementForm.statToTrack}
                  onChange={(e) => setAchievementForm({ ...achievementForm, statToTrack: e.target.value })}
                >
                  <MenuItem value="MeetingsAttended">Meetings Attended</MenuItem>
                  <MenuItem value="RoomsBooked">Rooms Booked</MenuItem>
                  <MenuItem value="EventsOrganized">Events Organized</MenuItem>
                  <MenuItem value="LargestTeamSize">Largest Team Size</MenuItem>
                  <MenuItem value="TotalMeetingTime">Total Meeting Time</MenuItem>
                  <MenuItem value="EventsAttended">Events Attended</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Threshold"
                type="number"
                value={achievementForm.threshold}
                onChange={(e) => setAchievementForm({ ...achievementForm, threshold: parseInt(e.target.value) })}
                fullWidth
              />
            </Box>
          )}

          {dialogType === 'event' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Date"
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Start Time"
                type="time"
                value={eventForm.startTime}
                onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Time"
                type="time"
                value={eventForm.endTime}
                onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                fullWidth
              />
              <TextField
                label="Capacity"
                type="number"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) })}
                fullWidth
              />
            </Box>
          )}

          {dialogType === 'employee' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Email"
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={employeeForm.password}
                onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Admin</InputLabel>
                <Select
                  value={employeeForm.admin}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, admin: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              if (dialogType === 'achievement') handleCreateAchievement();
              else if (dialogType === 'event') handleCreateEvent();
              else handleCreateEmployee();
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Admin;
