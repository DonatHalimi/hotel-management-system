﻿using API.Attributes;
using API.Data.Context;
using API.Helpers;
using API.Models.DTOs;
using API.Models.Entities;
using API.Services;
using API.Validations;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [AdminOnly]
    public class UserController(
     AppDbContext context,
     IValidator<CreateUserDTO> createValidator,
     IValidator<UpdateUserDTO> updateValidator,
     IValidator<BulkDeleteDTO> bulkDeleteValidator,
     JwtService jwtService) : ControllerBase
    {
        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(u =>
                    EF.Functions.Like(u.FirstName, s) ||
                    EF.Functions.Like(u.LastName, s) ||
                    EF.Functions.Like(u.Email, s));
            }

            var totalUsers = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalUsers, pageSize, page);
            if (errorResult != null) return errorResult;

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

            PaginationHelper.AppendPaginationHeaders(Response, totalUsers, totalPages);
            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDTO createDto)
        {
            var validationResult = await createValidator.ValidateAsync(createDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password);
            var profilePicture = ProfilePictureHelper.Generate(createDto.FirstName, createDto.LastName);
            var roleId = createDto.RoleID ?? Guid.Empty;

            var user = new User
            {
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                Password = passwordHash,
                ProfilePicture = profilePicture,
                RoleID = roleId
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return CreatedAtRoute("GetUserById", new { id = user.UserID }, user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, [FromBody] UpdateUserDTO updateDto)
        {
            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await context.Users.FindAsync(id);
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
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "USER_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();

            context.Users.Remove(user);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "USER_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/users/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<User>(context, dto.Ids, UserConstants.ENTITY_NAME, "UserID");
        }
    }
}