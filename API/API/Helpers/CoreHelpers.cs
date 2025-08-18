using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class BulkDeleteHelper
    {
        public static async Task<IActionResult> ExecuteAsync<TEntity>(
            DbContext context,
            IEnumerable<Guid> ids,
            string entityName,
            string keyPropertyName)
            where TEntity : class
        {
            try
            {
                var set = context.Set<TEntity>();

                var entitiesToDelete = await set
                    .Where(e => ids.Contains(EF.Property<Guid>(e, keyPropertyName)))
                    .ToListAsync();

                if (entitiesToDelete.Count == 0)
                {
                    return ErrorServices.CreateEntityErrorResponse(
                        entityName: entityName,
                        errorCode: "DELETE_BULK_ERROR",
                        isPlural: true,
                        statusCode: HttpStatusCode.NotFound);
                }

                set.RemoveRange(entitiesToDelete);
                await context.SaveChangesAsync();

                return new NoContentResult();
            }
            catch (Exception ex)
            {
                return new ObjectResult(new
                {
                    ErrorCode = $"{entityName.ToUpper()}_BULK_DELETE_FAILED",
                    Message = ex.Message
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }

    public static class PaginationHelper
    {
        public static (int TotalPages, IActionResult? ErrorResult) GetPaginationInfo(int totalItems, int pageSize, int page)
        {
            if (totalItems == 0) return (0, new NotFoundResult());

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            if (page > totalPages) return (totalPages, new NotFoundObjectResult("Page number exceeds total pages"));

            return (totalPages, null);
        }

        public static void AppendPaginationHeaders(HttpResponse response, int totalCount, int totalPages)
        {
            response.Headers.Append("X-Total-Count", totalCount.ToString());
            response.Headers.Append("X-Total-Pages", totalPages.ToString());
        }
    }
}