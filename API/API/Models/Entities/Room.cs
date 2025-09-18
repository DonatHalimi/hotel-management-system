using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class Room
    {
        [Key]
        public Guid RoomID { get; set; }

        public string? RoomNumber { get; set; }

        public string? Type { get; set; }

        public string? Description { get; set; }

        public int Capacity { get; set; }

        public int PricePerNight { get; set; }

        public Guid HotelID { get; set; }

        [JsonIgnore]
        public Hotel? Hotel { get; set; }

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
