using calender_backend.Models;

public interface IEventService
{
    Task<IEnumerable<Event>> GetAllEventsAsync(int companyId);
    Task<IEnumerable<EventWithCapacityDTO>> GetAllEventsWithCapacityAsync(int companyId);
    Task<Event?> GetEventByIdAsync(int id);
    Task<bool> CreateEventAsync(Event newEvent);
    Task<bool> UpdateEventAsync(int id, Event updatedEvent);
    Task<bool> DeleteEventAsync(int id);
    Task<bool> JoinEventAsync(int eventId, int employeeId);
    Task<bool> LeaveEventAsync(int eventId, int employeeId);
    Task<IEnumerable<Event>> GetJoinedEventsAsync(int employeeId);
    Task<IEnumerable<EmployeeDTO>> GetEventAttendeesAsync(int eventId);
}