using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs
{
    public class RegisterDTO
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public string? ConfirmPassword { get; set; }
    }

    public class LoginDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class VerifyEmailDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(6)]
        public string Otp { get; set; } = string.Empty;
    }

    public class ResendVerificationDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
