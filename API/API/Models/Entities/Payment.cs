using API.Models.Enums;
using System;

namespace API.Models.Entities
{
    public class Payment
    {
        public Guid PaymentID { get; set; }
        public Guid BookingID { get; set; }
        public Booking? Booking { get; set; }

        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; } = PaymentMethod.CreditCard;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? TransactionReference { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}