using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; }

        public string? ProfilePicture { get; set; }

        [Required]
        public string Password { get; set; }

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}