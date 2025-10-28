using calender_backend.Models;
using calender_backend.Data;

public class AchievementService : IAchievementService
{
    private readonly CalenderContext _context;

    public AchievementService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateAchievementAsync(Achievement achievement)
    {
        bool isCreated = await _context.Achievements.AddAsync(achievement) != null;
        _context.SaveChanges();
        return isCreated;
    }

    public async Task<bool> DeleteAchievementAsync(int id)
    {
        bool isDeleted = false;
        Achievement? achievement = await _context.Achievements.FindAsync(id);
        if (achievement != null)
        {
            _context.Achievements.Remove(achievement);
            isDeleted = true;
            _context.SaveChanges();
        }
        return isDeleted;
    }

    public async Task<IEnumerable<Achievement>> GetAllAchievementsAsync(int companyId)
    {
        return _context.Achievements.Where(a => a.CompanyId == companyId).ToList();
    }

    public async Task<Achievement?> GetAchievementByIdAsync(int id)
    {
        Achievement? achievement = await _context.Achievements.FindAsync(id);
        return achievement;
    }

    public async Task<bool> UpdateAchievementAsync(int id, Achievement achievement)
    {
        bool isUpdated = _context.Achievements.Update(achievement) != null;
        _context.SaveChanges();
        return isUpdated;
    }
}