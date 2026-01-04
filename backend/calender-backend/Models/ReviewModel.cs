namespace calender_backend.Models;

public class Review
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int EmployeeId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5 star rating
    public DateTime CreatedAt { get; set; }

    public Event? Event { get; set; }
    public Employee? Employee { get; set; }
}

public class ReviewDTO
{
    public int EventId { get; set; }
    public int EmployeeId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
}

public class ReviewWithEmployeeDTO
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeEmail { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}
