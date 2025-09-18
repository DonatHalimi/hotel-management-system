using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateRoomValidation : AbstractValidator<CreateRoomDTO>
    {
        public CreateRoomValidation(AppDbContext context)
        {
            RuleFor(x => x.RoomNumber)
                .NotEmpty().WithMessage("Room number is required")
                .Matches("^[0-9]+$").WithMessage("Room number must contain only digits")
                .MaximumLength(RoomConstants.MAX_ROOM_NUMBER_LENGTH)
                .WithMessage($"Room number cannot exceed {RoomConstants.MAX_ROOM_NUMBER_LENGTH} characters")
                .MustAsync(async (name, cancellation) => await RoomValidation.IsRoomUnique(name, context)).WithMessage("Room number already exists");

            RuleFor(x => x.Description)
                .MaximumLength(CoreConstants.MAX_DESC_LENGTH).WithMessage($"Description cannot exceed {CoreConstants.MAX_DESC_LENGTH} characters");

            RuleFor(x => x.Capacity)
                .NotEmpty().WithMessage("Capacity is required")
                .GreaterThan(RoomConstants.MIN_CAPACITY).WithMessage($"Capacity must be greater than {RoomConstants.MIN_CAPACITY}")
                .LessThan(RoomConstants.MAX_CAPACITY).WithMessage($"Capacity must be less than {RoomConstants.MAX_CAPACITY}");

            RuleFor(x => x.PricePerNight)
                .NotEmpty().WithMessage("Price per night is required")
                .GreaterThan(RoomConstants.MIN_PRICE_PER_NIGHT).WithMessage($"Price per night must be greater than {RoomConstants.MIN_PRICE_PER_NIGHT}");

            RuleFor(x => x.HotelID)
                .NotEmpty().WithMessage("Hotel is required")
                .MustAsync(async (hotelId, cancellation) => await RoomValidation.IsHotelValid(hotelId, context)).WithMessage("Hotel must be valid");
        }
    }

    public class UpdateRoomValidation : AbstractValidator<UpdateRoomDTO>
    {
        public UpdateRoomValidation(AppDbContext context)
        {
            RuleFor(x => x.RoomNumber)
                .Matches("^[0-9]+$").WithMessage("Room number must contain only digits")
                .MaximumLength(RoomConstants.MAX_ROOM_NUMBER_LENGTH).WithMessage($"Room number cannot exceed {RoomConstants.MAX_ROOM_NUMBER_LENGTH} characters")
                .MustAsync(async (name, cancellation) => await RoomValidation.IsRoomUnique(name, context)).WithMessage("Room number already exists");

            RuleFor(x => x.PricePerNight)
                .GreaterThan(RoomConstants.MIN_PRICE_PER_NIGHT).WithMessage($"Price per night must be greater than {RoomConstants.MIN_PRICE_PER_NIGHT}");

            RuleFor(x => x.Capacity)
                .GreaterThan(RoomConstants.MIN_CAPACITY).WithMessage($"Capacity must be greater than {RoomConstants.MIN_CAPACITY}")
                .LessThan(RoomConstants.MAX_CAPACITY).WithMessage($"Capacity must be less than {RoomConstants.MAX_CAPACITY}");

            RuleFor(x => x.HotelID)
                .MustAsync(async (hotelId, cancellation) => await RoomValidation.IsHotelValid(hotelId, context)).WithMessage("Hotel must be valid");
        }
    }


    public static class RoomValidation
    {
        public static async Task<bool> IsHotelValid(Guid? hotelId, AppDbContext context)
        {
            if (hotelId == null || hotelId == Guid.Empty)
                return false;

            return await context.Hotels.AnyAsync(r => r.HotelID == hotelId);
        }

        public static async Task<bool> IsRoomUnique(string name, AppDbContext context)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return !await context.Rooms.AnyAsync(r => EF.Functions.Like(r.RoomNumber.ToLower(), name.ToLower()));
        }
    }
}