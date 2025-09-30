using calender_backend.Models;

public class EmployeeAchievementService : IEmployeeAchievementService
{
    private readonly string _connectionString = "Data Source=employeeAchievements.db";

    public EmployeeAchievementService()
    {
    }

    public Task<bool> AssignAchievementToEmployeeAsync(int employeeId, int achievementId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> RemoveAchievementFromEmployeeAsync(int employeeId, int achievementId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Achievement>> GetAchievementsByEmployeeIdAsync(int employeeId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Employee>> GetEmployeesByAchievementIdAsync(int achievementId)
    {
        throw new NotImplementedException();
    }
}