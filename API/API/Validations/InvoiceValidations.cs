using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;

namespace API.Validations
{
    public class InvoiceValidations
    {
        public class CreateInvoiceValidation : AbstractValidator<CreateInvoiceDTO>
        {
            public CreateInvoiceValidation()
            {
                RuleFor(x => x.BookingID)
                    .NotEmpty().WithMessage("Booking ID is required");

                RuleFor(x => x.Subtotal)
                    .GreaterThanOrEqualTo(0).WithMessage("Subtotal cannot be negative");

                RuleFor(x => x.Tax)
                    .GreaterThanOrEqualTo(0).WithMessage("Tax cannot be negative");

                RuleFor(x => x.Discounts)
                    .GreaterThanOrEqualTo(0).WithMessage("Discounts cannot be negative");
            }
        }

        public class UpdateInvoiceValidation : AbstractValidator<UpdateInvoiceDTO>
        {
            public UpdateInvoiceValidation()
            {
                RuleFor(x => x.BookingID)
                    .NotEmpty().WithMessage("Booking ID is required")
                    .When(x => x.BookingID != default);

                RuleFor(x => x.Subtotal)
                    .GreaterThanOrEqualTo(0).WithMessage("Subtotal cannot be negative")
                    .When(x => x.Subtotal.HasValue);

                RuleFor(x => x.Tax)
                    .GreaterThanOrEqualTo(0).WithMessage("Tax cannot be negative")
                    .When(x => x.Tax.HasValue);

                RuleFor(x => x.Discounts)
                    .GreaterThanOrEqualTo(0).WithMessage("Discounts cannot be negative")
                    .When(x => x.Discounts.HasValue);
            }
        }
    }
}
