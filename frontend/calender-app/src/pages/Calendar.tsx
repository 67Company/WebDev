import React, { useState } from "react";
import "../styles/Calendar.css";
import CalendarDisplay from "../components/CalenderDisplay";
import ActivitySidebar from "../components/ActivitySidebar";
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

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const handleDayClick = (date: Date | null) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <main className="calendar-container">
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar onChange={handleDayClick} />
      </LocalizationProvider>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Selected Day</DialogTitle>
        <DialogContent>
          <Typography>
            You picked: {selectedDate?.toDateString() ?? "No date"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
      <div style={{ display: 'flex' }}>
        <CalendarDisplay />
        <ActivitySidebar events={[]} />
      </div>
    </main>
  );
};

export default Calendar;
