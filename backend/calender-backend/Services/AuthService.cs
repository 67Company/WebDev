using Microsoft.EntityFrameworkCore;
using calender_backend.Data;
using calender_backend.Interfaces;
using calender_backend.Models;
using static BCrypt.Net.BCrypt;

namespace calender_backend.Services;

public class AuthService : IAuthService
{
    private readonly CalenderContext _context;

    public AuthService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<(bool Success, EmployeeDTO? Employee, bool IsAdmin, string Message)> LoginAsync(string email, string password)
    {
        // Find employee per email
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == email && !e.IsDeleted);

        if (employee == null)
        {
            return (false, null, false, "Invalid email or password");
        }

        // Verify password met BCrypt
        if (!Verify(password, employee.PasswordHash))
        {
            return (false, null, false, "Invalid email or password");
        }

        // Return employee info (zonder password)
        var employeeDto = new EmployeeDTO
        {
            Id = employee.Id,
            Email = employee.Email,
            CompanyId = employee.CompanyId
        };

        return (true, employeeDto, employee.Admin, "Login successful");
    }

    public async Task<(bool Success, EmployeeDetailDTO? EmployeeData, string Message)> GetEmployeeDetailsAsync(int employeeId)
    {
        var employee = await _context.Employees
            .Include(e => e.EmployeeAchievements)
            .ThenInclude(ea => ea.Achievement)
            .FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted);

        if (employee == null)
        {
            return (false, null, "Employee not found");
        }

        var employeeData = new EmployeeDetailDTO
        {
            Id = employee.Id,
            Email = employee.Email,
            IsAdmin = employee.Admin,
            CompanyId = employee.CompanyId,
            Stats = new EmployeeStatsDTO
            {
                MeetingsAttended = employee.MeetingsAttended,
                TeamAmount = employee.LargestTeamSize,
                TotalMeetingTime = employee.TotalMeetingTime,
                EventsAttended = employee.EventsAttended,
                EventsOrganized = employee.EventsOrganized,
                RoomsBooked = employee.RoomsBooked
            },
            Achievements = employee.EmployeeAchievements.Select(ea => new AchievementUnlockedDTO
            {
                Id = ea.AchievementId,
                Title = ea.Achievement?.Title,
                UnlockedAt = ea.DateAchieved
            }).ToList()
        };

        return (true, employeeData, "Success");
    }
}
