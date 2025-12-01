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
    [Route("api/invoices")]
    [AdminOnly]
    public class InvoiceController(
        AppDbContext context,
        IValidator<CreateInvoiceDTO> createValidator,
        IValidator<UpdateInvoiceDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/invoices
        [HttpGet]
        public async Task<IActionResult> GetInvoices([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Invoices.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(r =>
                    EF.Functions.Like(r.InvoiceNumber, s) ||
                    EF.Functions.Like(r.Booking.BookingNumber, s));
            }

            var totalInvoices = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalInvoices, pageSize, page);

            if (errorResult != null) return errorResult;

            var invoices = await query
                .OrderBy(r => r.InvoiceNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalInvoices, totalPages);
            return Ok(invoices);
        }


        // GET: api/invoices/{id}
        [HttpGet("{id}", Name = "GetInvoiceById")]
        public async Task<IActionResult> GetInvoiceById(Guid id)
        {
            var invoice = await context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        // POST: api/invoices
        [HttpPost]
        public async Task<IActionResult> CreateInvoice(CreateInvoiceDTO invoiceDto)
        {
            var validationResult = await createValidator.ValidateAsync(invoiceDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var invoice = new Invoice
                {
                    BookingID = invoiceDto.BookingID,
                    InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                    Subtotal = invoiceDto.Subtotal,
                    Tax = invoiceDto.Tax,
                    Discounts = invoiceDto.Discounts,
                    DueDate = invoiceDto.DueDate,
                    CreatedAt = DateTime.UtcNow
                };

                context.Invoices.Add(invoice);
                await context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetInvoiceById), new { id = invoice.InvoiceID }, invoice);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "INVOICE_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/invoices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice([FromRoute] Guid id, [FromBody] UpdateInvoiceDTO updateDto)
        {
            updateDto.BookingID = id;

            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var invoice = await context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            invoice.Subtotal = updateDto.Subtotal ?? invoice.Subtotal;
            invoice.Tax = updateDto.Tax ?? invoice.Tax;
            invoice.Discounts = updateDto.Discounts ?? invoice.Discounts;
            invoice.DueDate = updateDto.DueDate ?? invoice.DueDate;
            invoice.Status = updateDto.Status ?? invoice.Status;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "INVOICE_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/invoices/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            var invoice = await context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            context.Invoices.Remove(invoice);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "INVOICE_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/invoices/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<Invoice>(context, dto.Ids, InvoiceConstants.ENTITY_NAME, "InvoiceID");
        }
    }
}
