using calender_backend.Models;

public class EmployeeService : IEmployeeService
{
    
    private readonly string _connectionString = "Data Source=calendar.db";

    public EmployeeService() //eventually pass in the SQL shit
    {
    }

    public Task<bool> CreateEmployeeAsync(Employee employee)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SoftDeleteEmployeeAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> HardDeleteEmployeeAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Employee>> GetAllEmployeesAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Employee> GetEmployeeByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Employee> GetEmployeeByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public Task<EmployeeStatsDTO> GetEmployeeStatsAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> IncrementEmployeeStatAsync(string statName, int id)
    {
        throw new NotImplementedException();
    }
    
    public Task<bool> DecrementEmployeeStatAsync(string statName, int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateEmployeeAsync(int id, Employee employee)
    {
        throw new NotImplementedException();
    }
}