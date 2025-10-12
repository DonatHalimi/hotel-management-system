using API.Models.Enums;
using System;

namespace API.Models.DTOs
{
    public class CreateBookingDTO
    {
        public string? BookingNumber { get; set; }
        public Guid GuestID { get; set; }
        public Guid RoomID { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        public DateTime? BookingDate { get; set; }
        public DateTime? ActualCheckInDate { get; set; }
        public DateTime? ActualCheckOutDate { get; set; }
        public DateTime? CancellationDate { get; set; }
        public string? CancellationReason { get; set; }
    }

    public class UpdateBookingDTO
    {
        public Guid BookingID { get; set; }
        public string? BookingNumber { get; set; }
        public Guid? GuestID { get; set; }
        public Guid? RoomID { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? NumberOfGuests { get; set; }
        public decimal? TotalPrice { get; set; }
        public BookingStatus? Status { get; set; }

        public DateTime? BookingDate { get; set; }
        public DateTime? ActualCheckInDate { get; set; }
        public DateTime? ActualCheckOutDate { get; set; }
        public DateTime? CancellationDate { get; set; }
        public string? CancellationReason { get; set; }
    }
}