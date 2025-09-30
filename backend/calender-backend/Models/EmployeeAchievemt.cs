namespace calender_backend.Models;
public class EmployeeAchievement
{
    public int EmployeeId { get; set; }
    public int AchievementId { get; set; }
    public DateTime DateAchieved { get; set; }
    public int CompanyId { get; set; }

    public Employee Employee { get; set; } = null!;
    public Achievement Achievement { get; set; } = null!;
    public Company Company { get; set; } = null!;
}

public class EmployeeAchievementDTO
{
    public int EmployeeId { get; set; }
    public int AchievementId { get; set; }
    public DateTime DateAchieved { get; set; }
}