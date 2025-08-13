using System.ComponentModel.DataAnnotations;
using API.Validations.Constants;

namespace API.Models.DTOs
{
    public class UpdateUserDTO
    {
        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }

        // this should be refactored in the future so that the current password is required (also add a new optional field for NewPassword)
        [MinLength(UserConstants.MINIMUM_PASSWORD_LENGTH)]
        public string? Password { get; set; }

        public string? ProfilePicture { get; set; }
    }
}