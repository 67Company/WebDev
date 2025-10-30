using Microsoft.AspNetCore.Mvc;
using calender_backend.Models;
using calender_backend.Data;

namespace calender_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
	private readonly EmployeeService _employeeService;

	public EmployeeController(CalenderContext context)
	{
		_employeeService = new EmployeeService(context);
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Employee>>> GetAll()
	{
		var employees = await _employeeService.GetAllEmployeesAsync();
		return Ok(employees);
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Employee>> GetById(int id)
	{
		var employee = await _employeeService.GetEmployeeByIdAsync(id);
		if (employee == null)
			return NotFound();
		return Ok(employee);
	}

	[HttpGet("email/{email}")]
	public async Task<ActionResult<Employee>> GetByEmail(string email)
	{
		var employee = await _employeeService.GetEmployeeByEmailAsync(email);
		if (employee == null)
			return NotFound();
		return Ok(employee);
	}

	[HttpGet("stats/{id}")]
	public async Task<ActionResult<EmployeeStatsDTO>> GetStats(int id)
	{
		var stats = await _employeeService.GetEmployeeStatsAsync(id);
		if (stats == null)
			return NotFound();
		return Ok(stats);
	}

	[HttpPost]
	public async Task<ActionResult> Create([FromBody] Employee employee)
	{
		var result = await _employeeService.CreateEmployeeAsync(employee);
		if (!result)
			return BadRequest();
		return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
	}

	[HttpPut("{id}")]
	public async Task<ActionResult> Update(int id, [FromBody] Employee employee)
	{
		var result = await _employeeService.UpdateEmployeeAsync(id, employee);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("soft/{id}")]
	public async Task<ActionResult> SoftDelete(int id)
	{
		var result = await _employeeService.SoftDeleteEmployeeAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpDelete("hard/{id}")]
	public async Task<ActionResult> HardDelete(int id)
	{
		var result = await _employeeService.HardDeleteEmployeeAsync(id);
		if (!result)
			return NotFound();
		return NoContent();
	}

	[HttpPost("increment/{id}/{statName}")]
	public async Task<ActionResult> IncrementStat(int id, string statName)
	{
		var result = await _employeeService.IncrementEmployeeStatAsync(statName, id);
		if (!result)
			return BadRequest();
		return Ok();
	}

	[HttpPost("decrement/{id}/{statName}")]
	public async Task<ActionResult> DecrementStat(int id, string statName)
	{
		var result = await _employeeService.DecrementEmployeeStatAsync(statName, id);
		if (!result)
			return BadRequest();
		return Ok();
	}
}
