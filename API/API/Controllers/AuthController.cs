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
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IValidator<RegisterDTO> _registerValidator;
        private readonly IValidator<LoginDTO> _loginValidator;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, IValidator<RegisterDTO> registerValidator, IValidator<LoginDTO> loginValidator, JwtService jwtService)
        {
            _context = context;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _jwtService = jwtService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var validation = await _registerValidator.ValidateAsync(dto);
            if (!validation.IsValid) return BadRequest(validation.Errors);

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.DEFAULT_ROLE_NAME);
            if (role == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROLE_NOT_FOUND",
                    Message = $"Default '{RoleConstants.DEFAULT_ROLE_NAME}' role not found"
                });

            var profilePicture = ProfilePictureHelper.Generate(dto.FirstName, dto.LastName);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Password = passwordHash,
                ProfilePicture = profilePicture,
                RoleID = role.RoleID
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("GetUserById", new { id = user.UserID }, new
            {
                user.UserID,
                user.FirstName,
                user.LastName,
                user.Email,
                user.ProfilePicture,
                Role = role.Name
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            var validationResult = await _loginValidator.ValidateAsync(loginDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await _context.Users
                .Where(u => u.Email == loginDto.Email)
                .Select(u => new
                {
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.ProfilePicture,
                    Role = u.Role.Name
                })
                .FirstOrDefaultAsync();

            if (user == null) return Unauthorized(new { Message = "Invalid credentials" });

            var accessToken = _jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role ?? "");
            var (refreshToken, refreshExpiry) = _jwtService.GenerateRefreshToken();

            await _context.Users
                .Where(u => u.UserID == user.UserID)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.RefreshToken, refreshToken)
                    .SetProperty(u => u.RefreshTokenExpiry, refreshExpiry));

            return Ok(new
            {
                accessToken,
                refreshToken,
                expiresIn = refreshExpiry,
                user
            });
        }

        // POST: api/auth/refresh
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest model)
        {
            var principal = _jwtService.GetPrincipalFromExpiredToken(model.AccessToken);
            if (principal == null)
                return BadRequest(new { Message = "Invalid access token" });

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier) ??
                             principal.FindFirst(JwtRegisteredClaimNames.Sub);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return BadRequest(new { Message = "Invalid token claims" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
                return Unauthorized(new { Message = "Refresh token invalid or expired" });

            var newAccessToken = _jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role?.Name ?? "");
            var (newRefreshToken, newRefreshExpiry) = _jwtService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = newRefreshExpiry;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == model.UserId);
            if (user == null) return NotFound();

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public record RefreshRequest(string AccessToken, string RefreshToken);
    public record LogoutRequest(Guid UserId);
}