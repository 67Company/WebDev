public interface ITimeslotService
{
    Task<IEnumerable<Timeslot>> GetAllTimeSlotsAsync();
    Task<Timeslot?> GetTimeSlotByIdAsync(int id);
    Task<Timeslot?> GetTimeSlotbByTimeAsync(DateTime startTime);
}