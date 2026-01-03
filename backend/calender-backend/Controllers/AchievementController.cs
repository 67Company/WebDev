using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementController : ControllerBase
{
    private readonly AchievementService _achievementService;

    public AchievementController(CalenderContext context)
    {
        _achievementService = new AchievementService(context);
    }

    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<IEnumerable<Achievement>>> GetAll(int companyId)
    {
        var achievements = await _achievementService.GetAllAchievementsAsync(companyId);
        return Ok(achievements);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Achievement>> GetById(int id)
    {
        var achievement = await _achievementService.GetAchievementByIdAsync(id);
        if (achievement == null)
            return NotFound();
        return Ok(achievement);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] AchievementDTO achievementDto, [FromQuery] int companyId)
    {
        var achievement = new Achievement
        {
            Title = achievementDto.Title,
            Description = achievementDto.Description,
            Icon = achievementDto.Icon,
            StatToTrack = achievementDto.StatToTrack,
            Threshold = achievementDto.Threshold,
            CompanyId = companyId
        };
        var result = await _achievementService.CreateAchievementAsync(achievement);
        if (!result)
            return BadRequest();
        return CreatedAtAction(nameof(GetById), new { id = achievement.Id }, achievement);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] AchievementDTO achievementDto)
    {
        var achievement = new Achievement
        {
            Title = achievementDto.Title,
            Description = achievementDto.Description,
            Icon = achievementDto.Icon,
            StatToTrack = achievementDto.StatToTrack,
            Threshold = achievementDto.Threshold
        };
        var result = await _achievementService.UpdateAchievementAsync(id, achievement);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _achievementService.DeleteAchievementAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}