using calender_backend.Models;

public interface IAchievementService
{
    Task<IEnumerable<Achievement>> GetAllAchievementsAsync(int companyId);
    Task<Achievement?> GetAchievementByIdAsync(int id);
    Task<bool> CreateAchievementAsync(Achievement achievement);
    Task<bool> UpdateAchievementAsync(int id, Achievement achievement);
    Task<bool> DeleteAchievementAsync(int id);
}