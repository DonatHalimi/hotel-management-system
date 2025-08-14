namespace API.Models.DTOs
{
    public class UpdateUserDTO
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        // TODO: this should be refactored so that the current password is required, also add a new optional field for NewPassword
        public string? Password { get; set; }
    }
}