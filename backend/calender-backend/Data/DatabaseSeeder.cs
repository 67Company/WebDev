using calender_backend.Models;
using static BCrypt.Net.BCrypt;

namespace calender_backend.Data;

public static class DatabaseSeeder
{
    public static void SeedData(CalenderContext context)
    {
        // Only seed if database is empty
        if (context.Companies.Any())
        {
            Console.WriteLine($"Database already contains {context.Companies.Count()} companies - skipping seed");
            return;
        }

        Console.WriteLine("Seeding database with initial company and achievements");

        // Seed company
        var company = SeedCompany(context);
        
        // Seed achievements for the company
        SeedAchievements(context, company.Id);
        
        // Seed employees for the company
        SeedEmployees(context, company.Id);

        Console.WriteLine($"✓ Seeded company '{company.Name}' (ID: {company.Id})");
    }

    private static Company SeedCompany(CalenderContext context)
    {
        var company = new Company
        {
            Name = "TechCorp Solutions",
            Key = "techcorp-2026",
            IsActive = true
        };

        context.Companies.Add(company);
        context.SaveChanges();

        return company;
    }

    private static void SeedAchievements(CalenderContext context, int companyId)
    {
        var achievements = new List<Achievement>
        {
            new Achievement
            {
                Title = "Meeting Master",
                Description = "Attend 50 meetings",
                Icon = "/icons/meeting-master.png",
                StatToTrack = "MeetingsAttended",
                Threshold = 50,
                CompanyId = companyId
            },
            new Achievement
            {
                Title = "Room Booker Pro",
                Description = "Book 25 meeting rooms",
                Icon = "/icons/room-booker.png",
                StatToTrack = "RoomsBooked",
                Threshold = 25,
                CompanyId = companyId
            },
            new Achievement
            {
                Title = "Event Organizer",
                Description = "Organize 10 company events",
                Icon = "/icons/event-organizer.png",
                StatToTrack = "EventsOrganized",
                Threshold = 10,
                CompanyId = companyId
            },
            new Achievement
            {
                Title = "Team Builder",
                Description = "Lead a team of 20+ people",
                Icon = "/icons/team-builder.png",
                StatToTrack = "LargestTeamSize",
                Threshold = 20,
                CompanyId = companyId
            },
            new Achievement
            {
                Title = "Time Investor",
                Description = "Spend 100+ hours in meetings",
                Icon = "/icons/time-investor.png",
                StatToTrack = "TotalMeetingTime",
                Threshold = 100,
                CompanyId = companyId
            },
            new Achievement
            {
                Title = "Event Enthusiast",
                Description = "Attend 30 company events",
                Icon = "/icons/event-enthusiast.png",
                StatToTrack = "EventsAttended",
                Threshold = 30,
                CompanyId = companyId
            }
        };

        context.Achievements.AddRange(achievements);
        context.SaveChanges();

        Console.WriteLine($"✓ Seeded {achievements.Count} achievements");
    }

    private static void SeedEmployees(CalenderContext context, int companyId)
    {
        var employees = new List<Employee>
        {
            new Employee
            {
                Email = "admin@techcorp.com",
                PasswordHash = HashPassword("password_admin"),
                Admin = true,
                MeetingsAttended = 45,
                LargestTeamSize = 25,
                TotalMeetingTime = 95,
                EventsAttended = 28,
                EventsOrganized = 12,
                RoomsBooked = 30,
                CompanyId = companyId,
                IsDeleted = false
            },
            new Employee
            {
                Email = "john.doe@techcorp.com",
                PasswordHash = HashPassword("password_john"),
                Admin = false,
                MeetingsAttended = 32,
                LargestTeamSize = 15,
                TotalMeetingTime = 68,
                EventsAttended = 18,
                EventsOrganized = 5,
                RoomsBooked = 22,
                CompanyId = companyId,
                IsDeleted = false
            },
            new Employee
            {
                Email = "jane.smith@techcorp.com",
                PasswordHash = HashPassword("password_jane"),
                Admin = false,
                MeetingsAttended = 58,
                LargestTeamSize = 12,
                TotalMeetingTime = 112,
                EventsAttended = 35,
                EventsOrganized = 8,
                RoomsBooked = 18,
                CompanyId = companyId,
                IsDeleted = false
            },
            new Employee
            {
                Email = "mike.johnson@techcorp.com",
                PasswordHash = HashPassword("password_mike"),
                Admin = false,
                MeetingsAttended = 12,
                LargestTeamSize = 5,
                TotalMeetingTime = 24,
                EventsAttended = 8,
                EventsOrganized = 2,
                RoomsBooked = 6,
                CompanyId = companyId,
                IsDeleted = false
            },
            new Employee
            {
                Email = "sarah.williams@techcorp.com",
                PasswordHash = HashPassword("password_sarah"),
                Admin = true,
                MeetingsAttended = 51,
                LargestTeamSize = 22,
                TotalMeetingTime = 105,
                EventsAttended = 31,
                EventsOrganized = 15,
                RoomsBooked = 27,
                CompanyId = companyId,
                IsDeleted = false
            },
            new Employee
            {
                Email = "david.brown@techcorp.com",
                PasswordHash = HashPassword("password_david"),
                Admin = false,
                MeetingsAttended = 28,
                LargestTeamSize = 8,
                TotalMeetingTime = 54,
                EventsAttended = 15,
                EventsOrganized = 3,
                RoomsBooked = 14,
                CompanyId = companyId,
                IsDeleted = false
            }
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();

        Console.WriteLine($"✓ Seeded {employees.Count} employees");
    }
}
