using calender_backend.Models;

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

        Console.WriteLine("Seeding database with initial company and achievements...");

        // Seed company
        var company = SeedCompany(context);
        
        // Seed achievements for the company
        SeedAchievements(context, company.Id);

        Console.WriteLine($"✓ Seeded company '{company.Name}' (ID: {company.Id})");
    }

    private static Company SeedCompany(CalenderContext context)
    {
        var company = new Company
        {
            Name = "TechCorp Solutions",
            Key = "techcorp-2024",
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
}
