namespace calender_backend.Models;
public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = "Title_Missing";
    public string Description { get; set; } = "Description_Missing";
    public DateTime Date { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = "Location_Missing";
    public int Capacity { get; set; }
    public int CompanyId { get; set; }

    public Company? Company { get; set; }
    public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>();
}

public class EventDTO
{
    public string Title { get; set; } = "Title_Missing";
    public string Description { get; set; } = "Description_Missing";
    public DateTime Date { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = "Location_Missing";
    public int Capacity { get; set; }
}

public class EventWithCapacityDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = "Title_Missing";
    public string Description { get; set; } = "Description_Missing";
    public DateTime Date { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Location { get; set; } = "Location_Missing";
    public int Capacity { get; set; }
    public int CurrentAttendees { get; set; }
    public bool IsFull { get; set; }
}