using API.Models.Enums;
using System;

namespace API.Models.DTOs
{
    public class CreateInvoiceDTO
    {
        public Guid BookingID { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Discounts { get; set; } = 0;
        public DateTime? DueDate { get; set; }
    }

    public class UpdateInvoiceDTO
    {
        public Guid? BookingID { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal? Subtotal { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discounts { get; set; }
        public InvoiceStatus? Status { get; set; }
    }
}
