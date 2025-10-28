namespace calender_backend.Models;
public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = "Name_Missing";
    public string Key { get; set; } = "Key_Missing"; // Unique key for the company
    public bool IsActive { get; set; } = true; // For soft deletion, when innactive we can clear the database of that company

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}

public class CompanyDTO
{
    public string Name { get; set; }
    public string Key { get; set; }
}