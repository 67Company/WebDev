using System.Text.Json.Serialization;

namespace calender_backend.Models;
    public class Employee()
    {
        public int Id { get; set; }
        public string Email { get; set; } = "Email_Missing";
        public string PasswordHash { get; set; } = "Hash_Missing";
        public bool Admin { get; set; } = false;
        public int MeetingsAttended { get; set; } = 0;
        public int LargestTeamSize { get; set; } = 0;
        public int TotalMeetingTime { get; set; } = 0; // in hours
        public int EventsAttended { get; set; } = 0;
        public int EventsOrganized { get; set; } = 0;
        public int RoomsBooked { get; set; } = 0;
        public int CompanyId { get; set; }
        public bool IsDeleted { get; set; } = false; // For soft deletion, when hard deleted clear database of relations

        public Company? Company { get; set; }
        public ICollection<Attendee> Attendances { get; set; } = new List<Attendee>();
        public ICollection<EmployeeAchievement> EmployeeAchievements { get; set; } = new List<EmployeeAchievement>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }

    public class EmployeeDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = "Email_Missing";
        public int CompanyId { get; set; }
    }

    public class EmployeeLoginDTO
    {
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
    }

    public class LoginResponseDTO
    {
        public EmployeeDTO Employee { get; set; } = new();
        public bool IsAdmin { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class EmployeeStatsDTO
    {
        public int MeetingsAttended { get; set; }
        public int TeamAmount { get; set; }
        public int TotalMeetingTime { get; set; } // in hours
        public int EventsAttended { get; set; }
        public int EventsOrganized { get; set; }
        public int RoomsBooked { get; set; }
    }

    public class AchievementUnlockedDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public DateTime? UnlockedAt { get; set; }
    }

    public class EmployeeDetailDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = "Email_Missing";
        public bool IsAdmin { get; set; }
        public int CompanyId { get; set; }
        public EmployeeStatsDTO Stats { get; set; } = new();
        public List<AchievementUnlockedDTO> Achievements { get; set; } = new();
    }
