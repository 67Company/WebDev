using calender_backend.Models;

namespace calender_backend.Interfaces;

public interface IAuthService
{
    Task<(bool Success, EmployeeDTO? Employee, bool IsAdmin, string Message)> LoginAsync(string email, string password);
    Task<(bool Success, EmployeeDetailDTO? EmployeeData, string Message)> GetEmployeeDetailsAsync(int employeeId);
}
