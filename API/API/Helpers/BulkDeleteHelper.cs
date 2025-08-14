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
}