using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using API.Validations.Rules;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Validations
{
    public class RegisterValidation : AbstractValidator<RegisterDTO>
    {
        public RegisterValidation(AppDbContext context)
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

            RuleFor(x => x.Password)
                .ApplyPasswordRules("Password", x => x.FirstName, x => x.LastName, x => x.Email);

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage("Passwords do not match");
        }
    }

    public class LoginValidation : AbstractValidator<LoginDTO>
    {
        private readonly AppDbContext _context;

        public LoginValidation(AppDbContext context)
        {
            _context = context;

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .ApplyPasswordRules("Password", x => x.Email)
                .MustAsync(async (dto, password, cancellation) =>
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                    return PasswordValidation.IsPasswordValid(user, password);
                })
                .WithMessage("Password is incorrect");
        }
    }

    public class VerifyEmailValidation : AbstractValidator<VerifyEmailDTO>
    {
        public VerifyEmailValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Valid email address is required");

            RuleFor(x => x.Otp)
                .NotEmpty().WithMessage("OTP is required")
                .Length(6).WithMessage("OTP must be exactly 6 digits")
                .Matches(@"^\d{6}$").WithMessage("OTP must contain only digits");
        }
    }

    public class ResendVerificationValidation : AbstractValidator<ResendVerificationDTO>
    {
        public ResendVerificationValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Valid email address is required");
        }
    }
}
