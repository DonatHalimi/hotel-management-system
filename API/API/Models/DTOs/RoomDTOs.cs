using API.Models.Enums;
using System;

namespace API.Models.DTOs
{
    public class CreateRoomDTO
    {
        public string? RoomNumber { get; set; }
        public int FloorNumber { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Available;
        public RoomCondition Condition { get; set; } = RoomCondition.Good;
        public string? Notes { get; set; }
        public Guid HotelID { get; set; }
        public Guid RoomTypeID { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateRoomDTO
    {
        public string? RoomNumber { get; set; }
        public int? FloorNumber { get; set; }
        public RoomStatus? Status { get; set; }
        public RoomCondition? Condition { get; set; }
        public string? Notes { get; set; }
        public Guid? HotelID { get; set; }
        public Guid? RoomTypeID { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
