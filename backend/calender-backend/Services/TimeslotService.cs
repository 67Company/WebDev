public class TimeslotService : ITimeslotService
{
    private readonly string _connectionString = "Data Source=timeslot.db";

    public TimeslotService()
    {
    }

    public Task<IEnumerable<Timeslot>> GetAllTimeSlotsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Timeslot> GetTimeSlotByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Timeslot> GetTimeSlotbByTimeAsync(DateTime startTime)
    {
        throw new NotImplementedException();
    }
}