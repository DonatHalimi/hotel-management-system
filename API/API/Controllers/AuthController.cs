using API.Data.Context;
using API.Helpers;
using API.Models.DTOs;
using API.Models.Entities;
using API.Services;
using API.Validations.Constants;
using FluentValidation;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
    JwtService jwtService,
    IEmailService emailService,
    IOtpService otpService,
    IConfiguration configuration,
    ILogger<AuthController> logger) : ControllerBase
    {
        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var validation = await registerValidator.ValidateAsync(dto);
            if (!validation.IsValid) return BadRequest(validation.Errors);

            var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { Message = "User with this email already exists" });
            }

            var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.DEFAULT_ROLE_NAME);
            if (role == null)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROLE_NOT_FOUND",
                    Message = $"Default '{RoleConstants.DEFAULT_ROLE_NAME}' role not found"
                });

            var profilePicture = ProfilePictureHelper.Generate(dto.FirstName, dto.LastName);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var otp = otpService.GenerateOtp();
            var otpExpiry = otpService.GetOtpExpiry(10);

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Password = passwordHash,
                ProfilePicture = profilePicture,
                RoleID = role.RoleID,
                IsEmailVerified = false,
                EmailVerificationOtp = otp,
                EmailVerificationOtpExpiry = otpExpiry
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            try
            {
                await emailService.SendVerificationEmailAsync(user.Email, user.FirstName, otp);
                logger.LogInformation("Verification email sent to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send verification email to {Email}", user.Email);

                context.Users.Remove(user);
                await context.SaveChangesAsync();

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Registration failed. Could not send verification email. Please try again."
                });
            }

            return CreatedAtRoute("GetUserById", new { id = user.UserID }, new
            {
                user.UserID,
                user.FirstName,
                user.LastName,
                user.Email,
                user.ProfilePicture,
                Role = role.Name,
                IsEmailVerified = user.IsEmailVerified,
                Message = "Registration successful. Please check your email for a verification code"
            });
        }

        // POST: api/auth/google-login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO dto)
        {
            try
            {
                var clientId = configuration["GoogleAuth:ClientId"];
                if (string.IsNullOrEmpty(clientId))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        Message = "Google authentication is not configured"
                    });
                }

                var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                });

                if (payload == null)
                {
                    return BadRequest(new { Message = "Invalid Google token" });
                }

                var user = await context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    var role = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.DEFAULT_ROLE_NAME);
                    if (role == null)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, new
                        {
                            ErrorCode = "ROLE_NOT_FOUND",
                            Message = $"Default '{RoleConstants.DEFAULT_ROLE_NAME}' role not found"
                        });
                    }

                    user = new User
                    {
                        FirstName = payload.GivenName ?? payload.Name ?? "Google",
                        LastName = payload.FamilyName ?? "User",
                        Email = payload.Email,
                        Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        ProfilePicture = payload.Picture ?? ProfilePictureHelper.Generate(
                            payload.GivenName ?? payload.Name ?? "Google",
                            payload.FamilyName ?? "User"),
                        RoleID = role.RoleID,
                        IsEmailVerified = payload.EmailVerified,
                        EmailVerificationOtp = null,
                        EmailVerificationOtpExpiry = null
                    };

                    context.Users.Add(user);
                    await context.SaveChangesAsync();

                    user = await context.Users
                        .Include(u => u.Role)
                        .FirstOrDefaultAsync(u => u.UserID == user.UserID);

                    logger.LogInformation("New user created via Google login: {Email}", user!.Email);
                }
                else
                {
                    if (!string.IsNullOrEmpty(payload.Picture) &&
                        (string.IsNullOrEmpty(user.ProfilePicture) || user.ProfilePicture.StartsWith("https://ui-avatars.com")))
                    {
                        user.ProfilePicture = payload.Picture;
                        context.Users.Update(user);
                        await context.SaveChangesAsync();
                    }

                    logger.LogInformation("Existing user logged in via Google: {Email}", user.Email);
                }

                var accessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role?.Name ?? "");
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
                    user = new
                    {
                        user.UserID,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.ProfilePicture,
                        Role = user.Role?.Name
                    }
                });
            }
            catch (InvalidJwtException)
            {
                return BadRequest(new { Message = "Invalid Google token" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during Google login");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred during Google login"
                });
            }
        }

        // POST: api/auth/verify-email
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDTO dto)
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return BadRequest(new { Message = "User not found" });

            if (user.IsEmailVerified)
                return BadRequest(new { Message = "Email is already verified" });

            if (user.EmailVerificationOtp != dto.Otp)
                return BadRequest(new { Message = "Invalid OTP" });

            if (user.EmailVerificationOtpExpiry == null || user.EmailVerificationOtpExpiry < DateTime.UtcNow)
                return BadRequest(new { Message = "OTP has expired" });

            user.IsEmailVerified = true;
            user.EmailVerificationOtp = null;
            user.EmailVerificationOtpExpiry = null;

            context.Users.Update(user);
            await context.SaveChangesAsync();

            logger.LogInformation("Email verified successfully for user {Email}", user.Email);

            return Ok(new
            {
                Message = "Email verified successfully",
                IsEmailVerified = user.IsEmailVerified
            });
        }

        // POST: api/auth/resend-verification
        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification(ResendVerificationDTO dto)
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return BadRequest(new { Message = "User not found" });

            if (user.IsEmailVerified)
                return BadRequest(new { Message = "Email is already verified" });

            var otp = otpService.GenerateOtp();
            var otpExpiry = otpService.GetOtpExpiry(10);

            user.EmailVerificationOtp = otp;
            user.EmailVerificationOtpExpiry = otpExpiry;

            context.Users.Update(user);
            await context.SaveChangesAsync();

            try
            {
                await emailService.SendVerificationEmailAsync(user.Email, user.FirstName, otp);
                logger.LogInformation("Verification email resent to {Email}", user.Email);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to resend verification email to {Email}", user.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Failed to send verification email. Please try again later"
                });
            }

            return Ok(new
            {
                Message = "Verification email sent successfully"
            });
        }

        // TODO: implement the option to save user session via HttpOnly cookies
        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            var validationResult = await loginValidator.ValidateAsync(loginDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized(new { Message = "Invalid credentials" });

            if (!user.IsEmailVerified)
                return BadRequest(new
                {
                    Message = "Please verify your email address before logging in",
                    RequiresEmailVerification = true
                });

            var accessToken = jwtService.GenerateAccessToken(user.UserID, user.Email, user.Role?.Name ?? "");
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
                user = new
                {
                    user.UserID,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.ProfilePicture,
                    Role = user.Role?.Name
                }
            });
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserDetails()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Unauthorized();

            var token = authHeader.Substring("Bearer ".Length);

            var principal = jwtService.GetUserFromToken(token);
            if (principal == null)
                return Unauthorized();

            var userIdClaim = principal.FindFirst("UserID") ?? principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var user = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == userId);

            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserID,
                user.FirstName,
                user.LastName,
                user.Email,
                user.ProfilePicture,
                user.FullName,
                user.CreatedAt,
                user.UpdatedAt,
                Role = user.Role?.Name,
                user.PhoneNumber,
                user.IsEmailVerified
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

            var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserID == userId);
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

        // TODO: on logout it should also invalidate the access token
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