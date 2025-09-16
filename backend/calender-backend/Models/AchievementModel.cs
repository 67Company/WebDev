public class Achievement()
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; } // URL or path to icon image
    public string EmployeeField { get; set; }
    public int Threshold { get; set; }
    public int CompanyId { get; set; }
}

public class AchievementDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Icon { get; set; } // URL or path to icon image
    public string EmployeeField { get; set; }
    public int Threshold { get; set; }
}