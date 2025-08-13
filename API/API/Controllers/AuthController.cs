using API.Data.Context;
using API.Models.DTOs;
using API.Models.Entities;
using API.Validations;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AppDbContext context, IValidator<RegisterDTO> registerValidator) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IValidator<RegisterDTO> _registerValidator = registerValidator;

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDTO registerDto)
        {
            var validationResult = await _registerValidator.ValidateAsync(registerDto);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            if (!EmailValidation.IsEmailUnique(registerDto.Email, _context))
            {
                return BadRequest("Email already exists");
            }

            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                ProfilePicture = registerDto.ProfilePicture,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("GetUserById", new { id = user.UserID }, user);
        }
    }
}