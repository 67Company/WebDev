using calender_backend.Data;
using calender_backend.Models;

public class TimeslotService : ITimeslotService
{
    private readonly CalenderContext _context;
    public TimeslotService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Timeslot>> GetAllTimeSlotsAsync()
    {
        return _context.Timeslots.ToList();
    }

    public async Task<Timeslot?> GetTimeSlotByIdAsync(int id)
    {
        Timeslot? timeslot = await _context.Timeslots.FindAsync(id);
        return timeslot;
    }

    public async Task<Timeslot?> GetTimeSlotbByTimeAsync(DateTime startTime)
    {
        return _context.Timeslots
            .Where(t => t.StartTime == startTime)
            .FirstOrDefault();
    }
}