using System;
using Microsoft.Data.Sqlite;

namespace CompanyApp
{
    public static class DatabaseInitializer
    {
        public static void Initialize()
        {
            using (var connection = new SqliteConnection("Data Source=app.db"))
            {
                connection.Open();

                using (var command = connection.CreateCommand())
                {
                    // Enable FK support
                    command.CommandText = "PRAGMA foreign_keys = ON;";
                    command.ExecuteNonQuery();

                    command.CommandText = @"
                    CREATE TABLE IF NOT EXISTS Companies (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL,
                        Key TEXT NOT NULL UNIQUE
                    );

                    CREATE TABLE IF NOT EXISTS TimeSlots (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        StartTime TEXT NOT NULL,
                        EndTime TEXT NOT NULL
                    );

                    CREATE TABLE IF NOT EXISTS Achievements (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Title TEXT NOT NULL,
                        Description TEXT NOT NULL,
                        Icon TEXT,
                        StatToTrack TEXT NOT NULL,
                        Threshold INTEGER NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS Employees (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Email TEXT NOT NULL,
                        PasswordHash TEXT NOT NULL,
                        Admin INTEGER NOT NULL,
                        MeetingsAttended INTEGER NOT NULL,
                        LargestTeamSize INTEGER NOT NULL,
                        TotalMeetingTime INTEGER NOT NULL,
                        EventsAttended INTEGER NOT NULL,
                        EventsOrganized INTEGER NOT NULL,
                        RoomsBooked INTEGER NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS EmployeeAchievements (
                        EmployeeId INTEGER NOT NULL,
                        AchievementId INTEGER NOT NULL,
                        DateAchieved TEXT NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        PRIMARY KEY(EmployeeId, AchievementId),
                        FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE CASCADE,
                        FOREIGN KEY (AchievementId) REFERENCES Achievements(Id) ON DELETE CASCADE,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS Events (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Title TEXT NOT NULL,
                        Description TEXT NOT NULL,
                        Date TEXT NOT NULL,
                        StartTime TEXT NOT NULL,
                        EndTime TEXT NOT NULL,
                        Location TEXT NOT NULL,
                        Capacity INTEGER NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS Rooms (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL,
                        Capacity INTEGER NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );

                    CREATE TABLE IF NOT EXISTS Reservations (
                        Id INTEGER PRIMARY KEY AUTOINCREMENT,
                        Date TEXT NOT NULL,
                        EmployeeId INTEGER NOT NULL,
                        RoomId INTEGER NOT NULL,
                        TimeslotId INTEGER NOT NULL,
                        CompanyId INTEGER NOT NULL,
                        FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE CASCADE,
                        FOREIGN KEY (RoomId) REFERENCES Rooms(Id) ON DELETE CASCADE,
                        FOREIGN KEY (TimeslotId) REFERENCES TimeSlots(Id) ON DELETE CASCADE,
                        FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE
                    );
                    ";
                    command.ExecuteNonQuery();
                }

                Console.WriteLine("✅ Database and tables initialized (using Microsoft.Data.Sqlite)!");
            }
        }
    }
}