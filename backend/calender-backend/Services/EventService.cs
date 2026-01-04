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

    public async Task<IEnumerable<EventWithCapacityDTO>> GetAllEventsWithCapacityAsync(int companyId)
    {
        var events = await _context.Events
            .Where(x => x.CompanyId == companyId)
            .Include(e => e.Attendees)
            .ToListAsync();

        return events.Select(e => new EventWithCapacityDTO
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            Date = e.Date,
            StartTime = e.StartTime,
            EndTime = e.EndTime,
            Location = e.Location,
            Capacity = e.Capacity,
            CurrentAttendees = e.Attendees?.Count ?? 0,
            IsFull = e.Attendees?.Count >= e.Capacity
        });
    }

    public async Task<Event?> GetEventByIdAsync(int id)
    {
        Event? eventEntry = await _context.Events
            .Include(e => e.Attendees)
                .ThenInclude(a => a.Employee)
            .Include(e => e.Reviews)
                .ThenInclude(r => r.Employee)
            .FirstOrDefaultAsync(e => e.Id == id);
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

    public async Task<bool> JoinEventAsync(int eventId, int employeeId)
    {
        var existingAttendee = await _context.Attendees
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.EmployeeId == employeeId);
        
        if (existingAttendee != null)
            return false; // Already joined

        // Check event capacity
        var eventEntry = await _context.Events
            .Include(e => e.Attendees)
            .FirstOrDefaultAsync(e => e.Id == eventId);
        
        if (eventEntry == null)
            return false; // Event not found
        
        var currentAttendees = eventEntry.Attendees?.Count ?? 0;
        if (currentAttendees >= eventEntry.Capacity)
            return false; // Event is full

        var attendee = new Attendee
        {
            EventId = eventId,
            EmployeeId = employeeId
        };

        await _context.Attendees.AddAsync(attendee);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> LeaveEventAsync(int eventId, int employeeId)
    {
        var attendee = await _context.Attendees
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.EmployeeId == employeeId);
        
        if (attendee == null)
            return false; // Not joined

        // Check if event is within 24 hours
        var eventEntry = await _context.Events.FindAsync(eventId);
        if (eventEntry != null)
        {
            var hoursUntilEvent = (eventEntry.StartTime - DateTime.UtcNow).TotalHours;
            if (hoursUntilEvent < 24)
                return false; // Cannot leave within 24 hours of event
        }

        _context.Attendees.Remove(attendee);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Event>> GetJoinedEventsAsync(int employeeId)
    {
        return await _context.Attendees
            .Where(a => a.EmployeeId == employeeId)
            .Include(a => a.Event)
            .Select(a => a.Event!)
            .ToListAsync();
    }

    public async Task<IEnumerable<EmployeeDTO>> GetEventAttendeesAsync(int eventId)
    {
        return await _context.Attendees
            .Where(a => a.EventId == eventId)
            .Include(a => a.Employee)
            .Select(a => new EmployeeDTO
            {
                Id = a.Employee!.Id,
                Email = a.Employee.Email
            })
            .ToListAsync();
    }

    public async Task<EventWithDetailsDTO?> GetEventWithDetailsAsync(int eventId)
    {
        var ev = await _context.Events
            .Include(e => e.Attendees)
                .ThenInclude(a => a.Employee)
            .Include(e => e.Reviews)
                .ThenInclude(r => r.Employee)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (ev == null)
            return null;

        var attendees = ev.Attendees
            .Select(a => new EmployeeDTO
            {
                Id = a.Employee!.Id,
                Email = a.Employee.Email
            })
            .ToList();

        var reviews = ev.Reviews
            .Select(r => new ReviewWithEmployeeDTO
            {
                Id = r.Id,
                EventId = r.EventId,
                EmployeeId = r.EmployeeId,
                EmployeeEmail = r.Employee!.Email,
                Content = r.Content,
                Rating = r.Rating,
                CreatedAt = r.CreatedAt
            })
            .ToList();

        return new EventWithDetailsDTO
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            Date = ev.Date,
            StartTime = ev.StartTime,
            EndTime = ev.EndTime,
            Location = ev.Location,
            Capacity = ev.Capacity,
            CurrentAttendees = attendees.Count,
            Attendees = attendees,
            Reviews = reviews
        };
    }
}