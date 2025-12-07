using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FluentAssertions;
using Xunit;
using calender_backend.Models;
using calender_backend.Data;
using System.Threading.Tasks;

namespace calender_backend.Tests;

public class EmployeeControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;
    private static readonly string DatabaseName = $"EmployeeTestDb_{Guid.NewGuid()}";

    // Replaces the database with an in-memory database
    // Configures dependency injection (in memory DB context)
    // Creates an HttpClient
    public EmployeeControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");
            
            builder.ConfigureTestServices(services =>
            {
                // Remove the real SQLite database context registration
                var contextDescriptor = services.SingleOrDefault(d =>
                    d.ServiceType == typeof(DbContextOptions<CalenderContext>));
                if (contextDescriptor != null)
                {
                    services.Remove(contextDescriptor);
                }

                // Add in-memory database for testing - use fixed name so all tests share data
                services.AddDbContext<CalenderContext>(options =>
                {
                    options.UseInMemoryDatabase(DatabaseName);
                });
            });
        });

        _client = _factory.CreateClient();
    }

    // Creates a test employee with the specified email and companyId
    // Puts it in the in-memory database
    private async Task<Employee> SeedEmployee(int companyId, string email)
    {
        var employee = new Employee
        {
            Email = email,
            PasswordHash = "TestHash123",
            Admin = false,
            CompanyId = companyId,
            MeetingsAttended = 5,
            LargestTeamSize = 10,
            TotalMeetingTime = 20,
            EventsAttended = 3,
            EventsOrganized = 2,
            RoomsBooked = 7
        };

        var response = await _client.PostAsJsonAsync("/api/employee", employee);
        var createdEmployee = await response.Content.ReadFromJsonAsync<Employee>();
        return createdEmployee!;
    }

    // Test GET /api/employee/{id} endpoint retrieves the correct employee
    [Fact]
    public async Task GetById_ExistingId_ReturnOkWithEmployee()
    {
        // test data
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "test@example.com");

        // API call
        var response = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");

        // Verify the response
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var employee = await response.Content.ReadFromJsonAsync<Employee>();
        employee.Should().NotBeNull();
        employee!.Id.Should().Be(seededEmployee.Id);
        employee.Email.Should().Be("test@example.com");
    }

    // Test GET /api/employee/{id} with non-existing ID
    [Fact]
    public async Task GetById_NonExistingId_ReturnNotFound()
    {
        var response = await _client.GetAsync($"/api/employee/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // Test GET /api/employee/email/{email} endpoint
    [Fact]
    public async Task GetByEmail_ExistingEmail_ReturnOkWithEmployee()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "findme@example.com");

        var response = await _client.GetAsync($"/api/employee/email/{seededEmployee.Email}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var employee = await response.Content.ReadFromJsonAsync<Employee>();
        employee.Should().NotBeNull();
        employee!.Email.Should().Be("findme@example.com");
    }

    // Test GET /api/employee/email/{email} with non-existing email
    [Fact]
    public async Task GetByEmail_NonExistingEmail_ReturnNotFound()
    {
        var response = await _client.GetAsync($"/api/employee/email/nonexistent@example.com");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // Test GET /api/employee/stats/{id} endpoint
    [Fact]
    public async Task GetStats_ExistingEmployee_ReturnOkWithStats()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "stats@example.com");

        var response = await _client.GetAsync($"/api/employee/stats/{seededEmployee.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var stats = await response.Content.ReadFromJsonAsync<EmployeeStatsDTO>();
        stats.Should().NotBeNull();
        stats!.MeetingsAttended.Should().Be(5);
        stats.RoomsBooked.Should().Be(7);
    }

    // Test POST /api/employee endpoint
    [Fact]
    public async Task Create_ValidEmployee_ReturnCreatedEmployee()
    {
        var newEmployee = new Employee
        {
            Email = "newemployee@example.com",
            PasswordHash = "NewHash123",
            Admin = true,
            CompanyId = 1
        };

        var response = await _client.PostAsJsonAsync("/api/employee", newEmployee);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdEmployee = await response.Content.ReadFromJsonAsync<Employee>();
        createdEmployee.Should().NotBeNull();
        createdEmployee!.Email.Should().Be("newemployee@example.com");
        createdEmployee.Id.Should().BeGreaterThan(0);
    }

    // Test PUT /api/employee/{id} endpoint
    [Fact]
    public async Task Update_ValidEmployee_ReturnNoContent()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "update@example.com");

        var updatedEmployee = new Employee
        {
            Email = "updated@example.com",
            PasswordHash = "UpdatedHash",
            Admin = true,
            CompanyId = companyId
        };

        var response = await _client.PutAsJsonAsync($"/api/employee/{seededEmployee.Id}", updatedEmployee);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");
        var employee = await getResponse.Content.ReadFromJsonAsync<Employee>();
        employee!.Email.Should().Be("updated@example.com");
        employee.Admin.Should().BeTrue();
    }

    // Test PUT /api/employee/{id} with non-existing ID
    [Fact]
    public async Task Update_NonExistingEmployee_ReturnNotFound()
    {
        var updatedEmployee = new Employee
        {
            Email = "updated@example.com",
            PasswordHash = "UpdatedHash",
            CompanyId = 1
        };

        var response = await _client.PutAsJsonAsync($"/api/employee/9999", updatedEmployee);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // Test DELETE /api/employee/soft/{id} endpoint
    [Fact]
    public async Task SoftDelete_ExistingEmployee_ReturnNoContent()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "softdelete@example.com");

        var response = await _client.DeleteAsync($"/api/employee/soft/{seededEmployee.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // After soft delete, employee should not be retrievable via normal GET
        var getResponse = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // Test DELETE /api/employee/hard/{id} endpoint
    [Fact]
    public async Task HardDelete_ExistingEmployee_ReturnNoContent()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "harddelete@example.com");

        var response = await _client.DeleteAsync($"/api/employee/hard/{seededEmployee.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // Test POST /api/employee/increment/{id}/{statName} endpoint
    [Fact]
    public async Task IncrementStat_ValidStatName_ReturnOk()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "increment@example.com");
        var initialMeetings = seededEmployee.MeetingsAttended;

        var response = await _client.PostAsync($"/api/employee/increment/{seededEmployee.Id}/MeetingsAttended", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var getResponse = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");
        var employee = await getResponse.Content.ReadFromJsonAsync<Employee>();
        employee!.MeetingsAttended.Should().Be(initialMeetings + 1);
    }

    // Test POST /api/employee/decrement/{id}/{statName} endpoint
    [Fact]
    public async Task DecrementStat_ValidStatName_ReturnOk()
    {
        var companyId = 1;
        var seededEmployee = await SeedEmployee(companyId, "decrement@example.com");
        var initialRooms = seededEmployee.RoomsBooked;

        var response = await _client.PostAsync($"/api/employee/decrement/{seededEmployee.Id}/RoomsBooked", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var getResponse = await _client.GetAsync($"/api/employee/{seededEmployee.Id}");
        var employee = await getResponse.Content.ReadFromJsonAsync<Employee>();
        employee!.RoomsBooked.Should().Be(initialRooms - 1);
    }

    // Test GET /api/employee endpoint
    [Fact]
    public async Task GetAll_ReturnsAllEmployees()
    {
        await SeedEmployee(1, "employee1@example.com");
        await SeedEmployee(1, "employee2@example.com");
        await SeedEmployee(2, "employee3@example.com");

        var response = await _client.GetAsync("/api/employee");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var employees = await response.Content.ReadFromJsonAsync<List<Employee>>();
        employees.Should().NotBeNull();
        employees!.Count.Should().BeGreaterThanOrEqualTo(3);
    }
}