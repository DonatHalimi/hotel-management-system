using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;

namespace API.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _roles;

        public AuthAttribute(params string[] roles) => _roles = roles ?? Array.Empty<string>();

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!IsAuthenticated(user))
            {
                context.Result = CreateErrorResult(401, "Authentication required", "You must be logged in to access this resource");
                return;
            }

            if (_roles.Length > 0 && !IsAuthorized(user))
            {
                var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
                var (statusCode, error, message) = string.IsNullOrEmpty(userRole)
                    ? (403, "No role assigned", "User has no role assigned")
                    : (403, "Access denied", "Unauthorized access to this resource");

                context.Result = CreateErrorResult(statusCode, error, message);
            }
        }

        private static bool IsAuthenticated(ClaimsPrincipal user) =>
            user?.Identity?.IsAuthenticated == true;

        private bool IsAuthorized(ClaimsPrincipal user)
        {
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            return !string.IsNullOrEmpty(userRole) &&
                   _roles.Contains(userRole, StringComparer.OrdinalIgnoreCase);
        }

        private static ObjectResult CreateErrorResult(int statusCode, string error, string message) =>
            new(new { error, message }) { StatusCode = statusCode };
    }

    public class AdminOnlyAttribute : AuthAttribute
    {
        public AdminOnlyAttribute() : base("Admin") { }
    }

    public class UserOnlyAttribute : AuthAttribute
    {
        public UserOnlyAttribute() : base("User") { }
    }

    public class UserOrAdminAttribute : AuthAttribute
    {
        public UserOrAdminAttribute() : base("User", "Admin") { }
    }
}