using API.Validations.Constants;
using FluentValidation;
using System;
using System.Linq;

namespace API.Validations.Rules
{
    public static class PasswordValidationExtensions
    {
        public static IRuleBuilderOptions<T, string> ApplyPasswordRules<T>(
            this IRuleBuilder<T, string> ruleBuilder,
            string passwordType = "Password",
            Func<T, string> firstNameSelector = null,
            Func<T, string> lastNameSelector = null,
            Func<T, string> emailSelector = null,
            int minimumLength = UserConstants.MINIMUM_PASSWORD_LENGTH)
        {
            var options = ruleBuilder
                .NotEmpty().WithMessage($"{passwordType} is required")
                .MinimumLength(minimumLength).WithMessage($"{passwordType} must be at least {minimumLength} characters")
                .Matches("[A-Z]").WithMessage($"{passwordType} must contain at least one uppercase letter")
                .Matches("[a-z]").WithMessage($"{passwordType} must contain at least one lowercase letter")
                .Matches("[0-9]").WithMessage($"{passwordType} must contain at least one number")
                .Matches("[^a-zA-Z0-9]").WithMessage($"{passwordType} must contain at least one special character");

            if (firstNameSelector != null && lastNameSelector != null && emailSelector != null)
            {
                options = options.Must((model, password) => !ContainsPersonalInfo(
                    password,
                    firstNameSelector(model),
                    lastNameSelector(model),
                    emailSelector(model)))
                    .WithMessage($"{passwordType} cannot contain your first name, last name or email");
            }

            return options;
        }

        private static bool ContainsPersonalInfo(
            string password,
            string firstName,
            string lastName,
            string email)
        {
            if (string.IsNullOrEmpty(password)) return false;

            var lowerPassword = password.ToLower();
            var emailPrefix = email?.Split('@')[0].ToLower() ?? string.Empty;

            return lowerPassword.Contains(firstName?.ToLower() ?? string.Empty) ||
                   lowerPassword.Contains(lastName?.ToLower() ?? string.Empty) ||
                   lowerPassword.Contains(emailPrefix);
        }
    }
}