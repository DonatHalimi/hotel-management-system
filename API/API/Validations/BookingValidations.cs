using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;

namespace API.Validations
{
    public class BookingValidations
    {
        public class CreateBookingValidation : AbstractValidator<CreateBookingDTO>
        {
            public CreateBookingValidation()
            {
                RuleFor(x => x.GuestID)
                    .NotEmpty().WithMessage("Guest ID is required");

                RuleFor(x => x.RoomID)
                    .NotEmpty().WithMessage("Room ID is required");

                RuleFor(x => x.CheckInDate)
                    .NotEmpty().WithMessage("Check-in date is required");

                RuleFor(x => x.CheckOutDate)
                    .NotEmpty().WithMessage("Check-out date is required")
                    .GreaterThan(x => x.CheckInDate)
                    .WithMessage("Check-out date must be after check-in date");

                RuleFor(x => x.NumberOfGuests)
                    .GreaterThan(0).WithMessage("Number of guests must be at least 1")
                    .LessThanOrEqualTo(BookingConstants.MAX_GUESTS_PER_BOOKING)
                    .WithMessage($"Number of guests cannot exceed {BookingConstants.MAX_GUESTS_PER_BOOKING}");

                RuleFor(x => x.TotalPrice)
                    .GreaterThanOrEqualTo(0).WithMessage("Total price cannot be negative");

                RuleFor(x => x.BookingNumber)
                    .MaximumLength(BookingConstants.MAX_BOOKING_NUMBER_LENGTH)
                    .WithMessage($"Booking number cannot exceed {BookingConstants.MAX_BOOKING_NUMBER_LENGTH} characters");

                RuleFor(x => x.CancellationReason)
                    .MaximumLength(BookingConstants.MAX_CANCELLATION_REASON_LENGTH)
                    .WithMessage($"Cancellation reason cannot exceed {BookingConstants.MAX_CANCELLATION_REASON_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.CancellationReason));
            }
        }

        public class UpdateBookingValidation : AbstractValidator<UpdateBookingDTO>
        {
            public UpdateBookingValidation()
            {
                RuleFor(x => x.BookingID)
                    .NotEmpty().WithMessage("Booking ID is required");

                RuleFor(x => x.CheckOutDate)
                    .GreaterThan(x => x.CheckInDate)
                    .When(x => x.CheckInDate.HasValue && x.CheckOutDate.HasValue)
                    .WithMessage("Check-out date must be after check-in date");

                RuleFor(x => x.NumberOfGuests)
                    .GreaterThan(0).WithMessage("Number of guests must be at least 1")
                    .LessThanOrEqualTo(BookingConstants.MAX_GUESTS_PER_BOOKING)
                    .WithMessage($"Number of guests cannot exceed {BookingConstants.MAX_GUESTS_PER_BOOKING}")
                    .When(x => x.NumberOfGuests.HasValue);

                RuleFor(x => x.TotalPrice)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Total price cannot be negative")
                    .When(x => x.TotalPrice.HasValue);

                RuleFor(x => x.BookingNumber)
                    .MaximumLength(BookingConstants.MAX_BOOKING_NUMBER_LENGTH)
                    .WithMessage($"Booking number cannot exceed {BookingConstants.MAX_BOOKING_NUMBER_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.BookingNumber));

                RuleFor(x => x.CancellationReason)
                    .MaximumLength(BookingConstants.MAX_CANCELLATION_REASON_LENGTH)
                    .WithMessage($"Cancellation reason cannot exceed {BookingConstants.MAX_CANCELLATION_REASON_LENGTH} characters")
                    .When(x => !string.IsNullOrWhiteSpace(x.CancellationReason));
            }
        }
    }
}