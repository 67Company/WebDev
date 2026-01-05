using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;
using calender_backend.Filters;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
	private readonly RoomService _roomService;

	public RoomController(CalenderContext context)
	{
		_roomService = new RoomService(context);
	}

	[HttpGet("company/{companyId}")]
	public async Task<ActionResult<IEnumerable<Room>>> GetAll(int companyId)
	{
		var rooms = await _roomService.GetAllRoomsAsync(companyId);
		return Ok(rooms);
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Room>> GetById(int id)
	{
		var room = await _roomService.GetRoomByIdAsync(id);
		if (room == null)
			return NotFound();
		return Ok(room);
	}

	[HttpGet("company/{companyId}/name/{name}")]
	public async Task<ActionResult<Room>> GetByName(string name, int companyId)
	{
		var room = await _roomService.GetRoomByNameAsync(name, companyId);
		if (room == null)
			return NotFound();
		return Ok(room);
	}

	[HttpGet("company/{companyId}/capacity/{capacity}")]
	public async Task<ActionResult<IEnumerable<Room>>> GetByCapacity(int capacity, int companyId)
	{
		var rooms = await _roomService.GetRoomsByCapacityAsync(capacity, companyId);
		return Ok(rooms);
	}

	[HttpPost]
	[AdminOnly]
	public async Task<ActionResult> Create([FromBody] RoomDTO roomDto)
	{
		var room = new Room
		{
			Name = roomDto.Name,
			Capacity = roomDto.Capacity
		};
		var result = await _roomService.CreateRoomAsync(room);
		if (!result)
			return BadRequest();
		return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
	}

	[HttpPut("{id}")]
	[AdminOnly]
	public async Task<ActionResult> Update(int id, [FromBody] RoomDTO roomDto)
	{
		var room = new Room
		{
			Name = roomDto.Name,
			Capacity = roomDto.Capacity
		};
		var result = await _roomService.UpdateRoomAsync(id, room);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("{id}")]
	[AdminOnly]
	public async Task<ActionResult> Delete(int id)
	{
		var result = await _roomService.DeleteRoomAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}
}
