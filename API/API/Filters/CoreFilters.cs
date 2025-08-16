using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace API.Filters
{
    public class SanitizeValidationErrorsFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is not BadRequestObjectResult badRequest)
                return;

            var errors = badRequest.Value switch
            {
                ValidationProblemDetails vpd => vpd.Errors
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Where(msg => !string.IsNullOrWhiteSpace(msg)).ToArray()
                    ),

                IEnumerable<object> list => list
                    .GroupBy(e => e.GetType().GetProperty("PropertyName")?.GetValue(e)?.ToString() ?? string.Empty)
                    .ToDictionary(
                        static g => g.Key,
                        g => g
                            .Select(e => e.GetType().GetProperty("ErrorMessage")?.GetValue(e)?.ToString())
                            .Where(msg => !string.IsNullOrWhiteSpace(msg))
                            .ToArray()
                    ),

                _ => null
            };

            if (errors != null) context.Result = new BadRequestObjectResult(new { Errors = errors });

            base.OnActionExecuted(context);
        }
    }
}
