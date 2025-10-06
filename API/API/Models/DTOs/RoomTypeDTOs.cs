using System;
using API.Models.Enums;

namespace API.Models.DTOs
{
    public class CreateRoomTypeDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int MaxOccupancy { get; set; }
        public int BedCount { get; set; }
        public BedType BedType { get; set; } = BedType.Double;
        public decimal BasePrice { get; set; }
        public decimal SizeSqft { get; set; }
        public bool HasBalcony { get; set; }
        public bool HasKitchen { get; set; }
        public bool HasAirConditioning { get; set; }
        public bool HasWifi { get; set; }
        public bool IsSmokingAllowed { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateRoomTypeDTO
    {
        public Guid? RoomTypeID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? MaxOccupancy { get; set; }
        public int? BedCount { get; set; }
        public BedType? BedType { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? SizeSqft { get; set; }
        public bool? HasBalcony { get; set; }
        public bool? HasKitchen { get; set; }
        public bool? HasAirConditioning { get; set; }
        public bool? HasWifi { get; set; }
        public bool? IsSmokingAllowed { get; set; }
        public bool? IsActive { get; set; }
    }
}