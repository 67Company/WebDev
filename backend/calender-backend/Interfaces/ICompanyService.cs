using calender_backend.Models;

public interface ICompanyService
{
    Task<Company?> GetCompanyByIdAsync(int id);
    Task<bool> UpdateCompanyInfoAsync(int id, Company updatedCompany);
    Task<bool> CreateCompanyAsync(Company company);
    Task<bool> SoftDeleteCompanyAsync(int id);
    Task<bool> HardDeleteCompanyAsync(int id);
}