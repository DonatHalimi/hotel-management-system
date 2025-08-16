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

            if (user?.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedObjectResult(new
                {
                    error = "Authentication required",
                    message = "You must be logged in to access this resource"
                });
                return;
            }

            if (_roles.Length > 0)
            {
                var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userRole))
                {
                    context.Result = new ObjectResult(new
                    {
                        error = "No role assigned",
                        message = "User has no role assigned"
                    })
                    {
                        StatusCode = 403
                    };
                    return;
                }

                if (!_roles.Contains(userRole, StringComparer.OrdinalIgnoreCase))
                {
                    context.Result = new ObjectResult(new
                    {
                        error = "Access denied",
                        message = "Unauthorized access to this resource"
                    })
                    {
                        StatusCode = 403
                    };
                    return;
                }
            }
        }
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