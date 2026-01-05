import React, { useState, useEffect } from "react";
import { Api, Timeslot as ApiTimeslot, Room as ApiRoom } from "../CalendarApi";
import "../styles/OfficeAttendance.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const API_BASE_URL = "http://localhost:5000";

interface AttendanceRecord {
  id: number;
  date: string;
  room?: ApiRoom;
  timeslot?: ApiTimeslot;
  employee?: {
    id: number;
    email: string;
  };
}

interface BookingRequest {
  employeeId: number;
  date: string;
  roomId: number;
  timeslotId: number;
  companyId: number;
}

const OfficeAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [timeslots, setTimeslots] = useState<ApiTimeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | string>("");
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<number | string>("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const handleExpandClick = (recordId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  // Fetch user's attendance records
  const fetchAttendanceRecords = async (employeeId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/OfficeAttendance/my-attendance/${employeeId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
      } else {
        throw new Error("Failed to fetch attendance records");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to load attendance records");
    }
  };

  // Fetch available rooms
  const fetchRooms = async (companyId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Room/company/${companyId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRooms(data || []);
      } else {
        throw new Error("Failed to fetch rooms");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms");
    }
  };

  // Fetch available timeslots
  const fetchTimeslots = async () => {
    try {
      const api = new Api({ baseUrl: API_BASE_URL });
      const response = await api.api.timeslotList();
      const timeslotData = response.data || [];
      setTimeslots(timeslotData.filter((t): t is ApiTimeslot => t.id !== undefined));
    } catch (err) {
      console.error("Error fetching timeslots:", err);
      setError("Failed to load timeslots");
    }
  };

  // Book office attendance
  const handleBookAttendance = async () => {
    if (!currentEmployeeId || !companyId || !selectedDate || !selectedRoomId || !selectedTimeslotId) {
      setError("Please fill in all fields");
      return;
    }

    const bookingRequest: BookingRequest = {
      employeeId: currentEmployeeId,
      date: selectedDate.toISOString(),
      roomId: Number(selectedRoomId),
      timeslotId: Number(selectedTimeslotId),
      companyId: companyId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/OfficeAttendance/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingRequest),
      });

      if (response.ok) {
        setSuccess("Office attendance registered successfully!");
        setError(null);
        setOpenDialog(false);
        // Reset form
        setSelectedDate(null);
        setSelectedRoomId("");
        setSelectedTimeslotId("");
        // Refresh attendance records
        await fetchAttendanceRecords(currentEmployeeId);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to register attendance");
        setSuccess(null);
      }
    } catch (err) {
      console.error("Error booking attendance:", err);
      setError("Failed to register attendance");
      setSuccess(null);
    }
  };

  // Cancel attendance
  const handleCancelAttendance = async (attendanceId: number) => {
    if (!currentEmployeeId) return;

    if (!window.confirm("Are you sure you want to cancel this office attendance?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/OfficeAttendance/${attendanceId}/employee/${currentEmployeeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setSuccess("Office attendance cancelled successfully!");
        setError(null);
        // Refresh attendance records
        await fetchAttendanceRecords(currentEmployeeId);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to cancel attendance");
        setSuccess(null);
      }
    } catch (err) {
      console.error("Error cancelling attendance:", err);
      setError("Failed to cancel attendance");
      setSuccess(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "";
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get logged in user from localStorage
        const userString = localStorage.getItem("user");
        if (!userString) {
          setError("Please log in to view office attendance");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        setCurrentEmployeeId(user.id);

        // Fetch employee details to get companyId
        const api = new Api({ baseUrl: API_BASE_URL });
        const employeeData = await api.api.authMeDetail(user.id);

        if (!employeeData.data || !employeeData.data.companyId) {
          setError("Invalid employee data");
          setLoading(false);
          return;
        }

        const empCompanyId = employeeData.data.companyId;
        setCompanyId(empCompanyId);

        // Load all data in parallel
        await Promise.all([
          fetchAttendanceRecords(user.id),
          fetchRooms(empCompanyId),
          fetchTimeslots(),
        ]);

        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-dismiss success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <main className="office-attendance-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading office attendance...
        </div>
      </main>
    );
  }

  return (
    <main className="office-attendance-container">
      <div className="attendance-header">
        <h1>Office Attendance</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          className="book-button"
        >
          Register Attendance
        </Button>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <div className="attendance-content">
        <Typography variant="h5" gutterBottom>
          My Registered Attendance
        </Typography>

        {attendanceRecords.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary">
                No office attendance registered yet. Click "Register Attendance" to add your office days.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {attendanceRecords.map((record) => {
              const isExpanded = expandedCards.has(record.id);
              return (
                <Grid size={{ xs: 12 }} key={record.id}>
                  <Card className="attendance-card">
                    <CardContent className="attendance-card-content">
                      <Box className="attendance-card-header" onClick={() => handleExpandClick(record.id)}>
                        <Typography variant="subtitle1" className="attendance-date">
                          {formatDate(record.date)}
                        </Typography>
                        <IconButton
                          className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                          size="small"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </Box>
                      
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box className="attendance-details">
                          {record.timeslot && record.timeslot.startTime && record.timeslot.endTime && (
                            <Typography variant="body2" className="detail-item">
                              <strong>Time:</strong> {formatTime(record.timeslot.startTime)} - {formatTime(record.timeslot.endTime)}
                            </Typography>
                          )}
                          {record.room && record.room.name && (
                            <Typography variant="body2" className="detail-item">
                              <strong>Area:</strong> {record.room.name}
                            </Typography>
                          )}
                          <Box mt={2}>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              fullWidth
                              onClick={() => handleCancelAttendance(record.id)}
                            >
                              Cancel Attendance
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>

      {/* Book Attendance Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register Office Attendance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel id="timeslot-label">Select Time Slot</InputLabel>
              <Select
                labelId="timeslot-label"
                value={selectedTimeslotId}
                label="Select Time Slot"
                onChange={(e) => setSelectedTimeslotId(e.target.value)}
              >
                {timeslots.map((timeslot) => (
                  <MenuItem key={timeslot.id} value={timeslot.id}>
                    {formatTime(timeslot.startTime)} - {formatTime(timeslot.endTime)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="room-label">Select Office Area (Optional)</InputLabel>
              <Select
                labelId="room-label"
                value={selectedRoomId}
                label="Select Office Area (Optional)"
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name} (Capacity: {room.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="caption" color="textSecondary">
              Register your office attendance to let your team know when you'll be in the office.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleBookAttendance} variant="contained" color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default OfficeAttendance;
