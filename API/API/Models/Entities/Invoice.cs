using API.Models.Enums;
using System;
using System.Text.Json.Serialization;

namespace API.Models.Entities
{
    public class Invoice
    {
        public Guid InvoiceID { get; set; }
        public string? InvoiceNumber { get; set; }
        public Guid BookingID { get; set; }

        [JsonIgnore]
        public Booking? Booking { get; set; }

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }

        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Discounts { get; set; }
        public decimal Total => Subtotal + Tax - Discounts;

        public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
