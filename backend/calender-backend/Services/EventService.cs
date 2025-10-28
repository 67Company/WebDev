using calender_backend.Data;
using calender_backend.Models;
using SQLitePCL;

public class EventService : IEventService
{
    private readonly CalenderContext _context;

    public EventService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return _context.Events.ToList();
    }

    public async Task<Event?> GetEventByIdAsync(int id)
    {
        Event? eventEntry = await _context.Events.FindAsync(id);
        return eventEntry;
    }

    public async Task<bool> CreateEventAsync(Event newEvent)
    {
        bool isCreated = await _context.Events.AddAsync(newEvent) != null;
        _context.SaveChanges();
        return isCreated;
    }

    public async Task<bool> UpdateEventAsync(int id, Event updatedEvent)
    {
        bool isUpdated = _context.Events.Update(updatedEvent) != null;
        _context.SaveChanges();
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
            _context.SaveChanges();
        }
        return isDeleted;
    }
}