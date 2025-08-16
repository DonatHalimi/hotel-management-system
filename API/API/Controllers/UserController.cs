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
    [Route("api/users")]
    [AdminOnly]
    public class UserController(
        AppDbContext context,
        IValidator<CreateUserDTO> createUserDtoValidator,
        IValidator<UpdateUserDTO> updateUserDtoValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        private readonly IValidator<CreateUserDTO> _createUserDtoValidator = createUserDtoValidator;
        private readonly IValidator<UpdateUserDTO> _updateUserDtoValidator = updateUserDtoValidator;
        private readonly IValidator<BulkDeleteDTO> _bulkDeleteValidator = bulkDeleteValidator;

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(u =>
                    EF.Functions.Like(u.FirstName, s) ||
                    EF.Functions.Like(u.LastName, s) ||
                    EF.Functions.Like(u.Email, s));
            }

            var totalUsers = await query.CountAsync();
            if (totalUsers == 0) return NotFound();

            var totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize);
            if (page > totalPages) return NotFound("Page number exceeds total pages.");

            var users = await query
                .OrderBy(u => u.FirstName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.ProfilePicture,
                    u.FullName,
                    u.CreatedAt,
                    u.UpdatedAt,
                    Role = u.Role.Name
                })
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalUsers.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDTO dto)
        {
            var validationResult = await _createUserDtoValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var profilePicture = ProfilePictureHelper.Generate(dto.FirstName, dto.LastName);
            var roleId = dto.RoleID ?? Guid.Empty;

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Password = passwordHash,
                ProfilePicture = profilePicture,
                RoleID = roleId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("GetUserById", new { id = user.UserID }, user);
        }

        // TODO: add custom messages for error from ErrorService.cs
        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, [FromBody] UpdateUserDTO updateDto)
        {
            var validationResult = await _updateUserDtoValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (!PasswordValidation.IsPasswordValid(user, updateDto.Password))
                return BadRequest(new { Error = "Current password is incorrect" });

            if (updateDto.FirstName != null)
                user.FirstName = updateDto.FirstName;

            if (updateDto.LastName != null)
                user.LastName = updateDto.LastName;

            if (updateDto.Email != null)
                user.Email = updateDto.Email;

            if (!string.IsNullOrEmpty(updateDto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);

            if (!string.IsNullOrEmpty(updateDto.NewPassword))
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.NewPassword);

            if (updateDto.RoleID.HasValue)
                user.RoleID = updateDto.RoleID.Value;

            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "USER_UPDATE_FAILED",
                    Message = ex.Message
                });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "USER_DELETE_FAILED",
                    Message = ex.Message
                });
            }
        }

        // DELETE: api/users/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await _bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.ExecuteAsync<User>(_context, dto.Ids, UserConstants.ENTITY_NAME, "UserID");
        }
    }
}