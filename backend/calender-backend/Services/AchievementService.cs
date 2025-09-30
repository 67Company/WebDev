using calender_backend.Models;

public class AchievementService : IAchievementService
{
    private readonly string _connectionString = "Data Source=achievement.db";

    public AchievementService()
    {
    }

    public Task<bool> CreateAchievementAsync(Achievement achievement)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAchievementAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Achievement>> GetAllAchievementsAsync(int companyId)
    {
        throw new NotImplementedException();
    }

    public Task<Achievement> GetAchievementByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateAchievementAsync(int id, Achievement achievement)
    {
        throw new NotImplementedException();
    }
}