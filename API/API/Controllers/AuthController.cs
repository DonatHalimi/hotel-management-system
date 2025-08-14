using API.Data.Context;
using API.Models.DTOs;
using API.Models.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AppDbContext context, IValidator<RegisterDTO> registerValidator) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IValidator<RegisterDTO> _registerValidator = registerValidator;

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDTO registerDto)
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
    }
}