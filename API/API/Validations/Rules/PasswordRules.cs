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
            int minimumLength = UserConstants.MINIMUM_PASSWORD_LENGTH)
        {
            return ruleBuilder
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(minimumLength).WithMessage($"Password must be at least {minimumLength} characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least one number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character")
                .Must(BeUniqueChars).WithMessage($"Password must contain at least {minimumLength} unique characters");
        }

        public static IRuleBuilderOptions<T, string> ApplyPasswordRulesWithPersonalInfoCheck<T>(
            this IRuleBuilder<T, string> ruleBuilder,
            Func<T, string> firstNameSelector,
            Func<T, string> lastNameSelector,
            Func<T, string> emailSelector,
            int minimumLength = UserConstants.MINIMUM_PASSWORD_LENGTH)
        {
            return ruleBuilder
                .ApplyPasswordRules(minimumLength)
                .Must((model, password) => !ContainsPersonalInfo(
                    password,
                    firstNameSelector(model),
                    lastNameSelector(model),
                    emailSelector(model)))
                .WithMessage("Password cannot contain your name or email");
        }

        private static bool BeUniqueChars(string password)
        {
            return password?.Distinct().Count() >= UserConstants.MINIMUM_PASSWORD_LENGTH;
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