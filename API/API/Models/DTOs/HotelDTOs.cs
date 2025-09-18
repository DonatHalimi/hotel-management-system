using System;

namespace API.Models.DTOs
{
    public class CreateHotelDTO
    {
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
    }

    public class UpdateHotelDTO
    {
        public Guid? HotelID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public bool? HasWifi { get; set; }
        public bool? HasParking { get; set; }
        public bool? HasPool { get; set; }
        public bool? HasGym { get; set; }
        public bool? HasSpa { get; set; }
        public bool? PetFriendly { get; set; }
    }
}
