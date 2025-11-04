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
        bool isCreated = await _context.Reservations.AddAsync(reservation) != null;
        _context.SaveChanges();
        return isCreated;
    }

    public async Task<bool> UpdateReservationAsync(int id, Reservation updatedReservation)
    {
        bool isUpdated = _context.Reservations.Update(updatedReservation) != null;
        await _context.SaveChangesAsync();
        return isUpdated;
    }

    public async Task<bool> CancelReservationAsync(int employeeId, int roomId, DateTime date)
    {
        Reservation? reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.EmployeeId == employeeId && r.RoomId == roomId && r.Date == date);
        if (reservation != null)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
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
        return await _context.Reservations.Where(r => r.Date.Date == date.Date && r.CompanyId == companyId).ToListAsync();
    }
}