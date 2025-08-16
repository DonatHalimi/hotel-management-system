using API.Data.Context;
using API.Models.DTOs;
using API.Models.Entities;
using API.Validations.Constants;
using API.Validations.Rules;
using FluentValidation;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateUserDTOValidation : AbstractValidator<CreateUserDTO>
    {
        public CreateUserDTOValidation(AppDbContext context)
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .Matches("^[A-Z][a-z]*$").WithMessage("First name must start with a capital letter and contain only letters")
                .MaximumLength(UserConstants.MAX_FIRST_NAME_LENGTH).WithMessage($"First name cannot exceed {UserConstants.MAX_FIRST_NAME_LENGTH} characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .Matches("^[A-Z][a-z]*$").WithMessage("Last name must start with a capital letter and contain only letters")
                .MaximumLength(UserConstants.MAX_LAST_NAME_LENGTH).WithMessage($"Last name cannot exceed {UserConstants.MAX_LAST_NAME_LENGTH} characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters")
                .MustAsync(async (email, cancellation) => await Task.FromResult(EmailValidation.DoesEmailExist(email, context))).WithMessage("Email already exists");

            RuleFor(x => x.RoleID)
                .NotEmpty().WithMessage("Role is required")
                .MustAsync(async (roleId, cancellation) => await RoleValidation.IsRoleValid(roleId, context)).WithMessage("Role must be valid");

            RuleFor(x => x.Password)
                .ApplyPasswordRules("Password", x => x.FirstName, x => x.LastName, x => x.Email);
        }
    }

    public class UpdateUserDTOValidation : AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserDTOValidation(AppDbContext context)
        {
            RuleFor(x => x.FirstName)
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters")
                .Matches("^[A-Z][a-z]*$").WithMessage("First name must start with a capital letter and contain only letters")
                .MaximumLength(UserConstants.MAX_FIRST_NAME_LENGTH).WithMessage($"First name cannot exceed {UserConstants.MAX_FIRST_NAME_LENGTH} characters")
                .When(x => x.FirstName != null);

            RuleFor(x => x.LastName)
                .Matches("^[A-Z][a-z]*$").WithMessage("Last name must start with a capital letter and contain only letters")
                .MaximumLength(UserConstants.MAX_LAST_NAME_LENGTH).WithMessage($"Last name cannot exceed {UserConstants.MAX_LAST_NAME_LENGTH} characters")
                .When(x => x.LastName != null);

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters")
                .MustAsync(async (email, cancellation) => await Task.FromResult(EmailValidation.DoesEmailExist(email, context))).WithMessage("Email already exists")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Current password is required");

            RuleFor(x => x.NewPassword)
                .ApplyPasswordRules("New Password", x => x.FirstName, x => x.LastName, x => x.Email)
                .When(x => !string.IsNullOrEmpty(x.NewPassword));
        }
    }

    public static class EmailValidation
    {
        public static bool DoesEmailExist(string email, AppDbContext context)
        {
            return !context.Users.Any(u => u.Email == email);
        }
    }

    public static class PasswordValidation
    {
        public static bool IsPasswordValid(User user, string password)
        {
            if (user == null || string.IsNullOrEmpty(user.Password))
                return false;

            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }
    }
}