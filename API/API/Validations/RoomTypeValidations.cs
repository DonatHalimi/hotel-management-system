using API.Data.Context;
using API.Models.DTOs;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Validations
{
    public class CreateRoomTypeValidation : AbstractValidator<CreateRoomTypeDTO>
    {
        public CreateRoomTypeValidation()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Room type name is required")
                .MaximumLength(RoomTypeConstants.MAX_NAME_LENGTH)
                .WithMessage($"Name cannot exceed {RoomTypeConstants.MAX_NAME_LENGTH} characters");

            RuleFor(x => x.Description)
                .MaximumLength(RoomTypeConstants.MAX_DESCRIPTION_LENGTH)
                .WithMessage($"Description cannot exceed {RoomTypeConstants.MAX_DESCRIPTION_LENGTH} characters");

            RuleFor(x => x.MaxOccupancy)
                .NotEmpty().WithMessage("Maximum occupancy is required")
                .GreaterThan(RoomTypeConstants.MIN_OCCUPANCY)
                .WithMessage($"Maximum occupancy must be greater than {RoomTypeConstants.MIN_OCCUPANCY}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_OCCUPANCY)
                .WithMessage($"Maximum occupancy cannot exceed {RoomTypeConstants.MAX_OCCUPANCY}");

            RuleFor(x => x.BedCount)
                .NotEmpty().WithMessage("Bed count is required")
                .GreaterThan(RoomTypeConstants.MIN_BED_COUNT)
                .WithMessage($"Bed count must be greater than {RoomTypeConstants.MIN_BED_COUNT}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_BED_COUNT)
                .WithMessage($"Bed count cannot exceed {RoomTypeConstants.MAX_BED_COUNT}");

            RuleFor(x => x.BedType)
                .IsInEnum().WithMessage("Invalid bed type");

            RuleFor(x => x.BasePrice)
                .NotEmpty().WithMessage("Base price is required")
                .GreaterThan(RoomTypeConstants.MIN_BASE_PRICE)
                .WithMessage($"Base price must be greater than {RoomTypeConstants.MIN_BASE_PRICE}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_BASE_PRICE)
                .WithMessage($"Base price cannot exceed {RoomTypeConstants.MAX_BASE_PRICE}");

            RuleFor(x => x.SizeSqft)
                .GreaterThan(RoomTypeConstants.MIN_SIZE_SQFT)
                .WithMessage($"Room size must be greater than {RoomTypeConstants.MIN_SIZE_SQFT} sqft")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_SIZE_SQFT)
                .WithMessage($"Room size cannot exceed {RoomTypeConstants.MAX_SIZE_SQFT} sqft")
                .When(x => x.SizeSqft > 0);
        }
    }

    public class UpdateRoomTypeValidation : AbstractValidator<UpdateRoomTypeDTO>
    {
        public UpdateRoomTypeValidation()
        {
            RuleFor(x => x.Name)
                .MaximumLength(RoomTypeConstants.MAX_NAME_LENGTH)
                .WithMessage($"Name cannot exceed {RoomTypeConstants.MAX_NAME_LENGTH} characters")
                .When(x => !string.IsNullOrWhiteSpace(x.Name));

            RuleFor(x => x.Description)
                .MaximumLength(RoomTypeConstants.MAX_DESCRIPTION_LENGTH)
                .WithMessage($"Description cannot exceed {RoomTypeConstants.MAX_DESCRIPTION_LENGTH} characters")
                .When(x => !string.IsNullOrWhiteSpace(x.Description));

            RuleFor(x => x.MaxOccupancy)
                .GreaterThan(RoomTypeConstants.MIN_OCCUPANCY)
                .WithMessage($"Maximum occupancy must be greater than {RoomTypeConstants.MIN_OCCUPANCY}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_OCCUPANCY)
                .WithMessage($"Maximum occupancy cannot exceed {RoomTypeConstants.MAX_OCCUPANCY}")
                .When(x => x.MaxOccupancy.HasValue);

            RuleFor(x => x.BedCount)
                .GreaterThan(RoomTypeConstants.MIN_BED_COUNT)
                .WithMessage($"Bed count must be greater than {RoomTypeConstants.MIN_BED_COUNT}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_BED_COUNT)
                .WithMessage($"Bed count cannot exceed {RoomTypeConstants.MAX_BED_COUNT}")
                .When(x => x.BedCount.HasValue);

            RuleFor(x => x.BedType)
                .IsInEnum().WithMessage("Invalid bed type")
                .When(x => x.BedType.HasValue);

            RuleFor(x => x.BasePrice)
                .GreaterThan(RoomTypeConstants.MIN_BASE_PRICE)
                .WithMessage($"Base price must be greater than {RoomTypeConstants.MIN_BASE_PRICE}")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_BASE_PRICE)
                .WithMessage($"Base price cannot exceed {RoomTypeConstants.MAX_BASE_PRICE}")
                .When(x => x.BasePrice.HasValue);

            RuleFor(x => x.SizeSqft)
                .GreaterThan(RoomTypeConstants.MIN_SIZE_SQFT)
                .WithMessage($"Room size must be greater than {RoomTypeConstants.MIN_SIZE_SQFT} sqft")
                .LessThanOrEqualTo(RoomTypeConstants.MAX_SIZE_SQFT)
                .WithMessage($"Room size cannot exceed {RoomTypeConstants.MAX_SIZE_SQFT} sqft")
                .When(x => x.SizeSqft.HasValue && x.SizeSqft > 0);
        }
    }

    public static class RoomTypeValidation
    {
        public static async Task<bool> IsHotelValid(Guid hotelId, AppDbContext context)
        {
            if (hotelId == Guid.Empty) return false;

            return await context.Hotels.AnyAsync(h => h.HotelID == hotelId);
        }

        public static async Task<bool> IsRoomTypeNameUniqueInHotel(string name, Guid? hotelId, Guid? excludeRoomTypeId, AppDbContext context)
        {
            if (string.IsNullOrWhiteSpace(name) || !hotelId.HasValue)
                return false;

            var query = context.RoomTypes.Where(rt =>
                EF.Functions.Like(rt.Name.ToLower(), name.ToLower()));

            if (excludeRoomTypeId.HasValue)
            {
                query = query.Where(rt => rt.RoomTypeID != excludeRoomTypeId.Value);
            }

            return !await query.AnyAsync();
        }

        public static async Task<bool> CanDeactivateRoomType(Guid roomTypeId, bool isActive, AppDbContext context)
        {
            if (isActive) return true;

            return !await context.Rooms.AnyAsync(r => r.RoomTypeID == roomTypeId && r.IsActive);
        }
    }
}
