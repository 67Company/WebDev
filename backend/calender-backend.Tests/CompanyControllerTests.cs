using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FluentAssertions;
using Xunit;
using calender_backend.Models;
using calender_backend.Data;
using System.Threading.Tasks;

namespace calender_backend.Tests;

public class CompanyControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public CompanyControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(database =>
                    database.ServiceType ==
                    typeof(DbContextOptions<CalenderDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<CalenderDbContext>(options =>
                {
                    options.UseInMemoryDatabase($"InMemoryTestDb{Guid.NewGuid()}");
                });

                var serviceProvider = services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<CalenderDbContext>();
                dbContext.Database.EnsureCreated();
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetById_ExistingId_ReturnOkWithCompany()
    {
        var company = await SeedCompany("FromSoftware", "DS3");

        var response = await _client.GetAsync($"/api/company/{company.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var returnedCompany = await response.Content.ReadFromJsonAsync<Company>();
        returnedCompany.Should().NotBeNull();
        returnedCompany!.Id.Should().Be(company.Id);
        returnedCompany.Name.Should().Be("FromSoftware");
        returnedCompany.Key.Should().Be("DS3");
        returnedCompany.Active.Should().BeTrue();
    }

    [Fact]
    public async Task GetById_NonExistingId_ReturnNotFound()
    {
        var response = await _client.GetAsync($"/api/company/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_ValidCompany_ReturnCreatedCompany()
    {
        var newCompany = new Company
        {
            Name = "Team Cherry",
            Key = "Skonger",

        };

        var response = await _client.PostAsJsonAsync<Company>("/api/company", newCompany);
    }
}
