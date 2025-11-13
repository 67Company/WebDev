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
                    typeof(DbContextOptions<CalenderContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<CalenderContext>(options =>
                {
                    options.UseInMemoryDatabase($"InMemoryTestDb{Guid.NewGuid()}");
                });

                var serviceProvider = services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<CalenderContext>();
                dbContext.Database.EnsureCreated();
            });
        });

        _client = _factory.CreateClient();
    }

    private async Task<Company> SeedCompany(string name, string key,bool isActive = true)
    {
        var company = new CompanyDTO
        {
            Name = name,
            Key = key,
            IsActive = isActive
        };

        var response = await _client.PostAsJsonAsync<CompanyDTO>("/api/company", company);
        var createdCompany = await response.Content.ReadFromJsonAsync<Company>();
        
        return createdCompany!;
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
        returnedCompany.IsActive.Should().BeTrue();
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
        var newCompany = new CompanyDTO
        {
            Name = "Team Cherry",
            Key = "HKSS",

        };

        var response = await _client.PostAsJsonAsync<CompanyDTO>("/api/company", newCompany);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdCompany = response.Content.ReadFromJsonAsync<Company>().Result;
        createdCompany.Should().NotBeNull();
        createdCompany!.Id.Should().BeGreaterThan(0);
        createdCompany!.Name.Should().Be("Team Cherry");
        createdCompany!.Key.Should().Be("HKSS");
        createdCompany!.IsActive.Should().BeTrue();

        var returnedCompany = await _client.GetAsync($"/api/company/{createdCompany.Id}");
        returnedCompany.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Update_ExistingCompany_ReturnNoContent()
    {
        var company = await SeedCompany("Activision", "CODMW");

        var companyUpdate = new CompanyDTO
        {
            Name = "Activision Blizzard",
            Key = "CODMW2",
        };

        var response = await _client.PutAsJsonAsync<CompanyDTO>($"/api/company/{company.Id}", companyUpdate);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/company/{company.Id}");
        var updatedCompany = await getResponse.Content.ReadFromJsonAsync<Company>();

        updatedCompany.Should().NotBeNull();
        updatedCompany!.Name.Should().Be("Activision Blizzard");
        updatedCompany!.Key.Should().Be("CODMW2");
        updatedCompany!.IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task Update_NonExistingCompany_ReturnNotFound()
    {
        var nonexistentId = 9999;
        var companyUpdate = new CompanyDTO
        {
            Name = "MorallyGoodEA",
            Key = "NoGambling4Kids",
        };

        var response = await _client.PutAsJsonAsync<CompanyDTO>($"/api/company/{nonexistentId}", companyUpdate);

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_InActiveCompany_ReturnNoContent()
    {
        var company = await SeedCompany("Ubisoft", "ACV", false);

        var response = await _client.DeleteAsync($"/api/company/hard/{company.Id}");

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/company/{company.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task SoftDelete_ExistingCompany_ReturnNoContent()
    {
        var company = await SeedCompany("Bandcamp", "MUSIC");

        var response = await _client.DeleteAsync($"/api/company/soft/{company.Id}");

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/company/{company.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_IsActiveCompany_ReturnMethodNotAllowed()
    {
        var company = await SeedCompany("Nintendo", "ZeldaBOTW");

        var response = await _client.DeleteAsync($"/api/company/hard/{company.Id}");

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.MethodNotAllowed);
        
        var getResponse = await _client.GetAsync($"/api/company/{company.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var companyAfterDeleteAttempt = await getResponse.Content.ReadFromJsonAsync<Company>();
        companyAfterDeleteAttempt.Should().NotBeNull();
    }

    [Fact]
    public async Task HardDelete_NonExistent_ReturnNotFound()
    {
        var response = await _client.DeleteAsync($"/api/company/hard/999999");

        //ASSERT
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}

