using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data.Context;
using API.Models.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using API.Validations;
using Microsoft.AspNetCore.Http;
using System.Net;
using API.Validations.Constants;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController(AppDbContext context, IValidator<UpdateUserDTO> updateUserDtoValidator, IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IValidator<UpdateUserDTO> _updateUserDtoValidator = updateUserDtoValidator;
        private readonly IValidator<BulkDeleteDTO> _bulkDeleteValidator = bulkDeleteValidator;

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            PaginationValidation.Validate(page, pageSize, out var validationResult);
            if (validationResult != null) return validationResult;

            var totalUsers = await _context.Users.CountAsync();
            var totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize);

            if (page > totalPages && totalUsers > 0) return NotFound("Page number exceeds total pages.");

            var users = await _context.Users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (users.Count == 0) return NotFound();

            Response.Headers.Append("X-Total-Count", totalUsers.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(users);
        }

        // GET: api/users/:id
        // add custom messages for error from ErrorService.cs, in the frontend create something to support success messages
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        // PUT: api/users/:id
        // add custom messages for error from ErrorService.cs, in the frontend create something to support success messages
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, [FromBody] UpdateUserDTO updateDto)
        {
            var validationResult = await _updateUserDtoValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (updateDto.FirstName != null)
                user.FirstName = updateDto.FirstName;

            if (updateDto.LastName != null)
                user.LastName = updateDto.LastName;

            if (updateDto.Email != null)
                user.Email = updateDto.Email;

            if (updateDto.ProfilePicture != null)
                user.ProfilePicture = updateDto.ProfilePicture;

            if (!string.IsNullOrEmpty(updateDto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);

            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("The record has been modified by another user");
            }
        }

        // DELETE: api/users/delete/:id
        // add custom messages for error from ErrorService.cs, in the frontend create something to support success messages
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/users/bulk-delete
        // add custom messages for error from ErrorService.cs, in the frontend create something to support success messages
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO bulkDeleteDto)
        {
            var validationResult = await _bulkDeleteValidator.ValidateAsync(bulkDeleteDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var usersToDelete = await _context.Users
                .Where(u => bulkDeleteDto.Ids.Contains(u.UserID))
                .ToListAsync();

            // this should be refactored later on so that it doesn't need to be re-written on each bulk delete function (only entityName is dynamic, the rest are static)
            if (usersToDelete.Count == 0)
            {
                return ErrorServices.CreateEntityErrorResponse(
                    entityName: UserConstants.ENTITY_NAME,
                    errorCode: "DELETE_BULK_ERROR",
                    isPlural: true,
                    statusCode: HttpStatusCode.NotFound);
            }

            _context.Users.RemoveRange(usersToDelete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}