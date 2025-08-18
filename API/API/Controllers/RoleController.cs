using API.Attributes;
using API.Data.Context;
using API.Helpers;
using API.Models.DTOs;
using API.Models.Entities;
using API.Validations;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [AdminOnly]
    public class RoleController(
        AppDbContext context,
        IValidator<CreateRoleDTO> createValidator,
        IValidator<UpdateRoleDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/roles
        [HttpGet]
        public async Task<IActionResult> GetRoles([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Roles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(r =>
                    EF.Functions.Like(r.Name, s) ||
                    EF.Functions.Like(r.Description, s));
            }

            var totalRoles = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalRoles, pageSize, page);

            if (errorResult != null) return errorResult;

            var roles = await query
                .OrderBy(r => r.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalRoles, totalPages);
            return Ok(roles);
        }

        // GET: api/roles/{id}
        [HttpGet("{id}", Name = "GetRoleById")]
        public async Task<IActionResult> GetRoleById(Guid id)
        {
            var role = await context.Roles.FindAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        // POST: api/roles
        [HttpPost]
        public async Task<IActionResult> CreateRole(CreateRoleDTO roleDto)
        {
            var validationResult = await createValidator.ValidateAsync(roleDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var role = new Role
                {
                    Name = roleDto.Name,
                    Description = roleDto.Description,
                };

                context.Roles.Add(role);

                await context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetRoleById), new { id = role.RoleID }, role);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROLE_CREATION_FAILED",
                    Message = ex.Message
                });
            }
        }

        // PUT: api/roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole([FromRoute] Guid id, [FromBody] UpdateRoleDTO updateDto)
        {
            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var role = await context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            if (updateDto.Name != null)
                role.Name = updateDto.Name;

            if (updateDto.Description != null)
                role.Description = updateDto.Description;

            role.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROLE_UPDATE_FAILED",
                    Message = ex.Message
                });
            }
        }

        // DELETE: api/roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var role = await context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            context.Roles.Remove(role);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROLE_DELETE_FAILED",
                    Message = ex.Message
                });
            }
        }

        // DELETE: api/roles/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.ExecuteAsync<Role>(context, dto.Ids, RoleConstants.ENTITY_NAME, "RoleID");
        }
    }
}
