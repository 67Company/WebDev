using calender_backend.Models;
using calender_backend.Data;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

public class EmployeeService : IEmployeeService
{
    
    private readonly CalenderContext _context;

    public EmployeeService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateEmployeeAsync(Employee employee)
    {
        bool isCreated = false;
        Employee? Employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == employee.Email);
        if (Employee != null)
        {
            return isCreated; // Employee with the same email already exists
        } else {
            // Hash password if it's plain text (not already hashed)
            if (!string.IsNullOrEmpty(employee.PasswordHash) && !employee.PasswordHash.StartsWith("$2"))
            {
                employee.PasswordHash = HashPassword(employee.PasswordHash);
            }
            isCreated = await _context.Employees.AddAsync(employee) != null;
            await _context.SaveChangesAsync();
        }
        return isCreated;
    }

    public async Task<bool> SoftDeleteEmployeeAsync(int id)
    {
        bool isDeleted = false;
        Employee? employee = await _context.Employees.FindAsync(id);
        if (employee != null)
        {
            employee.IsDeleted = true;
            isDeleted = _context.Employees.Update(employee) != null;
            await _context.SaveChangesAsync();
        }
        return isDeleted;
    }

    public async Task<bool> HardDeleteEmployeeAsync(int id)
    {
        bool isDeleted = false;
        Employee? employee = await _context.Employees.FindAsync(id);
        if (employee != null && employee.IsDeleted)
        {
            _context.Employees.Remove(employee);
            isDeleted = true;
            await _context.SaveChangesAsync();
        }
        return isDeleted;
    }

    public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
    {
        return await _context.Employees.Where(e => !e.IsDeleted).ToListAsync();
    }

    public async Task<Employee?> GetEmployeeByIdAsync(int id)
    {
        Employee? employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
        return employee;
    }

    public async Task<Employee?> GetEmployeeByEmailAsync(string email)
    {
        Employee? employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email && !e.IsDeleted);
        return employee;
    }

    public async Task<EmployeeStatsDTO?> GetEmployeeStatsAsync(int id)
    {
        Employee? employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
        if (employee == null)
        {
            return null;
        }

        EmployeeStatsDTO stats = new EmployeeStatsDTO
        {
            MeetingsAttended = employee.MeetingsAttended,
            TeamAmount = employee.LargestTeamSize,
            TotalMeetingTime = employee.TotalMeetingTime,
            EventsAttended =  employee.EventsAttended,
            EventsOrganized = employee.EventsOrganized,
            RoomsBooked = employee.RoomsBooked
        };

        return stats;
    }

    public async Task<bool> IncrementEmployeeStatAsync(string statName, int id, int incrementBy = 1)
    {
        bool isIncremented;
        Employee? employee = await _context.Employees.FindAsync(id);

        switch (statName.ToLower())
        {
            case "meetingsattended":
                employee!.MeetingsAttended += incrementBy;
                isIncremented = true;
                break;
            case "largestteamsize":
                employee!.LargestTeamSize += incrementBy;
                isIncremented = true;
                break;
            case "totalmeetingtime":
                employee!.TotalMeetingTime += incrementBy;
                isIncremented = true;
                break;
            case "eventsattended":
                employee!.EventsAttended += incrementBy;
                isIncremented = true;
                break;
            case "eventsorganized":
                employee!.EventsOrganized += incrementBy;
                isIncremented = true;
                break;
            case "roomsbooked":
                employee!.RoomsBooked += incrementBy;
                isIncremented = true;
                break;
            default:
                isIncremented = false;
                break;
        }
        return isIncremented;
    }
    
    public async Task<bool> DecrementEmployeeStatAsync(string statName, int id, int decrementBy = 1)
    {
        bool isDecremented = false;
        Employee? employee = await _context.Employees.FindAsync(id);

        switch (statName.ToLower())
        {
            case "meetingsattended":
                if (employee!.MeetingsAttended > 0)
                {
                    employee.MeetingsAttended -= decrementBy;
                    isDecremented = true;
                }
                break;
            case "largestteamsize":
                if (employee!.LargestTeamSize > 0)
                {
                    employee.LargestTeamSize -= decrementBy;
                    isDecremented = true;
                }
                break;
            case "totalmeetingtime":
                if (employee!.TotalMeetingTime > 0)
                {
                    employee.TotalMeetingTime -= decrementBy;
                    isDecremented = true;
                }
                break;
            case "eventsattended":
                if (employee!.EventsAttended > 0)
                {
                    employee.EventsAttended -= decrementBy;
                    isDecremented = true;
                }
                break;
            case "eventsorganized":
                if (employee!.EventsOrganized > 0)
                {
                    employee.EventsOrganized -= decrementBy;
                    isDecremented = true;
                }
                break;
            case "roomsbooked":
                if (employee!.RoomsBooked > 0)
                {
                    employee.RoomsBooked -= decrementBy;
                    isDecremented = true;
                }
                break;
            default:
                isDecremented = false;
                break;
        }
        return isDecremented;
    }

    public async Task<bool> UpdateEmployeeAsync(int id, Employee employee)
    {
        // Hash password if it's plain text (not already hashed) and not empty
        if (!string.IsNullOrEmpty(employee.PasswordHash) && !employee.PasswordHash.StartsWith("$2"))
        {
            employee.PasswordHash = HashPassword(employee.PasswordHash);
        }
        
        bool isUpdated = _context.Employees.Update(employee) != null;
        await _context.SaveChangesAsync();
        return isUpdated;
    }
}