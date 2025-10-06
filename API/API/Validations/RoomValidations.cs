using API.Data.Context;
using API.Models.DTOs;
using API.Models.Enums;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateRoomValidation : AbstractValidator<CreateRoomDTO>
    {
        public CreateRoomValidation(AppDbContext context)
        {
            RuleFor(x => x.RoomNumber)
                .NotEmpty().WithMessage("Room number is required")
                .Matches("^[A-Za-z0-9-]+$").WithMessage("Room number can only contain letters, numbers, and hyphens")
                .MaximumLength(RoomConstants.MAX_ROOM_NUMBER_LENGTH)
                .WithMessage($"Room number cannot exceed {RoomConstants.MAX_ROOM_NUMBER_LENGTH} characters")
                .MustAsync(async (dto, roomNumber, cancellation) =>
                    await RoomValidation.IsRoomNumberUniqueInHotel(roomNumber, dto.HotelID, null, context))
                .WithMessage("Room number already exists in this hotel");

            RuleFor(x => x.FloorNumber)
                .NotEmpty().WithMessage("Floor number is required")
                .GreaterThanOrEqualTo(RoomConstants.MIN_FLOOR_NUMBER)
                .WithMessage($"Floor number must be at least {RoomConstants.MIN_FLOOR_NUMBER}")
                .LessThanOrEqualTo(RoomConstants.MAX_FLOOR_NUMBER)
                .WithMessage($"Floor number cannot exceed {RoomConstants.MAX_FLOOR_NUMBER}");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid room status");

            RuleFor(x => x.Condition)
                .IsInEnum().WithMessage("Invalid room condition");

            RuleFor(x => x.Notes)
                .MaximumLength(RoomConstants.MAX_NOTES_LENGTH)
                .WithMessage($"Notes cannot exceed {RoomConstants.MAX_NOTES_LENGTH} characters");

            RuleFor(x => x.HotelID)
                .NotEmpty().WithMessage("Hotel is required")
                .MustAsync(async (hotelId, cancellation) =>
                    await RoomValidation.IsHotelValid(hotelId, context))
                .WithMessage("Hotel must be valid and active");

            RuleFor(x => x.RoomTypeID)
                .NotEmpty().WithMessage("Room type is required")
                .MustAsync(async (dto, roomTypeId, cancellation) =>
                    await RoomValidation.IsRoomTypeValidForHotel(roomTypeId, dto.HotelID, context))
                .WithMessage("Room type must be valid and belong to the specified hotel");
        }
    }

    public class UpdateRoomValidation : AbstractValidator<UpdateRoomDTO>
    {
        public UpdateRoomValidation(AppDbContext context)
        {
            RuleFor(x => x.RoomNumber)
                .Matches("^[A-Za-z0-9-]+$").WithMessage("Room number can only contain letters, numbers, and hyphens")
                .MaximumLength(RoomConstants.MAX_ROOM_NUMBER_LENGTH)
                .WithMessage($"Room number cannot exceed {RoomConstants.MAX_ROOM_NUMBER_LENGTH} characters")
                .When(x => !string.IsNullOrWhiteSpace(x.RoomNumber));

            RuleFor(x => x.FloorNumber)
                .GreaterThanOrEqualTo(RoomConstants.MIN_FLOOR_NUMBER)
                .WithMessage($"Floor number must be at least {RoomConstants.MIN_FLOOR_NUMBER}")
                .LessThanOrEqualTo(RoomConstants.MAX_FLOOR_NUMBER)
                .WithMessage($"Floor number cannot exceed {RoomConstants.MAX_FLOOR_NUMBER}")
                .When(x => x.FloorNumber.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid room status")
                .When(x => x.Status.HasValue);

            RuleFor(x => x.Condition)
                .IsInEnum().WithMessage("Invalid room condition")
                .When(x => x.Condition.HasValue);

            RuleFor(x => x.Notes)
                .MaximumLength(RoomConstants.MAX_NOTES_LENGTH)
                .WithMessage($"Notes cannot exceed {RoomConstants.MAX_NOTES_LENGTH} characters");

            RuleFor(x => x.HotelID)
                .MustAsync(async (hotelId, cancellation) =>
                    await RoomValidation.IsHotelValid(hotelId.Value, context))
                .WithMessage("Hotel must be valid")
                .When(x => x.HotelID.HasValue);

            RuleFor(x => x.RoomTypeID)
                .MustAsync(async (dto, roomTypeId, cancellation) =>
                    await RoomValidation.IsRoomTypeValidForHotel(roomTypeId.Value, dto.HotelID ?? Guid.Empty, context))
                .WithMessage("Room type must be valid and belong to the specified hotel")
                .When(x => x.RoomTypeID.HasValue);

            RuleFor(x => x)
                .Must(dto => dto.Status != RoomStatus.Occupied || dto.Condition != RoomCondition.Poor)
                .WithMessage("Cannot set room status to Occupied when condition is Poor")
                .When(x => x.Status.HasValue && x.Condition.HasValue);
        }
    }

    public static class RoomValidation
    {
        public static async Task<bool> IsHotelValid(Guid hotelId, AppDbContext context)
        {
            if (hotelId == Guid.Empty)
                return false;

            return await context.Hotels.AnyAsync(h => h.HotelID == hotelId);
        }

        public static async Task<bool> IsRoomTypeValidForHotel(Guid roomTypeId, Guid hotelId, AppDbContext context)
        {
            if (roomTypeId == Guid.Empty || hotelId == Guid.Empty)
                return false;

            return await context.RoomTypes.AnyAsync(rt =>
                rt.RoomTypeID == roomTypeId &&
                rt.IsActive);
        }

        public static async Task<bool> IsRoomNumberUniqueInHotel(string roomNumber, Guid? hotelId, Guid? excludeRoomId, AppDbContext context)
        {
            if (string.IsNullOrWhiteSpace(roomNumber) || !hotelId.HasValue)
                return false;

            var query = context.Rooms.Where(r =>
                r.HotelID == hotelId.Value &&
                EF.Functions.Like(r.RoomNumber.ToLower(), roomNumber.ToLower()));

            if (excludeRoomId.HasValue)
            {
                query = query.Where(r => r.RoomID != excludeRoomId.Value);
            }

            return !await query.AnyAsync();
        }
    }
}