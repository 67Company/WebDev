using calender_backend.Data;
using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

public class TimeslotService : ITimeslotService
{
    private readonly CalenderContext _context;
    public TimeslotService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Timeslot>> GetAllTimeSlotsAsync()
    {
        return await _context.Timeslots.ToListAsync();
    }

    public async Task<Timeslot?> GetTimeSlotByIdAsync(int id)
    {
        Timeslot? timeslot = await _context.Timeslots.FindAsync(id);
        return timeslot;
    }

    public async Task<Timeslot?> GetTimeSlotbByTimeAsync(DateTime startTime)
    {
        return await _context.Timeslots
            .Where(t => t.StartTime == startTime)
            .FirstOrDefaultAsync();
    }
}