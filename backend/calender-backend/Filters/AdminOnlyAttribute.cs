namespace calender_backend.Filters;

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
