using calender_backend.Data;

namespace calender_backend.Middleware;

public class AdminAuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public AdminAuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if this is a CUD operation
        var method = context.Request.Method;
        var path = context.Request.Path.Value ?? "";

        bool isCudOperation = (method == "POST" || method == "PUT" || method == "DELETE") &&
            !path.Contains("/join") && !path.Contains("/leave") && !path.Contains("/book") && !path.Contains("/assign") && !path.Contains("/remove") && !path.Contains("/increment") && !path.Contains("/decrement") && !path.Contains("/login") && !path.Contains("/me");

        if (isCudOperation)
        {
            // Extract employee ID from header or query
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
                await context.Response.WriteAsJsonAsync(new { message = "Employee ID is required" });
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

            // Check if employee exists and is admin
            var employee = await dbContext.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted);

            if (employee == null)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Employee not found" });
                return;
            }

            if (!employee.Admin)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { message = "Admin access required" });
                return;
            }
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
