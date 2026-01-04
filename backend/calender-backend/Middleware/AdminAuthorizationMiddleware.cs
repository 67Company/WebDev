using calender_backend.Data;
using Microsoft.EntityFrameworkCore;

namespace calender_backend.Middleware;

public class AdminAuthorizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private const string ADMIN_HEADER = "X-ADMIN";

    public AdminAuthorizationMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var method = context.Request.Method;
        var path = context.Request.Path.Value ?? "";

        // Skip authentication for login endpoint (case-insensitive)
        if (path.Contains("/login", StringComparison.OrdinalIgnoreCase) || 
            path.Contains("/Auth/login", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        // Check if this is an admin-only operation (CUD operations)
        bool isCudOperation = (method == "POST" || method == "PUT" || method == "DELETE") &&
            !path.Contains("/join") && !path.Contains("/leave") && !path.Contains("/book") && 
            !path.Contains("/assign") && !path.Contains("/remove") && 
            !path.Contains("/increment") && !path.Contains("/decrement") && !path.Contains("/me");

        // For admin-only operations, REQUIRE the X-ADMIN token
        if (isCudOperation)
        {
            var adminToken = context.Request.Headers[ADMIN_HEADER].FirstOrDefault();
            var expectedAdminToken = _configuration["AdminToken"] ?? "admin-secret-token-2026";

            if (string.IsNullOrEmpty(adminToken) || adminToken != expectedAdminToken)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Admin token required for this operation" });
                return;
            }
        }

        // For all requests (GET and non-admin POST), require employee authentication
        string? employeeIdStr = null;
        if (context.Request.Headers.TryGetValue("X-Employee-Id", out var headerValue))
        {
            employeeIdStr = headerValue.ToString();
        }
        else if (context.Request.Query.TryGetValue("employeeId", out var queryValue))
        {
            employeeIdStr = queryValue.ToString();
        }

        if (string.IsNullOrEmpty(employeeIdStr))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { message = "Authentication required: X-Employee-Id header or employeeId query parameter" });
            return;
        }

        if (!int.TryParse(employeeIdStr, out var employeeId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { message = "Invalid Employee ID" });
            return;
        }

        // Get DbContext from service provider
        using var scope = context.RequestServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CalenderContext>();

        // Check if employee exists
        var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted);

        if (employee == null)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { message = "Employee not found or deleted" });
            return;
        }

        await _next(context);
    }
}

public static class AdminAuthorizationMiddlewareExtensions
{
    public static IApplicationBuilder UseAdminAuthorization(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AdminAuthorizationMiddleware>();
    }
}
