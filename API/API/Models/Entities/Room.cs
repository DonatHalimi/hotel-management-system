using API.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class Room
    {
        [Key]
        public Guid RoomID { get; set; }

        public string? RoomNumber { get; set; }

        public int FloorNumber { get; set; }

        public RoomStatus Status { get; set; } = RoomStatus.Available;

        public RoomCondition Condition { get; set; } = RoomCondition.Good;

        public DateTime? LastMaintenanceDate { get; set; }

        public string? Notes { get; set; }

        public Guid HotelID { get; set; }
        public Guid RoomTypeID { get; set; }

        [JsonIgnore]
        public Hotel? Hotel { get; set; }

        [JsonIgnore]
        public RoomType? RoomType { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [JsonIgnore]
        public int MaxOccupancy => RoomType?.MaxOccupancy ?? 0;

        [JsonIgnore]
        public decimal BasePrice => RoomType?.BasePrice ?? 0;

        [JsonIgnore]
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        [JsonIgnore]
        public bool IsAvailableForBooking => IsActive &&
            Status == RoomStatus.Available &&
            Condition != RoomCondition.Poor &&
            RoomType?.IsActive == true;
    }
}
