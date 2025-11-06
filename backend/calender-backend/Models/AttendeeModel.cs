namespace calender_backend.Models;
public class Attendee
{
    public int EventId { get; set; }
    public int EmployeeId { get; set; }

    public Event? Event { get; set; }
    public Employee? Employee { get; set; }
}