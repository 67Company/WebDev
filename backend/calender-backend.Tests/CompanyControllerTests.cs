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
        var returnedCompany = await response.Content.ReadFromJsonAsync<Company>();

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.OK);
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

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_ValidCompany_ReturnCreatedCompany()
    {
        var newCompany = new Company
        {
            Name = "Team Cherry",
            Key = "HKSS",

        };

        var response = await _client.PostAsJsonAsync<Company>("/api/company", newCompany);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdCompany = response.Content.ReadFromJsonAsync<Company>().Result;
        createdCompany.Should().NotBeNull();
        createdCompany!.Id.Should().BeGreaterThan(0);
        createdCompany!.Name.Should().Be("Team Cherry");
        createdCompany!.Key.Should().Be("HKSS");
        createdCompany!.Active.Should().BeTrue();

        var response = await _client.GetAsync($"/api/company/{createdCompany.Id}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Update_ExistingCompany_ReturnNoContent()
    {
        var company = await SeedCompany("Activision", "CODMW");

        var companyUpdate = new CompanyDto
        {
            Name = "Activision Blizzard",
            Key = "CODMW2",
        };

        var response = await _client.PutAsJsonAsync<Company>($"/api/company/{company.Id}", company);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/company/{company.Id}");
        var updatedCompany = await getResponse.Content.ReadFromJsonAsync<Company>();

        updatedCompany.Should().NotBeNull();
        updatedCompany!.Name.Should().Be("Activision Blizzard");
        updatedCompany!.Key.Should().Be("CODMW2");
        updatedCompany!.Active.Should().BeTrue();
    }

    [Fact]
    public async Task Update_NonExistingCompany_ReturnNotFound()
    {
        var nonexistentId = 9999;
        var companyUpdate = new CompanyDto
        {
            Name = "MorallyGoodEA",
            Key = "NoGambling4Kids",
        };

        var response = await _client.PutAsJsonAsync<CompanyDTO>($"/api/company/{nonexistentId}", companyUpdate);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}

