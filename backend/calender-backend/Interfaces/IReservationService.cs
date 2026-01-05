using calender_backend.Models;

public interface IReservationService
{
    Task<IEnumerable<Reservation>> GetAllReservationsAsync(int companyId);
    Task<Reservation?> GetReservationByIdAsync(int id);
    Task<bool> CreateReservationAsync(Reservation reservation);
    Task<bool> UpdateReservationAsync(int id, Reservation reservation);
    Task<bool> CancelReservationAsync(int roomId, int employeeId, DateTime startTime);
    Task<IEnumerable<Reservation>> GetReservationsByEmployeeIdAsync(int employeeId, int companyId);
    Task<IEnumerable<Reservation>> GetReservationsByRoomIdAsync(int roomId, int companyId);
    Task<IEnumerable<Reservation>> GetReservationsByDateAsync(DateTime date, int companyId);
    Task<(bool Success, string Message, Reservation? Reservation)> BookRoomForEmployeeAsync(int employeeId, BookReservationRequest request);
}