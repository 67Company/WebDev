using Microsoft.AspNetCore.Mvc;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
	private readonly ReservationService _reservationService;

	public ReservationController()
	{
		_reservationService = new ReservationService();
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetAll()
	{
		var reservations = await _reservationService.GetAllReservationsAsync();
		return Ok(reservations);
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Reservation>> GetById(int id)
	{
		var reservation = await _reservationService.GetReservationByIdAsync(id);
		if (reservation == null)
			return NotFound();
		return Ok(reservation);
	}

	[HttpPost]
	public async Task<ActionResult> Create([FromBody] Reservation reservation)
	{
		var result = await _reservationService.CreateReservationAsync(reservation);
		if (!result)
			return BadRequest();
		return CreatedAtAction(nameof(GetById), new { id = reservation.Id }, reservation);
	}

	[HttpPut("{id}")]
	public async Task<ActionResult> Update(int id, [FromBody] Reservation reservation)
	{
		var result = await _reservationService.UpdateReservationAsync(id, reservation);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> Delete(int id)
	{
		var result = await _reservationService.DeleteReservationAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpGet("employee/{employeeId}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByEmployee(int employeeId)
	{
		var reservations = await _reservationService.GetReservationsByEmployeeIdAsync(employeeId);
		return Ok(reservations);
	}

	[HttpGet("room/{roomId}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByRoom(int roomId)
	{
		var reservations = await _reservationService.GetReservationsByRoomIdAsync(roomId);
		return Ok(reservations);
	}

	[HttpGet("date/{date}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByDate(DateTime date)
	{
		var reservations = await _reservationService.GetReservationsByDateAsync(date);
		return Ok(reservations);
	}
}
