using calender_backend.Data;
using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

public class EventService : IEventService
{
    private readonly CalenderContext _context;

    public EventService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync(int companyId)
    {
        return await _context.Events.Where(x => x.CompanyId == companyId).ToListAsync();
    }

    public async Task<Event?> GetEventByIdAsync(int id)
    {
        Event? eventEntry = await _context.Events.FindAsync(id);
        return eventEntry;
    }

    public async Task<bool> CreateEventAsync(Event newEvent)
    {
        bool isCreated = await _context.Events.AddAsync(newEvent) != null;
        await _context.SaveChangesAsync();
        return isCreated;
    }

    public async Task<bool> UpdateEventAsync(int id, Event updatedEvent)
    {
        bool isUpdated = _context.Events.Update(updatedEvent) != null;
        await _context.SaveChangesAsync();
        return isUpdated;
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        bool isDeleted = false;
        Event? eventEntry = await _context.Events.FindAsync(id);
        if (eventEntry != null)
        {
            _context.Events.Remove(eventEntry);
            isDeleted = true;
            await _context.SaveChangesAsync();
        }
        return isDeleted;
    }
}