using Microsoft.AspNetCore.Mvc;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeAchievementController : ControllerBase
{
    private readonly EmployeeAchievementService _employeeAchievementService;

    public EmployeeAchievementController()
    {
        _employeeAchievementService = new EmployeeAchievementService();
    }

    [HttpPost("assign")]
    public async Task<ActionResult> Assign([FromBody] EmployeeAchievementDTO dto)
    {
        var result = await _employeeAchievementService.AssignAchievementToEmployeeAsync(dto.EmployeeId, dto.AchievementId);
        if (!result)
            return BadRequest();
        return Ok();
    }

    [HttpPost("remove")]
    public async Task<ActionResult> Remove([FromBody] EmployeeAchievementDTO dto)
    {
        var result = await _employeeAchievementService.RemoveAchievementFromEmployeeAsync(dto.EmployeeId, dto.AchievementId);
        if (!result)
            return BadRequest();
        return Ok();
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Achievement>>> GetAchievementsByEmployee(int employeeId)
    {
        var achievements = await _employeeAchievementService.GetAchievementsByEmployeeIdAsync(employeeId);
        return Ok(achievements);
    }

    [HttpGet("achievement/{achievementId}")]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByAchievement(int achievementId)
    {
        var employees = await _employeeAchievementService.GetEmployeesByAchievementIdAsync(achievementId);
        return Ok(employees);
    }
}