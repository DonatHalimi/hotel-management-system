using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using API.Validations.Rules;
using FluentValidation;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateUserDTOValidation : AbstractValidator<RegisterDTO>
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
                .MustAsync(async (email, cancellation) => await Task.FromResult(EmailValidation.IsEmailUnique(email, context))).WithMessage("Email already exists");

            RuleFor(x => x.Password)
                .ApplyPasswordRules(
                    x => x.FirstName,
                    x => x.LastName,
                    x => x.Email);

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password)
                .WithMessage("Passwords do not match");
        }
    }

    // TODO: this validation should check if password is valid (same as the one registered with) before updating the user
    public class UpdateUserDTOValidation : AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserDTOValidation()
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
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters")
                .When(x => x.Email != null);

            RuleFor(x => x.Password)
                .MinimumLength(UserConstants.MINIMUM_PASSWORD_LENGTH)
                .When(x => !string.IsNullOrEmpty(x.Password))
                .ApplyPasswordRules(
                    x => x.FirstName ?? "",
                    x => x.LastName ?? "",
                    x => x.Email ?? "")
                .When(x => !string.IsNullOrEmpty(x.Password));
        }
    }

    public static class EmailValidation
    {
        public static bool IsEmailUnique(string email, AppDbContext context)
        {
            return !context.Users.Any(u => u.Email == email);
        }
    }
}