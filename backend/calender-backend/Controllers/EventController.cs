using Microsoft.AspNetCore.Mvc;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly EventService _eventService;

    public EventController()
    {
        _eventService = new EventService();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAll()
    {
        var events = await _eventService.GetAllEventsAsync();
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetById(int id)
    {
        var ev = await _eventService.GetEventByIdAsync(id);
        if (ev == null)
            return NotFound();
        return Ok(ev);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] EventDTO eventDto)
    {
        var ev = new Event
        {
            Title = eventDto.Title,
            Description = eventDto.Description,
            Date = eventDto.Date,
            StartTime = eventDto.StartTime,
            EndTime = eventDto.EndTime,
            Location = eventDto.Location,
            Capacity = eventDto.Capacity
        };
        var result = await _eventService.CreateEventAsync(ev);
        if (!result)
            return BadRequest();
        return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] EventDTO eventDto)
    {
        var ev = new Event
        {
            Title = eventDto.Title,
            Description = eventDto.Description,
            Date = eventDto.Date,
            StartTime = eventDto.StartTime,
            EndTime = eventDto.EndTime,
            Location = eventDto.Location,
            Capacity = eventDto.Capacity
        };
        var result = await _eventService.UpdateEventAsync(id, ev);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _eventService.DeleteEventAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}