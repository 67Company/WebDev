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

        // Seed supporting data for reservations
        SeedRooms(context, company.Id);
        SeedTimeslots(context);
        
        // Seed timeslots (common for all companies)
        SeedTimeslots(context);
        
        // Seed rooms for the company
        SeedRooms(context, company.Id);
        
        // Seed achievements for the company
        SeedAchievements(context, company.Id);
        
        // Seed employees for the company
        SeedEmployees(context, company.Id);
        
        // Seed events for the company
        SeedEvents(context, company.Id);
        // Seed event attendees for testing
        SeedEventAttendees(context);
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

    private static void SeedRooms(CalenderContext context, int companyId)
    {
        if (context.Rooms.Any(r => r.CompanyId == companyId))
        {
            Console.WriteLine("Rooms already exist - skipping room seed");
            return;
        }

        var rooms = new List<Room>
        {
            new Room { Name = "Conference Room A", Capacity = 12, CompanyId = companyId },
            new Room { Name = "Conference Room B", Capacity = 8, CompanyId = companyId },
            new Room { Name = "Executive Boardroom", Capacity = 16, CompanyId = companyId },
            new Room { Name = "Focus Room", Capacity = 4, CompanyId = companyId },
            new Room { Name = "Training Lab", Capacity = 20, CompanyId = companyId }
        };

        context.Rooms.AddRange(rooms);
        context.SaveChanges();

        Console.WriteLine($"✓ Seeded {rooms.Count} rooms");
    }

    private static void SeedTimeslots(CalenderContext context)
    {
        if (context.Timeslots.Any())
        {
            Console.WriteLine($"Timeslots already exist - skipping seed ({context.Timeslots.Count()} found)");
            return;
        }

        var timeslots = new List<Timeslot>();
        var start = DateTime.Today.Date.AddHours(8);
        var end = DateTime.Today.Date.AddHours(18);

        var current = start;
        while (current < end)
        {
            timeslots.Add(new Timeslot
            {
                StartTime = current,
                EndTime = current.AddMinutes(30)
            });

            current = current.AddMinutes(30);
        }

        context.Timeslots.AddRange(timeslots);
        context.SaveChanges();

        Console.WriteLine($"✓ Seeded {timeslots.Count} timeslots");
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

    private static void SeedEvents(CalenderContext context, int companyId)
    {
        var baseDate = new DateTime(2026, 1, 1);
        
        var events = new List<Event>
        {
            new Event
            {
                Title = "Team Standup",
                Description = "Daily team sync and planning session",
                Date = baseDate.AddDays(5),
                StartTime = baseDate.AddDays(5).AddHours(9),
                EndTime = baseDate.AddDays(5).AddHours(10),
                Location = "Conference Room A",
                Capacity = 20,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Sprint Planning",
                Description = "Planning session for the upcoming sprint",
                Date = baseDate.AddDays(7),
                StartTime = baseDate.AddDays(7).AddHours(14),
                EndTime = baseDate.AddDays(7).AddHours(16),
                Location = "Conference Room B",
                Capacity = 15,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Client Presentation",
                Description = "Q4 results presentation for stakeholders",
                Date = baseDate.AddDays(10),
                StartTime = baseDate.AddDays(10).AddHours(11),
                EndTime = baseDate.AddDays(10).AddHours(12).AddMinutes(30),
                Location = "Main Hall",
                Capacity = 50,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Code Review Session",
                Description = "Review recent pull requests and discuss best practices",
                Date = baseDate.AddDays(12),
                StartTime = baseDate.AddDays(12).AddHours(15),
                EndTime = baseDate.AddDays(12).AddHours(16),
                Location = "Dev Room",
                Capacity = 10,
                CompanyId = companyId
            },
            new Event
            {
                Title = "All-Hands Meeting",
                Description = "Monthly company-wide update and Q&A",
                Date = baseDate.AddDays(15),
                StartTime = baseDate.AddDays(15).AddHours(10),
                EndTime = baseDate.AddDays(15).AddHours(11).AddMinutes(30),
                Location = "Auditorium",
                Capacity = 100,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Tech Workshop: Cloud Architecture",
                Description = "Hands-on workshop on modern cloud patterns",
                Date = baseDate.AddDays(20),
                StartTime = baseDate.AddDays(20).AddHours(13),
                EndTime = baseDate.AddDays(20).AddHours(17),
                Location = "Training Room",
                Capacity = 25,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Coffee & Code",
                Description = "Casual meetup to discuss side projects",
                Date = baseDate.AddDays(3),
                StartTime = baseDate.AddDays(3).AddHours(10),
                EndTime = baseDate.AddDays(3).AddHours(11),
                Location = "Cafeteria",
                Capacity = 30,
                CompanyId = companyId
            },
            new Event
            {
                Title = "Product Demo Day",
                Description = "Showcase new features to the team",
                Date = baseDate.AddDays(8),
                StartTime = baseDate.AddDays(8).AddHours(16),
                EndTime = baseDate.AddDays(8).AddHours(17),
                Location = "Main Hall",
                Capacity = 40,
                CompanyId = companyId
            },
        };

        context.Events.AddRange(events);
        context.SaveChanges();

        Console.WriteLine($"Seeded {events.Count} events");
    }

    private static void SeedEventAttendees(CalenderContext context)
    {
        // Check if attendees already exist
        if (context.Attendees.Any())
        {
            Console.WriteLine($"Attendees already exist - skipping attendee seed ({context.Attendees.Count()} found)");
            return;
        }

        // Get john's employee record
        var john = context.Employees.FirstOrDefault(e => e.Email == "john.doe@techcorp.com");
        if (john == null)
        {
            Console.WriteLine("John not found - skipping attendee seed");
            return;
        }

        // Get the first event (Coffee & Code - on Jan 3)
        var pastEvent = context.Events
            .Where(e => e.Title == "Coffee & Code")
            .FirstOrDefault();

        if (pastEvent == null)
        {
            Console.WriteLine("Coffee & Code event not found - skipping attendee seed");
            return;
        }

        // Add john as an attendee to the event
        var attendee = new Attendee
        {
            EventId = pastEvent.Id,
            EmployeeId = john.Id
        };

        context.Attendees.Add(attendee);
        context.SaveChanges();

        Console.WriteLine($"✓ Added John (ID: {john.Id}) as attendee to '{pastEvent.Title}' event");
    }
}
