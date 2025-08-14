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
    public class UserController(AppDbContext context, IValidator<RegisterDTO> registerValidator, IValidator<UpdateUserDTO> updateUserDtoValidator, IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IValidator<UpdateUserDTO> _updateUserDtoValidator = updateUserDtoValidator;
        private readonly IValidator<BulkDeleteDTO> _bulkDeleteValidator = bulkDeleteValidator;
        private readonly IValidator<RegisterDTO> _registerValidator = registerValidator;

        // GET: api/users
        [HttpGet]
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
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalUsers.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(users);
        }

        // GET: api/users/:id
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        // TODO: change RegisterDTO to CreateUserDTO when I add more fields to the user entity
        // POST: api/users/create
        [HttpPost]
        public async Task<IActionResult> CreateUser(RegisterDTO registerDto)
        {
            var validationResult = await _registerValidator.ValidateAsync(registerDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            var profile = new
            {
                Api = "https://ui-avatars.com/api/?name=",
                Color = "ffffff",
                Background = "007bff",
                Size = 128
            };
            var profilePicture = $"{profile.Api}{Uri.EscapeDataString(string.Concat(registerDto.FirstName.AsSpan(0, 1), registerDto.LastName.AsSpan(0, 1)))}&background={profile.Background}&color={profile.Color}&size={profile.Size}";
            var date = DateTime.UtcNow;

            try
            {
                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    Password = password,
                    ProfilePicture = profilePicture,
                    CreatedAt = date
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtRoute("GetUserById", new { id = user.UserID }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "USER_CREATION_FAILED",
                    Message = ex.Message
                });
            }
        }

        // TODO: add custom messages for error from ErrorService.cs
        // PUT: api/users/:id
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

            if (!string.IsNullOrEmpty(updateDto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);

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

        // DELETE: api/users/delete/:id
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