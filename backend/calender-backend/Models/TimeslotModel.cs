namespace calender_backend.Models;
public class Timeslot //slots of 30 min
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}