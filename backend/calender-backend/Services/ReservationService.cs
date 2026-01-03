using calender_backend.Data;
using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

public class ReservationService : IReservationService
{
    private readonly CalenderContext _context;

    public ReservationService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(int companyId)
    {
        return await _context.Reservations.Where(r => r.CompanyId == companyId).ToListAsync();
    }

    public async Task<Reservation?> GetReservationByIdAsync(int id)
    {
        Reservation? reservation = await _context.Reservations.FindAsync(id);
        return reservation;
    }

    public async Task<bool> CreateReservationAsync(Reservation reservation)
    {
        var entry = await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();
        return entry != null;
    }

    public async Task<bool> UpdateReservationAsync(int id, Reservation updatedReservation)
    {
        updatedReservation.Id = id;
        bool isUpdated = _context.Reservations.Update(updatedReservation) != null;
        await _context.SaveChangesAsync();
        return isUpdated;
    }

    public async Task<bool> CancelReservationAsync(int roomId, int employeeId, DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        Reservation? reservation = await _context.Reservations.FirstOrDefaultAsync(r =>
            r.EmployeeId == employeeId &&
            r.RoomId == roomId &&
            r.Date >= dayStart && r.Date < dayEnd);
        if (reservation != null)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<(bool Success, string Message)> CancelReservationByIdAsync(int reservationId, int employeeId)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Timeslot)
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null)
            return (false, "Reservation not found");

        // Verify the employee owns this reservation
        if (reservation.EmployeeId != employeeId)
            return (false, "You can only cancel your own reservations");

        // Check if reservation is more than 24 hours away
        if (reservation.Timeslot == null)
            return (false, "Timeslot information not available");

        var reservationDateTime = reservation.Date.Date
            .AddHours(new DateTime(reservation.Timeslot.StartTime.Ticks).Hour)
            .AddMinutes(new DateTime(reservation.Timeslot.StartTime.Ticks).Minute);

        var hoursUntilReservation = (reservationDateTime - DateTime.Now).TotalHours;

        if (hoursUntilReservation < 24)
            return (false, "Reservations can only be cancelled more than 24 hours in advance");

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return (true, "Reservation cancelled successfully");
    }

    public async Task<IEnumerable<Reservation>> GetReservationsByEmployeeIdAsync(int employeeId, int companyId)
    {
        return await _context.Reservations.Where(r => r.EmployeeId == employeeId && r.CompanyId == companyId).ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetReservationsByRoomIdAsync(int roomId, int companyId)
    {
        return await _context.Reservations.Where(r => r.RoomId == roomId && r.CompanyId == companyId).ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetReservationsByDateAsync(DateTime date, int companyId)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);
        return await _context.Reservations
            .Where(r => r.Date >= dayStart && r.Date < dayEnd && r.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<(bool Success, string Message, Reservation? Reservation)> BookRoomForEmployeeAsync(int employeeId, BookReservationRequest request)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted);

        if (employee == null)
        {
            return (false, "Employee not found", null);
        }

        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == request.RoomId);

        if (room == null)
        {
            return (false, "Room not found", null);
        }

        if (room.CompanyId != employee.CompanyId)
        {
            return (false, "Room does not belong to the employee's company", null);
        }

        var timeslot = await _context.Timeslots.FirstOrDefaultAsync(t => t.Id == request.TimeslotId);

        if (timeslot == null)
        {
            return (false, "Timeslot not found", null);
        }

        var dayStart = request.Date.Date;
        var dayEnd = dayStart.AddDays(1);

        // If booking for today, check that timeslot hasn't ended
        var today = DateTime.Today;
        if (dayStart == today)
        {
            var now = DateTime.Now;
            if (timeslot.EndTime < now)
            {
                return (false, "Cannot book for a timeslot that has already ended", null);
            }
        }

        bool roomAlreadyBooked = await _context.Reservations.AnyAsync(r =>
            r.RoomId == room.Id &&
            r.CompanyId == room.CompanyId &&
            r.TimeslotId == request.TimeslotId &&
            r.Date >= dayStart && r.Date < dayEnd);

        if (roomAlreadyBooked)
        {
            return (false, "Room is already booked for this timeslot", null);
        }

        bool employeeBusy = await _context.Reservations.AnyAsync(r =>
            r.EmployeeId == employeeId &&
            r.TimeslotId == request.TimeslotId &&
            r.Date >= dayStart && r.Date < dayEnd);

        if (employeeBusy)
        {
            return (false, "Employee already has a reservation for this timeslot", null);
        }

        var reservation = new Reservation
        {
            Date = dayStart,
            EmployeeId = employeeId,
            RoomId = room.Id,
            TimeslotId = timeslot.Id,
            CompanyId = room.CompanyId
        };

        await _context.Reservations.AddAsync(reservation);
        employee.RoomsBooked += 1;
        await _context.SaveChangesAsync();

        return (true, "Reservation created", reservation);
    }
}