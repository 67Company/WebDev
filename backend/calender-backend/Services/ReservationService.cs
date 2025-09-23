public class ReservationService : IReservationService
{
    private readonly string _connectionString = "Data Source=reservation.db";

    public ReservationService()
    {
    }

    public Task<IEnumerable<Reservation>> GetAllReservationsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Reservation> GetReservationByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> CreateReservationAsync(Reservation reservation)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateReservationAsync(int id, Reservation updatedReservation)
    {
        throw new NotImplementedException();
    }

    public Task<bool> CancelReservationAsync(int employeeId, int roomId, DateTime startTime)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteReservationAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Reservation>> GetReservationsByEmployeeIdAsync(int employeeId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Reservation>> GetReservationsByRoomIdAsync(int roomId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Reservation>> GetReservationsByDateAsync(DateTime date)
    {
        throw new NotImplementedException();
    }
}