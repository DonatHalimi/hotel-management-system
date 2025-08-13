using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs
{
    public class RegisterDTO
    {
        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; }

        public string? ProfilePicture { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
