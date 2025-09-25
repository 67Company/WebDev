using calender_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace calender_backend.Data;
public class CalenderContext : DbContext
{
    public CalenderContext(DbContextOptions<CalenderContext> options) : base(options)
    {
    }

    public DbSet<Timeslot> Timeslots { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<EmployeeAchievement> EmployeeAchievements { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Attendee> Attendees { get; set; }
    public DbSet<Reservation> Reservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EmployeeAchievement>()
            .HasKey(ea => new { ea.EmployeeId, ea.AchievementId });

        modelBuilder.Entity<Attendee>()
            .HasKey(a => new { a.EventId, a.EmployeeId });
    }
}