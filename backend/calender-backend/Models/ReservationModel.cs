namespace calender_backend.Models;
public class Reservation
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int EmployeeId { get; set; }
    public int RoomId { get; set; }
    public int TimeslotId { get; set; }
    public int CompanyId { get; set; }

    public Employee Employee { get; set; } = null!;
    public Room Room { get; set; } = null!;
    public Timeslot Timeslot { get; set; } = null!;
    public Company Company { get; set; } = null!;
}