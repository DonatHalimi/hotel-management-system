using API.Models.Enums;
using System;

namespace API.Models.DTOs
{
    public class CreatePaymentDTO
    {
        public Guid BookingID { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; } = PaymentMethod.CreditCard;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? TransactionReference { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }

    public class UpdatePaymentDTO
    {
        public Guid BookingID { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionReference { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}
