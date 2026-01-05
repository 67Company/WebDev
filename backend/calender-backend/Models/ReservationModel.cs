using System.Text.Json.Serialization;

namespace calender_backend.Models;
public class Reservation
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int EmployeeId { get; set; }
    public int RoomId { get; set; }
    public int TimeslotId { get; set; }
    public int CompanyId { get; set; }

    [JsonIgnore]
    public Employee? Employee { get; set; }
    public Room? Room { get; set; }
    public Timeslot? Timeslot { get; set; }
    [JsonIgnore]
    public Company? Company { get; set; }
}

public class ReservationResultDTO
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int EmployeeId { get; set; }
    public int RoomId { get; set; }
    public int TimeslotId { get; set; }
    public int CompanyId { get; set; }
}

public class BookReservationRequest
{
    public DateTime Date { get; set; }
    public int TimeslotId { get; set; }
    public int RoomId { get; set; }
}