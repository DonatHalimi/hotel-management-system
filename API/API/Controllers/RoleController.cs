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
        private readonly AppDbContext _context = context;
        private readonly IValidator<CreateRoleDTO> _createValidator = createValidator;
        private readonly IValidator<UpdateRoleDTO> _updateValidator = updateValidator;
        private readonly IValidator<BulkDeleteDTO> _bulkDeleteValidator = bulkDeleteValidator;

        // GET: api/roles
        [HttpGet]
        public async Task<IActionResult> GetRoles([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = _context.Roles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(r =>
                    EF.Functions.Like(r.Name, s) ||
                    EF.Functions.Like(r.Description, s));
            }

            var totalRoles = await query.CountAsync();
            if (totalRoles == 0) return NotFound();

            var totalPages = (int)Math.Ceiling(totalRoles / (double)pageSize);
            if (page > totalPages) return NotFound("Page number exceeds total pages.");
            var roles = await query
                .OrderBy(r => r.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalRoles.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(roles);
        }

        // GET: api/roles/{id}
        [HttpGet("{id}", Name = "GetRoleById")]
        public async Task<IActionResult> GetRoleById(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        // POST: api/roles
        [HttpPost]
        public async Task<IActionResult> CreateRole(CreateRoleDTO roleDto)
        {
            var validationResult = await _createValidator.ValidateAsync(roleDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var role = new Role
                {
                    Name = roleDto.Name,
                    Description = roleDto.Description,
                };

                _context.Roles.Add(role);

                await _context.SaveChangesAsync();
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
            var validationResult = await _updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var role = await _context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            if (updateDto.Name != null)
                role.Name = updateDto.Name;

            if (updateDto.Description != null)
                role.Description = updateDto.Description;

            role.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
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
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            _context.Roles.Remove(role);

            try
            {
                await _context.SaveChangesAsync();
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
            var validationResult = await _bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.ExecuteAsync<Role>(_context, dto.Ids, RoleConstants.ENTITY_NAME, "RoleID");
        }
    }
}
