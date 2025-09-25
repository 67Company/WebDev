namespace calender_backend.Models;
public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = "Name_Missing";
    public int Capacity { get; set; }
    public int CompanyId { get; set; }

    public Company Company { get; set; } = null!;
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}

public class RoomDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }
}