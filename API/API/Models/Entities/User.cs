using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class User
    {
        [Key]
        public Guid UserID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ProfilePicture { get; set; }

        public string? PhoneNumber { get; set; }

        public Guid RoleID { get; set; } = Guid.Empty;

        [JsonIgnore]
        public Role Role { get; set; } = null!;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}