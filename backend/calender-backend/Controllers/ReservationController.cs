using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
	private readonly ReservationService _reservationService;

	public ReservationController(CalenderContext context)
	{
		_reservationService = new ReservationService(context);
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetAll(int companyId)
	{
		var reservations = await _reservationService.GetAllReservationsAsync(companyId);
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

	[HttpPost("book")]
	public async Task<ActionResult> BookForCurrentUser(
		[FromBody] BookReservationRequest request,
		[FromHeader(Name = "X-Employee-Id")] int? employeeId,
		[FromQuery(Name = "employeeId")] int? employeeIdFromQuery)
	{
		int? resolvedEmployeeId = employeeId ?? employeeIdFromQuery;
		if (resolvedEmployeeId is null || resolvedEmployeeId <= 0)
			return Unauthorized(new { message = "Employee id is required to book a room" });

		var result = await _reservationService.BookRoomForEmployeeAsync(resolvedEmployeeId.Value, request);
		if (!result.Success || result.Reservation == null)
			return BadRequest(new { message = result.Message });

		// Return a simple DTO to avoid circular reference serialization
		var dto = new ReservationResultDTO
		{
			Id = result.Reservation.Id,
			Date = result.Reservation.Date,
			EmployeeId = result.Reservation.EmployeeId,
			RoomId = result.Reservation.RoomId,
			TimeslotId = result.Reservation.TimeslotId,
			CompanyId = result.Reservation.CompanyId
		};

		return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
	}

	[HttpPut("{id}")]
	public async Task<ActionResult> Update(int id, [FromBody] Reservation reservation)
	{
		var result = await _reservationService.UpdateReservationAsync(id, reservation);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("room/{roomId}/employee/{employeeId}/date/{date}")]
	public async Task<ActionResult> Delete(int roomId, int employeeId, DateTime date)
	{
		var result = await _reservationService.CancelReservationAsync(roomId, employeeId, date);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("{reservationId}")]
	public async Task<ActionResult> CancelReservation(int reservationId, [FromQuery] int employeeId)
	{
		var result = await _reservationService.CancelReservationByIdAsync(reservationId, employeeId);
		if (!result.Success)
			return BadRequest(new { message = result.Message });
		return Ok(new { message = result.Message });
	}

	[HttpGet("employee/{employeeId}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByEmployee(int employeeId, int companyId)
	{
		var reservations = await _reservationService.GetReservationsByEmployeeIdAsync(employeeId, companyId);
		return Ok(reservations);
	}

	[HttpGet("room/{roomId}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByRoom(int roomId, int companyId)
	{
		var reservations = await _reservationService.GetReservationsByRoomIdAsync(roomId, companyId);
		return Ok(reservations);
	}

	[HttpGet("date/{date}")]
	public async Task<ActionResult<IEnumerable<Reservation>>> GetByDate(DateTime date, int companyId)
	{
		var reservations = await _reservationService.GetReservationsByDateAsync(date, companyId);
		return Ok(reservations);
	}
}
