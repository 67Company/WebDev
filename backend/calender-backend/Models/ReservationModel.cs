public class Reservation
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int EmployeeId { get; set; }
    public int RoomId { get; set; }
    public int TimeslotId { get; set; }
    public int CompanyId { get; set; }
}