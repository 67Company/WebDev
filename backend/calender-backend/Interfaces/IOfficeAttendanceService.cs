using calender_backend.Models;

namespace calender_backend.Interfaces;

public interface IOfficeAttendanceService
{
    Task<(bool Success, string Message, Reservation? Reservation)> BookAttendanceAsync(int employeeId, DateTime date, int roomId, int timeslotId, int companyId, int requestingEmployeeId);
    Task<(bool Success, string Message)> CancelAttendanceAsync(int reservationId, int requestingEmployeeId);
    Task<(bool Success, string Message)> UpdateAttendanceAsync(int reservationId, DateTime? newDate, int? newRoomId, int? newTimeslotId, int requestingEmployeeId);
    Task<IEnumerable<Reservation>> GetMyAttendanceAsync(int employeeId);
    Task<Reservation?> GetAttendanceByIdAsync(int reservationId);
}
