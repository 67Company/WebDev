public interface IEmployeeAchievementService
{
    Task<bool> AssignAchievementToEmployeeAsync(int employeeId, int achievementId);
    Task<bool> RemoveAchievementFromEmployeeAsync(int employeeId, int achievementId);
    Task<IEnumerable<Achievement>> GetAchievementsByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<Employee>> GetEmployeesByAchievementIdAsync(int achievementId);
}