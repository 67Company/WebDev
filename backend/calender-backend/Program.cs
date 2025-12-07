using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using calender_backend.Data;
using calender_backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Only register SQLite if not in Testing environment
if (!builder.Environment.EnvironmentName.Equals("Testing", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddDbContext<CalenderContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("CalenderDatabase")));
}
else
{
    // Register DbContext without a provider for Testing environment
    // The test project will configure the provider using ConfigureTestServices
    builder.Services.AddDbContext<CalenderContext>();
}
builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Calendar Backend API",
        Version = "v1",
        Description = "API for managing calendar, events, rooms, reservations, employees, and achievements"
    });
});

var app = builder.Build();

// Only run migrations if not in test environment
if (!app.Environment.EnvironmentName.Equals("Testing", StringComparison.OrdinalIgnoreCase))
{
    using var scope = app.Services.CreateScope();
    var calenderContext = scope.ServiceProvider.GetRequiredService<CalenderContext>();
    calenderContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Calendar Backend API V1");
        c.RoutePrefix = "swagger";
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

// Program accessible to test project
public partial class Program { }