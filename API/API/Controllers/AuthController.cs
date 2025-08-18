using API.Data.Context;
using API.Helpers;
using API.Models.DTOs;
using API.Models.Entities;
using API.Services;
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
    public class AuthController(
    AppDbContext context,
     IValidator<RegisterDTO> registerValidator,
     IValidator<LoginDTO> loginValidator,
     JwtService jwtService) : ControllerBase
    {
        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var validation = await registerValidator.ValidateAsync(dto);
            if (!validation.IsValid) return BadRequest(validation.Errors);

            var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.DEFAULT_ROLE_NAME);
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

            context.Users.Add(user);
            await context.SaveChangesAsync();

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
            var validationResult = await loginValidator.ValidateAsync(loginDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await context.Users
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

            var accessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role ?? "");
            var (refreshToken, refreshExpiry) = jwtService.GenerateRefreshToken();

            await context.Users
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
            var principal = jwtService.GetPrincipalFromExpiredToken(model.AccessToken);
            if (principal == null) return BadRequest(new { Message = "Invalid access token" });

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier) ??
                             principal.FindFirst(JwtRegisteredClaimNames.Sub);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return BadRequest(new { Message = "Invalid token claims" });

            var user = await context.Users.FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
                return Unauthorized(new { Message = "Refresh token invalid or expired" });

            var newAccessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role?.Name ?? "");
            var (newRefreshToken, newRefreshExpiry) = jwtService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = newRefreshExpiry;
            context.Users.Update(user);
            await context.SaveChangesAsync();

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
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserID == model.UserId);
            if (user == null) return NotFound();

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            context.Users.Update(user);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }

    public record RefreshRequest(string AccessToken, string RefreshToken);
    public record LogoutRequest(Guid UserId);
}