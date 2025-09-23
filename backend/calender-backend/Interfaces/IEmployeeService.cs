public interface IEmployeeService
{
    Task<IEnumerable<Employee>> GetAllEmployeesAsync();
    Task<Employee> GetEmployeeByIdAsync(int id);
    Task<bool> CreateEmployeeAsync(Employee employee);
    Task<bool> UpdateEmployeeAsync(int id, Employee employee);
    Task<bool> SoftDeleteEmployeeAsync(int id);
    Task<bool> HardDeleteEmployeeAsync(int id);
    Task<Employee> GetEmployeesByEmailAsync(string email);
    Task<EmployeeStatsDTO> GetEmployeeStatsAsync(int id);
    Task<bool> IncrementEmployeeStatAsync(string statName, int id);
    Task<bool> DecrementEmployeeStatAsync(string statName, int id);
}