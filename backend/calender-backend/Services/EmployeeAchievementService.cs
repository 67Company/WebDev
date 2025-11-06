using calender_backend.Data;
using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

public class EmployeeAchievementService : IEmployeeAchievementService
{
    private readonly CalenderContext _context;

    public EmployeeAchievementService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<bool> AssignAchievementToEmployeeAsync(int employeeId, int achievementId)
    {
        bool isAssigned = false;
        var employee = await _context.Employees.FindAsync(employeeId);
        var achievement = await _context.Achievements.FindAsync(achievementId);
        if (employee != null && achievement != null)
        {
            var employeeAchievement = new EmployeeAchievement
            {
                EmployeeId = employeeId,
                AchievementId = achievementId,
            };
            isAssigned = await _context.EmployeeAchievements.AddAsync(employeeAchievement) != null;
            await _context.SaveChangesAsync();
        }
        return isAssigned;
    }

    public async Task<bool> RemoveAchievementFromEmployeeAsync(int employeeId, int achievementId)
    {
        bool isRemoved = false;
        var employeeAchievement = _context.EmployeeAchievements
            .FirstOrDefault(ea => ea.EmployeeId == employeeId && ea.AchievementId == achievementId);
        if (employeeAchievement != null)
        {
            _context.EmployeeAchievements.Remove(employeeAchievement);
            isRemoved = true;
            await _context.SaveChangesAsync();
        }
        return isRemoved;
    }

    public async Task<IEnumerable<Achievement?>> GetAchievementsByEmployeeIdAsync(int employeeId)
    {
        var achievements = await _context.EmployeeAchievements
            .Where(ea => ea.EmployeeId == employeeId)
            .Select(ea => ea.Achievement)
            .ToListAsync();
        return achievements;
    }

    public async Task<IEnumerable<Employee?>> GetEmployeesByAchievementIdAsync(int achievementId)
    {
        var employees = await _context.EmployeeAchievements
            .Where(ea => ea.AchievementId == achievementId)
            .Select(ea => ea.Employee)
            .ToListAsync();
        return employees;
    }
}