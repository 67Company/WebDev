namespace calender_backend.Models;
public class EmployeeAchievement
{
    public int EmployeeId { get; set; }
    public int AchievementId { get; set; }
    public DateTime DateAchieved { get; set; }
    public int CompanyId { get; set; }

    public Employee? Employee { get; set; }
    public Achievement? Achievement { get; set; }
    public Company? Company { get; set; }
}

public class EmployeeAchievementDTO
{
    public int EmployeeId { get; set; }
    public int AchievementId { get; set; }
    public DateTime DateAchieved { get; set; }
}