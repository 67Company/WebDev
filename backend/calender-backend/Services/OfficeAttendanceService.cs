using Microsoft.EntityFrameworkCore;
using calender_backend.Data;
using calender_backend.Interfaces;
using calender_backend.Models;

namespace calender_backend.Services;

public class OfficeAttendanceService : IOfficeAttendanceService
{
    private readonly CalenderContext _context;

    public OfficeAttendanceService(CalenderContext context)
    {
        _context = context;
    }

    private async Task<Employee?> GetEmployeeIfValidAsync(int employeeId)
    {
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted);
    }

    private async Task<bool> IsOwnerOfReservationAsync(int reservationId, int employeeId)
    {
        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.Id == reservationId);
        
        return reservation != null && reservation.EmployeeId == employeeId;
    }

    public async Task<(bool Success, string Message, Reservation? Reservation)> BookAttendanceAsync(
        int employeeId, 
        DateTime date, 
        int roomId, 
        int timeslotId, 
        int companyId,
        int requestingEmployeeId)
    {
        if (employeeId != requestingEmployeeId)
        {
            return (false, "Unauthorized: You can only book attendance for yourself", null);
        }

        var employee = await GetEmployeeIfValidAsync(employeeId);
        if (employee == null)
        {
            return (false, "Employee not found or inactive", null);
        }

        var existingReservation = await _context.Reservations
            .FirstOrDefaultAsync(r => 
                r.EmployeeId == employeeId && 
                r.Date.Date == date.Date && 
                r.RoomId == roomId && 
                r.TimeslotId == timeslotId &&
                r.CompanyId == companyId);

        if (existingReservation != null)
        {
            return (false, "You already have a reservation for this date, room, and timeslot", null);
        }

        var conflictingReservation = await _context.Reservations
            .FirstOrDefaultAsync(r => 
                r.Date.Date == date.Date && 
                r.RoomId == roomId && 
                r.TimeslotId == timeslotId &&
                r.CompanyId == companyId);

        if (conflictingReservation != null)
        {
            return (false, "This room and timeslot is already booked for the selected date", null);
        }

        var room = await _context.Rooms
            .FirstOrDefaultAsync(r => r.Id == roomId && r.CompanyId == companyId);
        if (room == null)
        {
            return (false, "Room not found or does not belong to your company", null);
        }

        var timeslot = await _context.Timeslots
            .FirstOrDefaultAsync(t => t.Id == timeslotId);
        if (timeslot == null)
        {
            return (false, "Timeslot not found", null);
        }

        var reservation = new Reservation
        {
            EmployeeId = employeeId,
            Date = date.Date, 
            RoomId = roomId,
            TimeslotId = timeslotId,
            CompanyId = companyId
        };

        await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();

        employee.RoomsBooked++;
        await _context.SaveChangesAsync();

        // Reload the reservation with only necessary navigation properties to avoid circular reference
        var createdReservation = await _context.Reservations
            .AsNoTracking()
            .Include(r => r.Room)
            .Include(r => r.Timeslot)
            .FirstOrDefaultAsync(r => r.Id == reservation.Id);

        return (true, "Office attendance booked successfully", createdReservation);
    }

    public async Task<(bool Success, string Message)> CancelAttendanceAsync(int reservationId, int requestingEmployeeId)
    {
        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null)
        {
            return (false, "Reservation not found");
        }

        if (reservation.EmployeeId != requestingEmployeeId)
        {
            return (false, "Unauthorized: You can only cancel your own attendance");
        }

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return (true, "Office attendance cancelled successfully");
    }

    public async Task<(bool Success, string Message)> UpdateAttendanceAsync(
        int reservationId, 
        DateTime? newDate, 
        int? newRoomId, 
        int? newTimeslotId, 
        int requestingEmployeeId)
    {
        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null)
        {
            return (false, "Reservation not found");
        }

        if (reservation.EmployeeId != requestingEmployeeId)
        {
            return (false, "Unauthorized: You can only update your own attendance");
        }

        var updatedDate = newDate?.Date ?? reservation.Date;
        var updatedRoomId = newRoomId ?? reservation.RoomId;
        var updatedTimeslotId = newTimeslotId ?? reservation.TimeslotId;

        var conflictingReservation = await _context.Reservations
            .FirstOrDefaultAsync(r => 
                r.Id != reservationId &&
                r.Date.Date == updatedDate.Date && 
                r.RoomId == updatedRoomId && 
                r.TimeslotId == updatedTimeslotId &&
                r.CompanyId == reservation.CompanyId);

        if (conflictingReservation != null)
        {
            return (false, "The new date, room, and timeslot combination is already booked");
        }

        if (newRoomId.HasValue)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == newRoomId.Value && r.CompanyId == reservation.CompanyId);
            if (room == null)
            {
                return (false, "Room not found or does not belong to your company");
            }
        }

        if (newTimeslotId.HasValue)
        {
            var timeslot = await _context.Timeslots
                .FirstOrDefaultAsync(t => t.Id == newTimeslotId.Value);
            if (timeslot == null)
            {
                return (false, "Timeslot not found");
            }
        }

        reservation.Date = updatedDate;
        reservation.RoomId = updatedRoomId;
        reservation.TimeslotId = updatedTimeslotId;

        await _context.SaveChangesAsync();

        return (true, "Office attendance updated successfully");
    }

    public async Task<IEnumerable<Reservation>> GetMyAttendanceAsync(int employeeId)
    {
        return await _context.Reservations
            .Include(r => r.Room)
            .Include(r => r.Timeslot)
            .Include(r => r.Employee)
            .Where(r => r.EmployeeId == employeeId)
            .OrderBy(r => r.Date)
            .ToListAsync();
    }

    public async Task<Reservation?> GetAttendanceByIdAsync(int reservationId)
    {
        return await _context.Reservations
            .Include(r => r.Room)
            .Include(r => r.Timeslot)
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == reservationId);
    }
}
