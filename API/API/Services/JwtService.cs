using API.Config;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
    public class JwtService
    {
        private readonly JwtConfig _config;
        private readonly byte[] _key;

        public JwtService(JwtConfig config)
        {
            _config = config;
            _key = Encoding.UTF8.GetBytes(_config.Secret);
        }

        public string GenerateAccessToken(Guid userId, string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim (ClaimTypes.Role, role),
            };

            var signingKey = new SymmetricSecurityKey(_key);
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config.Issuer,
                audience: _config.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(_config.AccessTokenExpirationMinutes),
                signingCredentials: creds
            );

            return tokenHandler.WriteToken(token);
        }

        public (string token, DateTime expires) GenerateRefreshToken()
        {
            var random = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(random);

            var token = Convert.ToBase64String(random);
            var expires = DateTime.UtcNow.AddDays(_config.RefreshTokenExpirationDays);
            return (token, expires);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _config.Issuer,
                ValidAudience = _config.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_key),
                ValidateLifetime = false
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var securityToken);
                if (securityToken is JwtSecurityToken jwtToken && jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return principal;
                }
            }
            catch
            {
                return null;
            }

            return null;
        }

        public ClaimsPrincipal? GetUserFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _config.Issuer,
                ValidAudience = _config.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_key),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                return tokenHandler.ValidateToken(token, validationParameters, out _);
            }
            catch
            {
                return null;
            }
        }
    }
}