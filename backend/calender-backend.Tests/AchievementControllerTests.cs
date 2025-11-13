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

public class AchievementControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public AchievementControllerTests(WebApplicationFactory<Program> factory)
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

    private async Task<Achievement> SeedAchievement(int companyId, string title)
    {
        var achievement = new Achievement
        {
            Title = title,
            Description = "Test Description",
            Icon = "test-icon",
            StatToTrack = "test-stat",
            Threshold = 10,
            CompanyId = companyId
        };

        var response = await _client.PostAsJsonAsync($"/api/achievement?companyId={companyId}", achievement);
        var createdAchievement = await response.Content.ReadFromJsonAsync<Achievement>();
        return createdAchievement!;
    }

    [Fact]
    public async Task GetById_ExistingId_ReturnOkWithAchievement()
    {
        var companyId = 1;
        var seededAchievement = await SeedAchievement(companyId, "Test Achievement");

        var response = await _client.GetAsync($"/api/achievement/{seededAchievement.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var achievement = await response.Content.ReadFromJsonAsync<Achievement>();
        achievement.Should().NotBeNull();
        achievement!.Id.Should().Be(seededAchievement.Id);
        achievement.Title.Should().Be("Test Achievement");
    }

    [Fact]
    public async Task GetById_NonExistingId_ReturnNotFound()
    {
        var response = await _client.GetAsync($"/api/achievement/9999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }


    [Fact]
    public async Task Create_ValidAchievement_ReturnCreatedAchievement()
    {
        var companyId = 1;
        var newAchievement = new Achievement
        {
            Title = "New Achievement",
            Description = "New Description",
            Icon = "new-icon",
            StatToTrack = "new-stat",
            Threshold = 20,
            CompanyId = companyId
        };

        var response = await _client.PostAsJsonAsync($"/api/achievement?companyId={companyId}", newAchievement);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdAchievement = await response.Content.ReadFromJsonAsync<Achievement>();
        createdAchievement.Should().NotBeNull();
        createdAchievement!.Title.Should().Be("New Achievement");
    }

    [Fact]
    public async Task Create_InvalidAchievement_ReturnBadRequest()
    {
        var companyId = 1;
        var newAchievement = new Achievement
        {
            // Missing Title
            Description = "New Description",
            Icon = "new-icon",
            StatToTrack = "new-stat",
            Threshold = 20,
            CompanyId = companyId
        };

        var response = await _client.PostAsJsonAsync($"/api/achievement?companyId={companyId}", newAchievement);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Update_ValidAchievement_ReturnOk()
    {
        var companyId = 1;
        var seededAchievement = await SeedAchievement(companyId, "Old Achievement");

        var updatedAchievement = new Achievement
        {
            Title = "Updated Achievement",
            Description = "Updated Description",
            Icon = "updated-icon",
            StatToTrack = "updated-stat",
            Threshold = 30
        };

        var response = await _client.PutAsJsonAsync($"/api/achievement/{seededAchievement.Id}", updatedAchievement);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/achievement/{seededAchievement.Id}");
        var achievement = await getResponse.Content.ReadFromJsonAsync<Achievement>();
        achievement!.Title.Should().Be("Updated Achievement");
    }

    [Fact]
    public async Task Update_NonExistingAchievement_ReturnNotFound()
    {
        var updatedAchievement = new Achievement
        {
            Title = "Updated Achievement",
            Description = "Updated Description",
            Icon = "updated-icon",
            StatToTrack = "updated-stat",
            Threshold = 30
        };

        var response = await _client.PutAsJsonAsync($"/api/achievement/9999", updatedAchievement);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_ExistingAchievement_ReturnNoContent()
    {
        var companyId = 1;
        var seededAchievement = await SeedAchievement(companyId, "Achievement to Delete");

        var response = await _client.DeleteAsync($"/api/achievement/{seededAchievement.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await _client.GetAsync($"/api/achievement/{seededAchievement.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}