using calender_backend.Models;

public class CompanyService : ICompanyService
{
    private readonly string _connectionString = "Data Source=company.db";

    public CompanyService()
    {
    }

    public Task<Company> GetCompanyByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> CreateCompanyAsync(Company company)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateCompanyInfoAsync(int id, Company company)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SoftDeleteCompanyAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> HardDeleteCompanyAsync(int id)
    {
        throw new NotImplementedException();
    }
} //eventually