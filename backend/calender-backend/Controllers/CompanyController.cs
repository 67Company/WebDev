using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;
using calender_backend.Filters;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
	private readonly CompanyService _companyService;

	public CompanyController(CalenderContext context)
	{
		_companyService = new CompanyService(context);
	}

	[HttpGet]
	public async Task<ActionResult<List<Company>>> GetAll()
	{
		var companies = await _companyService.GetAllCompaniesAsync();
		return Ok(companies);
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Company>> GetById(int id)
	{
		var company = await _companyService.GetCompanyByIdAsync(id);
		if (company == null)
			return NotFound();
		return Ok(company);
	}

	[HttpPost]
	[AdminOnly]
	public async Task<ActionResult> Create([FromBody] CompanyDTO companyDto)
	{
		var company = new Company
		{
			Name = companyDto.Name,
			Key = companyDto.Key
		};
		var result = await _companyService.CreateCompanyAsync(company);
		if (!result)
			return BadRequest();
		return CreatedAtAction(nameof(GetById), new { id = company.Id }, company);
	}

	[HttpPut("{id}")]
	[AdminOnly]
	public async Task<ActionResult> Update(int id, [FromBody] CompanyDTO companyDto)
	{
		var company = new Company
		{
			Name = companyDto.Name,
			Key = companyDto.Key
		};
		var result = await _companyService.UpdateCompanyInfoAsync(id, company);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("soft/{id}")]
	[AdminOnly]
	public async Task<ActionResult> SoftDelete(int id)
	{
		var result = await _companyService.SoftDeleteCompanyAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("hard/{id}")]
	[AdminOnly]
	public async Task<ActionResult> HardDelete(int id)
	{
		var result = await _companyService.HardDeleteCompanyAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}
}

