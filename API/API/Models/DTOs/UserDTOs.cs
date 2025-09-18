using System;

namespace API.Models.DTOs
{
    public class CreateUserDTO
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public Guid? RoleID { get; set; }

        public string? PhoneNumber { get; set; }
    }

    public class UpdateUserDTO
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string Password { get; set; } = string.Empty;

        public string? NewPassword { get; set; }

        public string? PhoneNumber { get; set; }

        public Guid? RoleID { get; set; }
    }
}