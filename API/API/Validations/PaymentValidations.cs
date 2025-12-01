using API.Models.DTOs;
using API.Models.Enums;
using FluentValidation;
using System;
using static API.Validations.Constants.PaymentConstants;

namespace API.Validations
{
    public class PaymentValidations
    {
        public class CreatePaymentValidation : AbstractValidator<CreatePaymentDTO>
        {
            public CreatePaymentValidation()
            {
                RuleFor(x => x.BookingID)
                    .NotEmpty().WithMessage("Booking ID is required");

                RuleFor(x => x.Amount)
                    .GreaterThan(MIN_AMOUNT).WithMessage($"Amount must be greater than {MIN_AMOUNT}")
                    .LessThan(MAX_AMOUNT).WithMessage($"Amount must be lower than {MAX_AMOUNT}");

                RuleFor(x => x.Method)
                    .IsInEnum().WithMessage("Payment method is invalid");

                RuleFor(x => x.Status)
                    .IsInEnum().WithMessage("Payment status is invalid");

                RuleFor(x => x.TransactionReference)
                    .MaximumLength(MAX_TRANSACTION_REF_LENGTH)
                    .WithMessage($"Transaction reference cannot exceed {MAX_TRANSACTION_REF_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.TransactionReference));
            }
        }

        public class UpdatePaymentValidation : AbstractValidator<UpdatePaymentDTO>
        {
            public UpdatePaymentValidation()
            {
                RuleFor(x => x.BookingID)
                    .NotEmpty().WithMessage("Booking ID is required")
                    .When(x => x.Method != default);

                RuleFor(x => x.Amount)
                    .GreaterThan(0).WithMessage("Amount must be greater than 0")
                    .When(x => x.Method != default);

                RuleFor(x => x.Method)
                    .IsInEnum().WithMessage("Payment method is invalid")
                    .When(x => x.Method != default);

                RuleFor(x => x.Status)
                    .IsInEnum().WithMessage("Payment status is invalid")
                    .When(x => x.Method != default);

                RuleFor(x => x.TransactionReference)
                    .MaximumLength(MAX_TRANSACTION_REF_LENGTH)
                    .WithMessage($"Transaction reference cannot exceed {MAX_TRANSACTION_REF_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.TransactionReference));

                RuleFor(x => x.PaymentDate)
                    .Must(d => d <= DateTime.UtcNow)
                    .WithMessage("Payment date cannot be in the future")
                    .When(x => x.Method != default);
            }
        }
    }
}
