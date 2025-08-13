using API.Data.Context;
using API.Models.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using API.Validations.Rules;
using API.Validations.Constants;

namespace API.Validations
{
    public class RegisterDTOValidation : AbstractValidator<RegisterDTO>
    {
        public RegisterDTOValidation()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

            RuleFor(x => x.Password)
                .ApplyPasswordRulesWithPersonalInfoCheck(
                    x => x.FirstName,
                    x => x.LastName,
                    x => x.Email);
        }
    }

    public class UpdateUserDTOValidation : AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserDTOValidation()
        {
            RuleFor(x => x.FirstName)
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters")
                .When(x => x.FirstName != null);

            RuleFor(x => x.LastName)
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters")
                .When(x => x.LastName != null);

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters")
                .When(x => x.Email != null);

            RuleFor(x => x.Password)
                .MinimumLength(UserConstants.MINIMUM_PASSWORD_LENGTH)
                .When(x => !string.IsNullOrEmpty(x.Password))
                .ApplyPasswordRulesWithPersonalInfoCheck(
                    x => x.FirstName ?? "",
                    x => x.LastName ?? "",
                    x => x.Email ?? "")
                .When(x => !string.IsNullOrEmpty(x.Password));
        }
    }

    public class BulkDeleteValidation : AbstractValidator<BulkDeleteDTO>
    {
        public BulkDeleteValidation()
        {
            RuleFor(x => x.Ids)
                .NotEmpty().WithMessage("At least one ID is required")
                .Must(ids => ids.Length <= CoreConstants.MAX_DELETE_LENGTH).WithMessage($"Cannot delete more than {CoreConstants.MAX_DELETE_LENGTH} entries at once");
        }
    }

    // add ErrorService support for pagination and then replace the "< 1" from CoreConstants.cs constants
    public class PaginationValidation
    {
        public static void Validate(int page, int pageSize, out IActionResult validationResult)
        {
            validationResult = null;

            if (page < 1)
            {
                validationResult = new BadRequestObjectResult("Page number must be greater than 0");
                return;
            }

            if (pageSize < 1)
            {
                validationResult = new BadRequestObjectResult("Page size must be greater than 0");
                return;
            }

            if (pageSize > 100)
            {
                validationResult = new BadRequestObjectResult("Page size cannot exceed 100");
            }
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