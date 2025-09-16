public class Employee()
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public bool Admin { get; set; } = false;
    public int MeetingsAttended { get; set; } = 0;
    public int TeamAmount { get; set; } = 0;
    public int TotalMeetingTime { get; set; } = 0; // in hours
    public int EventsAttended { get; set; } = 0;
    public int EventsOrganized { get; set; } = 0;
      public int CompanyId { get; set; }
}

public class EmployeeDTO
{
    public int Id { get; set; }
    public string Email { get; set; }
}

public class EmployeeLoginDTO
{
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}

public class EmployeeStatsDTO
{
    public int MeetingsAttended { get; set; }
    public int TeamAmount { get; set; }
    public int TotalMeetingTime { get; set; } // in hours
    public int EventsAttended { get; set; }
    public int EventsOrganized { get; set; }
}