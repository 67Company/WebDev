using calender_backend.Data;
using calender_backend.Models;

public class CompanyService : ICompanyService
{
    public readonly CalenderContext _context;
    public CompanyService(CalenderContext context)
    {
        _context = context;
    }

    public async Task<Company?> GetCompanyByIdAsync(int id)
    {
        Company? company = await _context.Companies.FindAsync(id);
        return company;
    }

    public async Task<bool> CreateCompanyAsync(Company company)
    {
        bool isCreated = await _context.Companies.AddAsync(company) != null;
        await _context.SaveChangesAsync();
        return isCreated;
    }

    public async Task<bool> UpdateCompanyInfoAsync(int id, Company company)
    {
        bool isUpdated = _context.Companies.Update(company) != null;
        await _context.SaveChangesAsync();
        return isUpdated;
    }

    public async Task<bool> SoftDeleteCompanyAsync(int id)
    {
        bool isDeleted = false;
        Company? company = await _context.Companies.FindAsync(id);
        if (company != null)
        {
            company.IsActive = false;
            isDeleted = _context.Companies.Update(company) != null;
            await _context.SaveChangesAsync();
        }
        return isDeleted;
    }

    public async Task<bool> HardDeleteCompanyAsync(int id)
    {
        bool isDeleted = false;
        Company? company = await _context.Companies.FindAsync(id);
        if (company != null && !company.IsActive)
        {
            _context.Companies.Remove(company);
            isDeleted = true;
            await _context.SaveChangesAsync();
        }
        return isDeleted;
    }
}