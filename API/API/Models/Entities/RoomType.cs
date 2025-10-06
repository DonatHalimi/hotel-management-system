using API.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class RoomType
    {
        public Guid RoomTypeID { get; set; }

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

        //public string? AmenitiesJSON { get; set; }

        public bool IsActive { get; set; } = true;

        [JsonIgnore]
        public ICollection<Room> Rooms { get; set; } = [];

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}