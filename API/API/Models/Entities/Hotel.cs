using System;
using System.Collections.Generic;

namespace API.Models.Entities
{
    public class Hotel
    {
        public Guid HotelID { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? City { get; set; }

        public string? Country { get; set; }

        public bool HasWifi { get; set; }

        public bool HasParking { get; set; }

        public bool HasPool { get; set; }

        public bool HasGym { get; set; }

        public bool HasSpa { get; set; }

        public bool PetFriendly { get; set; }

        public ICollection<Room> Rooms { get; set; } = [];

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
