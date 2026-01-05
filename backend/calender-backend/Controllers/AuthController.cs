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

        // Store user info in session
        HttpContext.Session.SetInt32("UserId", employee!.Id);
        HttpContext.Session.SetString("UserEmail", employee.Email);
        HttpContext.Session.SetInt32("CompanyId", employee.CompanyId);
        HttpContext.Session.SetString("IsAdmin", isAdmin.ToString());

        return Ok(new LoginResponseDTO
        { 
            Employee = employee!,
            IsAdmin = isAdmin,
            Message = message
        });
    }

    // POST: api/Auth/logout
    [HttpPost("logout")]
    [ProducesResponseType(200)]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Logged out successfully" });
    }

    // GET: api/Auth/session
    [HttpGet("session")]
    [ProducesResponseType(typeof(SessionDTO), 200)]
    [ProducesResponseType(401)]
    public IActionResult GetSession()
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        
        if (userId == null)
        {
            return Unauthorized(new { message = "No active session" });
        }

        var userEmail = HttpContext.Session.GetString("UserEmail");
        var companyId = HttpContext.Session.GetInt32("CompanyId");
        var isAdmin = HttpContext.Session.GetString("IsAdmin") == "True";

        return Ok(new SessionDTO
        {
            Id = userId.Value,
            Email = userEmail ?? "",
            CompanyId = companyId ?? 0,
            IsAdmin = isAdmin
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
