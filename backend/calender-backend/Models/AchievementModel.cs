namespace calender_backend.Models;
public class Achievement()
{
    public int Id { get; set; }
    public string Title { get; set; } = "Title_Missing";
    public string Description { get; set; } = "Description_Missing";
    public string? Icon { get; set; } // URL or path to icon image
    public string StatToTrack { get; set; } = "Field_Missing"; // e.g., "RoomsBooked", "MeetingsAttended"
    public int Threshold { get; set; }
    public int CompanyId { get; set; }

    public Company Company { get; set; } = null!;
    public ICollection<EmployeeAchievement> EmployeeAchievements { get; set; } = new List<EmployeeAchievement>();
}

public class AchievementDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string? Icon { get; set; }
    public string StatToTrack { get; set; }
    public int Threshold { get; set; }
}