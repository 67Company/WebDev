public interface ITimeSlotService
{
    Task<IEnumerable<TimeSlot>> GetAllTimeSlotsAsync();
    Task<TimeSlot> GetTimeSlotByIdAsync(int id);
    Task<TimeSlot> GetTimeSlotbByTimeAsync(DateTime startTime);
}