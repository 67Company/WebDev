using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimeslotController : ControllerBase
{
	private readonly TimeslotService _timeslotService;

	public TimeslotController()
	{
		_timeslotService = new TimeslotService();
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Timeslot>>> GetAll()
	{
		var timeslots = await _timeslotService.GetAllTimeSlotsAsync();
		return Ok(timeslots);
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Timeslot>> GetById(int id)
	{
		var timeslot = await _timeslotService.GetTimeSlotByIdAsync(id);
		if (timeslot == null)
			return NotFound();
		return Ok(timeslot);
	}

	[HttpGet("start/{startTime}")]
	public async Task<ActionResult<Timeslot>> GetByTime(DateTime startTime)
	{
		var timeslot = await _timeslotService.GetTimeSlotbByTimeAsync(startTime);
		if (timeslot == null)
			return NotFound();
		return Ok(timeslot);
	}
}
