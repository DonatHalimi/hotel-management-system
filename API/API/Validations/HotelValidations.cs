using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Validations
{
    public class HotelValidations
    {
        public class CreateHotelValidation : AbstractValidator<CreateHotelDTO>
        {
            public CreateHotelValidation(AppDbContext context)
            {
                RuleFor(x => x.Name)
                    .NotEmpty().WithMessage("Hotel name is required")
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Hotel name must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_NAME_LENGTH).WithMessage($"Hotel name cannot exceed {HotelConstants.MAX_NAME_LENGTH} characters")
                    .MustAsync(async (name, cancellation) => await IsHotelUnique(name, context)).WithMessage("Hotel name already exists");

                RuleFor(x => x.Description)
                    .MaximumLength(HotelConstants.MAX_DESCRIPTION_LENGTH).WithMessage($"Description cannot exceed {HotelConstants.MAX_DESCRIPTION_LENGTH} characters");

                RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is required")
                    .EmailAddress().WithMessage("Invalid email format")
                    .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters")
                    .MustAsync(async (email, cancellation) => await Task.FromResult(EmailValidation.DoesEmailExist(email, context))).WithMessage("Email already exists");

                RuleFor(x => x.PhoneNumber)
                    .NotEmpty().WithMessage("Phone number is required")
                    .MaximumLength(HotelConstants.MAX_PHONE_LENGTH).WithMessage($"Phone number cannot exceed {HotelConstants.MAX_PHONE_LENGTH} characters");

                RuleFor(x => x.City)
                    .NotEmpty().WithMessage("City is required")
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("City must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_CITY_LENGTH).WithMessage($"City cannot exceed {HotelConstants.MAX_CITY_LENGTH} characters");

                RuleFor(x => x.Country)
                    .NotEmpty().WithMessage("Country is required")
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Country must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_COUNTRY_LENGTH).WithMessage($"Country cannot exceed {HotelConstants.MAX_COUNTRY_LENGTH} characters");
            }
        }

        public class UpdateHotelValidation : AbstractValidator<UpdateHotelDTO>
        {
            public UpdateHotelValidation(AppDbContext context)
            {
                RuleFor(x => x.Name)
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Hotel name must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_NAME_LENGTH).WithMessage($"Hotel name cannot exceed {HotelConstants.MAX_NAME_LENGTH} characters")
                    .MustAsync(async (dto, name, cancellation) =>
                    {
                        return await IsHotelUnique(name, context, dto.HotelID);
                    })
                    .WithMessage("Hotel name already exists")
                    .When(x => x.Name != null);

                RuleFor(x => x.Description)
                    .MaximumLength(HotelConstants.MAX_DESCRIPTION_LENGTH).WithMessage($"Description cannot exceed {HotelConstants.MAX_DESCRIPTION_LENGTH} characters")
                    .When(x => x.Description != null);

                RuleFor(x => x.Email)
                    .Cascade(CascadeMode.Stop)
                    .EmailAddress().WithMessage("Invalid email format")
                    .MaximumLength(UserConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {UserConstants.MAX_EMAIL_LENGTH} characters")
                    .MustAsync(async (email, cancellation) => await Task.FromResult(EmailValidation.DoesEmailExist(email, context))).WithMessage("Email already exists")
                    .When(x => x.Email != null);

                RuleFor(x => x.PhoneNumber)
                    .MaximumLength(HotelConstants.MAX_PHONE_LENGTH).WithMessage($"Phone number cannot exceed {HotelConstants.MAX_PHONE_LENGTH} characters")
                    .When(x => x.PhoneNumber != null);

                RuleFor(x => x.City)
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("City must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_CITY_LENGTH).WithMessage($"City cannot exceed {HotelConstants.MAX_CITY_LENGTH} characters")
                    .When(x => x.City != null);

                RuleFor(x => x.Country)
                    .Matches("^[A-Z][a-zA-Z]{2,}$").WithMessage("Country must start with a capital letter and be at least 3 letters long")
                    .MaximumLength(HotelConstants.MAX_COUNTRY_LENGTH).WithMessage($"Country cannot exceed {HotelConstants.MAX_COUNTRY_LENGTH} characters")
                    .When(x => x.Country != null);
            }
        }

        public static async Task<bool> IsHotelUnique(string name, AppDbContext context, Guid? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return !await context.Hotels
                .AnyAsync(h => (excludeId == null || h.HotelID != excludeId) && EF.Functions.Like(h.Name.ToLower(), name.ToLower()));
        }
    }
}
