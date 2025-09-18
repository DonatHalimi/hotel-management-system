using System;

namespace API.Models.DTOs
{
    public class CreateRoomDTO
    {
        public string? RoomNumber { get; set; }

        public string? Description { get; set; }

        public string? Type { get; set; }

        public decimal PricePerNight { get; set; }

        public int Capacity { get; set; }

        public Guid HotelID { get; set; }
    }

    public class UpdateRoomDTO
    {
        public string? RoomNumber { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public decimal PricePerNight { get; set; }
        public int Capacity { get; set; }
        public Guid HotelID { get; set; }
        public bool IsAvailable { get; set; }
    }
}
