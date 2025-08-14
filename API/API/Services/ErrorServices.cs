using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net;

namespace API.Services
{
    public static class ErrorServices
    {
        public static IActionResult CreateEntityErrorResponse(string entityName, string errorCode, bool isPlural = false, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            string displayName = isPlural ? entityName.ToPlural() : entityName;

            var messages = new Dictionary<string, string>
            {
                {"UPDATE_ERROR", $"Failed to update {displayName.ToLower()}"},
                {"DELETE_ERROR", $"Failed to delete {displayName.ToLower()}"},
                {"DELETE_BULK_ERROR", $"No matching {displayName.ToLower()} found"},
            };

            return new ObjectResult(new
            {
                ErrorCode = $"{entityName.ToUpper()}_{errorCode}",
                Message = messages.GetValueOrDefault(errorCode, "An error occurred")
            })
            {
                StatusCode = (int)statusCode
            };
        }
    }
}