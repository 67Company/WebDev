using Microsoft.AspNetCore.Mvc;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
	private readonly RoomService _roomService;

	public RoomController()
	{
		_roomService = new RoomService();
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Room>>> GetAll()
	{
		var rooms = await _roomService.GetAllRoomsAsync();
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

	[HttpGet("name/{name}")]
	public async Task<ActionResult<Room>> GetByName(string name)
	{
		var room = await _roomService.GetRoomByNameAsync(name);
		if (room == null)
			return NotFound();
		return Ok(room);
	}

	[HttpGet("capacity/{capacity}")]
	public async Task<ActionResult<IEnumerable<Room>>> GetByCapacity(int capacity)
	{
		var rooms = await _roomService.GetRoomsByCapacityAsync(capacity);
		return Ok(rooms);
	}

	[HttpPost]
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
	public async Task<ActionResult> Delete(int id)
	{
		var result = await _roomService.DeleteRoomAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}
}
