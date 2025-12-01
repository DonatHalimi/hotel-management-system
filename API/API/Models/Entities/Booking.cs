using API.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class Booking
    {
        public Guid BookingID { get; set; }
        public string? BookingNumber { get; set; }
        public Guid GuestID { get; set; }
        public Guid RoomID { get; set; }

        [JsonIgnore]
        public Guest? Guest { get; set; }

        [JsonIgnore]
        public Room? Room { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        public DateTime? BookingDate { get; set; } = DateTime.UtcNow;
        public DateTime? ActualCheckInDate { get; set; }
        public DateTime? ActualCheckOutDate { get; set; }
        public DateTime? CancellationDate { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        public DateTime? UpdatedAt { get; set; }
    }
}
