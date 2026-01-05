using Microsoft.AspNetCore.Mvc;
using calender_backend.Interfaces;
using calender_backend.Models;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OfficeAttendanceController : ControllerBase
{
    private readonly IOfficeAttendanceService _attendanceService;
    private readonly IAuthService _authService;

    public OfficeAttendanceController(IOfficeAttendanceService attendanceService, IAuthService authService)
    {
        _attendanceService = attendanceService;
        _authService = authService;
    }

    /// <summary>
    /// Get all office attendance records for the logged-in user
    /// Allows users to view their upcoming and past office attendance
    /// </summary>
    /// <param name="employeeId">The ID of the logged-in employee</param>
    /// <returns>List of office attendance records</returns>
    [HttpGet("my-attendance/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetMyAttendance(int employeeId)
    {
        var (success, employeeData, message) = await _authService.GetEmployeeDetailsAsync(employeeId);
        if (!success)
        {
            return Unauthorized(new { message = "Employee not found or inactive" });
        }

        var reservations = await _attendanceService.GetMyAttendanceAsync(employeeId);
        return Ok(reservations);
    }

    /// <summary>
    /// Get a specific office attendance record by ID (only if owned by requesting user)
    /// </summary>
    /// <param name="reservationId">The attendance record ID</param>
    /// <param name="employeeId">The ID of the requesting employee</param>
    /// <returns>Office attendance record details</returns>
    [HttpGet("{reservationId}/employee/{employeeId}")]
    public async Task<ActionResult<Reservation>> GetAttendanceById(int reservationId, int employeeId)
    {
        var reservation = await _attendanceService.GetAttendanceByIdAsync(reservationId);
        
        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        if (reservation.EmployeeId != employeeId)
        {
            return Unauthorized(new { message = "Unauthorized: You can only view your own attendance" });
        }

        return Ok(reservation);
    }

    /// <summary>
    /// Register office attendance for a specific date and timeslot
    /// User specifies when they will be present in the office (room can optionally be specified for desk/area tracking)
    /// Protected endpoint - users can only book attendance for themselves
    /// </summary>
    /// <param name="bookingRequest">Attendance registration details</param>
    /// <returns>Created office attendance record</returns>
    [HttpPost("book")]
    public async Task<ActionResult<Reservation>> BookAttendance([FromBody] AttendanceBookingRequest bookingRequest)
    {
        if (bookingRequest == null)
        {
            return BadRequest(new { message = "Invalid booking request" });
        }

        var (success, employeeData, message) = await _authService.GetEmployeeDetailsAsync(bookingRequest.EmployeeId);
        if (!success)
        {
            return Unauthorized(new { message = "Employee not found or inactive" });
        }

        var (bookSuccess, bookMessage, reservation) = await _attendanceService.BookAttendanceAsync(
            bookingRequest.EmployeeId,
            bookingRequest.Date,
            bookingRequest.RoomId,
            bookingRequest.TimeslotId,
            bookingRequest.CompanyId,
            bookingRequest.EmployeeId);

        if (!bookSuccess)
        {
            return BadRequest(new { message = bookMessage });
        }

        return CreatedAtAction(
            nameof(GetAttendanceById), 
            new { reservationId = reservation!.Id, employeeId = bookingRequest.EmployeeId }, 
            reservation);
    }

    /// <summary>
    /// Update an existing office attendance record
    /// Protected endpoint - users can only modify their own attendance
    /// </summary>
    /// <param name="reservationId">The attendance record ID to update</param>
    /// <param name="updateRequest">Update details</param>
    /// <returns>Success message</returns>
    [HttpPut("{reservationId}")]
    public async Task<ActionResult> UpdateAttendance(int reservationId, [FromBody] AttendanceUpdateRequest updateRequest)
    {
        if (updateRequest == null)
        {
            return BadRequest(new { message = "Invalid update request" });
        }

        var (success, employeeData, message) = await _authService.GetEmployeeDetailsAsync(updateRequest.EmployeeId);
        if (!success)
        {
            return Unauthorized(new { message = "Employee not found or inactive" });
        }

        var (updateSuccess, updateMessage) = await _attendanceService.UpdateAttendanceAsync(
            reservationId,
            updateRequest.NewDate,
            updateRequest.NewRoomId,
            updateRequest.NewTimeslotId,
            updateRequest.EmployeeId);

        if (!updateSuccess)
        {
            return BadRequest(new { message = updateMessage });
        }

        return Ok(new { message = updateMessage });
    }

    /// <summary>
    /// Cancel an office attendance record
    /// Protected endpoint - users can only cancel their own attendance
    /// </summary>
    /// <param name="reservationId">The attendance record ID to cancel</param>
    /// <param name="employeeId">The ID of the requesting employee</param>
    /// <returns>Success message</returns>
    [HttpDelete("{reservationId}/employee/{employeeId}")]
    public async Task<ActionResult> CancelAttendance(int reservationId, int employeeId)
    {
        var (success, employeeData, message) = await _authService.GetEmployeeDetailsAsync(employeeId);
        if (!success)
        {
            return Unauthorized(new { message = "Employee not found or inactive" });
        }

        var (cancelSuccess, cancelMessage) = await _attendanceService.CancelAttendanceAsync(reservationId, employeeId);

        if (!cancelSuccess)
        {
            return BadRequest(new { message = cancelMessage });
        }

        return Ok(new { message = cancelMessage });
    }
}

public class AttendanceBookingRequest
{
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public int RoomId { get; set; }
    public int TimeslotId { get; set; }
    public int CompanyId { get; set; }
}

public class AttendanceUpdateRequest
{
    public int EmployeeId { get; set; }
    public DateTime? NewDate { get; set; }
    public int? NewRoomId { get; set; }
    public int? NewTimeslotId { get; set; }
}
