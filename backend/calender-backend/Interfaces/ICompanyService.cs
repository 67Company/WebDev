public interface ICompanyService
{
    Task<Company> GetCompanyByIdAsync(int id);
    Task<bool> UpdateCompanyInfoAsync(Company updatedCompany);
}