using Microsoft.EntityFrameworkCore;
using calender_backend.Data;
using calender_backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<CalenderContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("CalenderDatabase")));
builder.Services.AddScoped<calender_backend.Interfaces.IAuthService, calender_backend.Services.AuthService>();
builder.Services.AddControllersWithViews();

// Add session support
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(24); // Session timeout
    options.Cookie.HttpOnly = true; // Makes cookie inaccessible to JavaScript
    options.Cookie.IsEssential = true; // Required for session to work
    options.Cookie.SameSite = SameSiteMode.Lax; // Allow same-site requests
    options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Set to Always in production with HTTPS
    options.Cookie.Name = ".CalendarApp.Session"; // Custom cookie name
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for cookies
    });
});

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

using var scope = app.Services.CreateScope();
var calenderContext = scope.ServiceProvider.GetRequiredService<CalenderContext>();
calenderContext.Database.Migrate();

// Seed initial data
DatabaseSeeder.SeedData(calenderContext);

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
app.UseCors("AllowFrontend");

// Enable session middleware (must be before UseAuthorization)
app.UseSession();

app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

// Make Program accessible to integration tests
public partial class Program { }