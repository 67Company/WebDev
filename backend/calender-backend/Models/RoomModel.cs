public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = "Name_Missing";
    public int Capacity { get; set; }
    public int CompanyId { get; set; }

}

public class RoomDTO
{
    public string Name { get; set; }
    public int Capacity { get; set; }
}