using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;

namespace API.Validations
{
    public class GuestValidations
    {
        public class CreateGuestValidation : AbstractValidator<CreateGuestDTO>
        {
            public CreateGuestValidation()
            {
                RuleFor(x => x.IdNumber)
                    .NotEmpty().WithMessage("ID number is required")
                    .MaximumLength(GuestConstants.MAX_ID_NUMBER_LENGTH).WithMessage($"ID number cannot exceed {GuestConstants.MAX_ID_NUMBER_LENGTH} characters");

                RuleFor(x => x.FirstName)
                    .NotEmpty().WithMessage("First name is required")
                    .MaximumLength(GuestConstants.MAX_FIRST_NAME_LENGTH).WithMessage($"First name cannot exceed {GuestConstants.MAX_FIRST_NAME_LENGTH} characters");

                RuleFor(x => x.LastName)
                    .NotEmpty().WithMessage("Last name is required")
                    .MaximumLength(GuestConstants.MAX_LAST_NAME_LENGTH).WithMessage($"Last name cannot exceed {GuestConstants.MAX_LAST_NAME_LENGTH} characters");

                RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is required")
                    .EmailAddress().WithMessage("Invalid email format")
                    .MaximumLength(GuestConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {GuestConstants.MAX_EMAIL_LENGTH} characters");

                RuleFor(x => x.PhoneNumber)
                    .NotEmpty().WithMessage("Phone number is required")
                    .MaximumLength(GuestConstants.MAX_PHONE_NUMBER_LENGTH).WithMessage($"Phone number cannot exceed {GuestConstants.MAX_PHONE_NUMBER_LENGTH} characters");

                RuleFor(x => x.Street)
                    .NotEmpty().WithMessage("Street is required")
                    .MaximumLength(GuestConstants.MAX_STREET_LENGTH).WithMessage($"Street cannot exceed {GuestConstants.MAX_STREET_LENGTH} characters");

                RuleFor(x => x.City)
                    .NotEmpty().WithMessage("City is required")
                    .MaximumLength(GuestConstants.MAX_CITY_LENGTH).WithMessage($"City cannot exceed {GuestConstants.MAX_CITY_LENGTH} characters");

                RuleFor(x => x.Country)
                    .NotEmpty().WithMessage("Country is required")
                    .MaximumLength(GuestConstants.MAX_COUNTRY_LENGTH).WithMessage($"Country cannot exceed {GuestConstants.MAX_COUNTRY_LENGTH} characters");
            }
        }

        public class UpdateGuestValidation : AbstractValidator<UpdateGuestDTO>
        {
            public UpdateGuestValidation()
            {
                RuleFor(x => x.GuestID)
                    .NotEmpty().WithMessage("Guest ID is required");

                RuleFor(x => x.IdNumber)
                    .MaximumLength(GuestConstants.MAX_ID_NUMBER_LENGTH).WithMessage($"ID number cannot exceed {GuestConstants.MAX_ID_NUMBER_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.IdNumber));

                RuleFor(x => x.FirstName)
                    .MaximumLength(GuestConstants.MAX_FIRST_NAME_LENGTH).WithMessage($"First name cannot exceed {GuestConstants.MAX_FIRST_NAME_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.FirstName));

                RuleFor(x => x.LastName)
                    .MaximumLength(GuestConstants.MAX_LAST_NAME_LENGTH).WithMessage($"Last name cannot exceed {GuestConstants.MAX_LAST_NAME_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.LastName));

                RuleFor(x => x.Email)
                    .EmailAddress().WithMessage("Invalid email format")
                    .MaximumLength(GuestConstants.MAX_EMAIL_LENGTH).WithMessage($"Email cannot exceed {GuestConstants.MAX_EMAIL_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.Email));

                RuleFor(x => x.PhoneNumber)
                    .MaximumLength(GuestConstants.MAX_PHONE_NUMBER_LENGTH).WithMessage($"Phone number cannot exceed {GuestConstants.MAX_PHONE_NUMBER_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber));

                RuleFor(x => x.Street)
                    .MaximumLength(GuestConstants.MAX_STREET_LENGTH).WithMessage($"Street cannot exceed {GuestConstants.MAX_STREET_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.Street));

                RuleFor(x => x.City)
                    .MaximumLength(GuestConstants.MAX_CITY_LENGTH).WithMessage($"City cannot exceed {GuestConstants.MAX_CITY_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.City));

                RuleFor(x => x.Country)
                    .MaximumLength(GuestConstants.MAX_COUNTRY_LENGTH).WithMessage($"Country cannot exceed {GuestConstants.MAX_COUNTRY_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.Country));
            }
        }
    }
}
