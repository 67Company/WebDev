using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;
using calender_backend.Filters;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly EventService _eventService;

    public EventController(CalenderContext context)
    {
        _eventService = new EventService(context);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAll(int companyId)
    {
        var events = await _eventService.GetAllEventsAsync(companyId);
        return Ok(events);
    }

    [HttpGet("with-capacity")]
    public async Task<ActionResult<IEnumerable<EventWithCapacityDTO>>> GetAllWithCapacity(int companyId)
    {
        var events = await _eventService.GetAllEventsWithCapacityAsync(companyId);
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

    [HttpGet("{id}/details")]
    public async Task<ActionResult<EventWithDetailsDTO>> GetWithDetails(int id)
    {
        var ev = await _eventService.GetEventWithDetailsAsync(id);
        if (ev == null)
            return NotFound();
        return Ok(ev);
    }

    [HttpPost]
    [AdminOnly]
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
            Capacity = eventDto.Capacity,
            CompanyId = eventDto.CompanyId
        };
        var result = await _eventService.CreateEventAsync(ev);
        if (!result)
            return BadRequest();
        return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
    }

    [HttpPut("{id}")]
    [AdminOnly]
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
            Capacity = eventDto.Capacity,
            CompanyId = eventDto.CompanyId
        };
        var result = await _eventService.UpdateEventAsync(id, ev);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [AdminOnly]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _eventService.DeleteEventAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/join")]
    public async Task<ActionResult> JoinEvent(int id, [FromBody] int employeeId)
    {
        var result = await _eventService.JoinEventAsync(id, employeeId);
        if (!result)
            return BadRequest("Unable to join event");
        return Ok();
    }

    [HttpDelete("{id}/leave")]
    public async Task<ActionResult> LeaveEvent(int id, [FromBody] int employeeId)
    {
        var result = await _eventService.LeaveEventAsync(id, employeeId);
        if (!result)
            return BadRequest("Unable to leave event");
        return Ok();
    }

    [HttpGet("joined/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Event>>> GetJoinedEvents(int employeeId)
    {
        var events = await _eventService.GetJoinedEventsAsync(employeeId);
        return Ok(events);
    }

    [HttpGet("{id}/attendees")]
    public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetEventAttendees(int id)
    {
        var attendees = await _eventService.GetEventAttendeesAsync(id);
        return Ok(attendees);
    }
}