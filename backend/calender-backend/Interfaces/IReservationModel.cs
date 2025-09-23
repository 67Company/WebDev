public interface IReservationInterface
{
    Task<IEnumerable<Reservation>> GetAllReservationsAsync();
    Task<Reservation> GetReservationByIdAsync(int id);
    Task<bool> CreateReservationAsync(Reservation reservation);
    Task<bool> UpdateReservationAsync(int id, Reservation reservation);
    Task<bool> DeleteReservationAsync(int id);
    Task<IEnumerable<Reservation>> GetReservationsByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<Reservation>> GetReservationsByRoomIdAsync(int roomId);
    Task<IEnumerable<Reservation>> GetReservationsByDateAsync(DateTime date);
}