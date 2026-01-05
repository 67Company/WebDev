using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace calender_backend.Filters;

/// <summary>
/// Simple session-based admin gate. Returns 403 when the current session is not marked as admin.
/// </summary>
public class AdminOnlyAttribute : Attribute, IAsyncAuthorizationFilter
{
    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var isAdmin = context.HttpContext.Session.GetString("IsAdmin") == "True";
        if (!isAdmin)
        {
            context.Result = new JsonResult(new { message = "Admin access required" })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }

        return Task.CompletedTask;
    }
}
