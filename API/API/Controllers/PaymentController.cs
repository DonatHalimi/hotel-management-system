using API.Attributes;
using API.Data.Context;
using API.Helpers;
using API.Models.DTOs;
using API.Models.Entities;
using API.Validations;
using API.Validations.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [AdminOnly]
    public class PaymentController(
    AppDbContext context,
    IValidator<CreatePaymentDTO> createValidator,
    IValidator<UpdatePaymentDTO> updateValidator,
    IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {

        // GET: api/payments
        [HttpGet]
        public async Task<IActionResult> GetPayments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Payments
                .Include(b => b.Booking)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(b =>
                    EF.Functions.Like(b.Booking!.BookingNumber!, s)
                );
            }

            var totalPayments = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalPayments, pageSize, page);
            if (errorResult != null) return errorResult;

            var payments = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.PaymentID,
                    Booking = b.Booking.BookingNumber,
                    b.Amount,
                    b.TransactionReference,
                    b.Method,
                    b.Status,
                    b.PaymentDate,
                    b.CreatedAt,
                    b.UpdatedAt
                })
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalPayments, totalPages);
            return Ok(payments);
        }

        // GET: api/payments/{id}
        [HttpGet("{id}", Name = "GetPaymentById")]
        public async Task<IActionResult> GetPaymentById(Guid id)
        {
            var payment = await context.Payments
                .Include(b => b.Booking)
                .Where(b => b.PaymentID == id)
                .Select(b => new
                {
                    b.PaymentID,
                    Booking = b.Booking.BookingNumber,
                    b.Amount,
                    b.TransactionReference,
                    b.Method,
                    b.Status,
                    b.PaymentDate,
                    b.CreatedAt,
                    b.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        // POST: api/payments
        [HttpPost]
        public async Task<IActionResult> CreatePayment(CreatePaymentDTO paymentDto)
        {
            var validationResult = await createValidator.ValidateAsync(paymentDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var payment = new Payment
                {
                    BookingID = paymentDto.BookingID,
                    Amount = paymentDto.Amount,
                    Method = paymentDto.Method,
                    Status = paymentDto.Status,
                    TransactionReference = paymentDto.TransactionReference,
                    PaymentDate = paymentDto.PaymentDate,
                    CreatedAt = DateTime.UtcNow
                };

                context.Payments.Add(payment);
                await context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPaymentById), new { id = payment.PaymentID }, payment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "PAYMENT_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/payments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment([FromRoute] Guid id, [FromBody] UpdatePaymentDTO updateDto)
        {
            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var payment = await context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            payment.BookingID = updateDto.BookingID;
            payment.Amount = updateDto.Amount;
            payment.Method = updateDto.Method;
            payment.Status = updateDto.Status;
            payment.TransactionReference = updateDto.TransactionReference ?? payment.TransactionReference;
            payment.PaymentDate = updateDto.PaymentDate;

            payment.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "PAYMENT_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/payments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(Guid id)
        {
            var payment = await context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            context.Payments.Remove(payment);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "PAYMENT_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/payments/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<Payment>(context, dto.Ids, BookingConstants.ENTITY_NAME, "PaymentID");
        }
    }
}