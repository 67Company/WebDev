using Microsoft.EntityFrameworkCore;
using calender_backend.Data;
using calender_backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<CalenderContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("CalenderDatabase")));
builder.Services.AddControllersWithViews();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var calenderContext = scope.ServiceProvider.GetRequiredService<CalenderContext>();
calenderContext.Database.Migrate();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.Run();