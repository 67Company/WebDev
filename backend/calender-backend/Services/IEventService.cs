public class EventService : IEventService
{
    private readonly string _connectionString = "Data Source=event.db";

    public EventService()
    {
    }

    public Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Event> GetEventByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> CreateEventAsync(Event newEvent)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateEventAsync(int id, Event updatedEvent)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteEventAsync(int id)
    {
        throw new NotImplementedException();
    }
}