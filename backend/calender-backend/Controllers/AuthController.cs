using Microsoft.AspNetCore.Mvc;
using calender_backend.Interfaces;
using calender_backend.Models;

namespace calender_backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <param name="loginDto">Login creds</param>
    /// <returns>Employee info and auth status</returns>
    [HttpPost("login")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(LoginResponseDTO), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] EmployeeLoginDTO loginDto)
    {
        if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.PasswordHash))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        var (success, employee, isAdmin, message) = await _authService.LoginAsync(loginDto.Email, loginDto.PasswordHash);

        if (!success)
        {
            return Unauthorized(new { message });
        }

        return Ok(new LoginResponseDTO
        { 
            Employee = employee!,
            IsAdmin = isAdmin,
            Message = message
        });
    }

    // GET: api/Auth/me/{employeeId}
    [HttpGet("me/{employeeId}")]
    [ProducesResponseType(typeof(EmployeeDetailDTO), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<EmployeeDetailDTO>> GetCurrentEmployee(int employeeId)
    {
        var (success, employeeData, message) = await _authService.GetEmployeeDetailsAsync(employeeId);

        if (!success)
        {
            return NotFound(new { message });
        }

        return Ok(employeeData);
    }
}
