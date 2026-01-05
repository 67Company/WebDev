using calender_backend.Models;

public interface IEmployeeService
{
    Task<IEnumerable<Employee>> GetAllEmployeesAsync();
    Task<Employee?> GetEmployeeByIdAsync(int id);
    Task<bool> CreateEmployeeAsync(Employee employee);
    Task<bool> UpdateEmployeeAsync(int id, Employee employee);
    Task<bool> SoftDeleteEmployeeAsync(int id);
    Task<bool> HardDeleteEmployeeAsync(int id);
    Task<Employee?> GetEmployeeByEmailAsync(string email);
    Task<EmployeeStatsDTO?> GetEmployeeStatsAsync(int id);
    Task<bool> IncrementEmployeeStatAsync(string statName, int id, int incrementBy = 1);
    Task<bool> DecrementEmployeeStatAsync(string statName, int id, int decrementBy = 1);
}