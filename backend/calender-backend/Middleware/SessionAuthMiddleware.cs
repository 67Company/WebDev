using Microsoft.AspNetCore.Http;

namespace calender_backend.Middleware;

public class SessionAuthMiddleware
{
    private readonly RequestDelegate _next;

    private static readonly string[] _excludedPrefixes =
    {
        "/api/auth/login",
        "/api/auth/logout",
        "/api/auth/session"
    };

    public SessionAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (RequiresSession(context) && !HasActiveSession(context))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { message = "Login required for write operations" });
            return;
        }

        await _next(context);
    }

    private static bool RequiresSession(HttpContext context)
    {
        if (HttpMethods.IsGet(context.Request.Method) || HttpMethods.IsHead(context.Request.Method) || HttpMethods.IsOptions(context.Request.Method))
        {
            return false;
        }

        var path = context.Request.Path.Value ?? string.Empty;
        return !_excludedPrefixes.Any(prefix => path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
    }

    private static bool HasActiveSession(HttpContext context)
    {
        return context.Session.GetInt32("UserId") != null;
    }
}
