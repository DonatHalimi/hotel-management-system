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
    [Route("api/bookings")]
    [AdminOnly]
    public class BookingController(
        AppDbContext context,
        IValidator<CreateBookingDTO> createValidator,
        IValidator<UpdateBookingDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/bookings
        [HttpGet]
        public async Task<IActionResult> GetBookings(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Bookings
                .Include(b => b.Guest)
                .Include(b => b.Room)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(b =>
                    EF.Functions.Like(b.BookingNumber!, s) ||
                    EF.Functions.Like(b.Guest!.FirstName!, s) ||
                    EF.Functions.Like(b.Guest!.LastName!, s) ||
                    EF.Functions.Like(b.Room!.RoomNumber!, s));
            }

            var totalBookings = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalBookings, pageSize, page);
            if (errorResult != null) return errorResult;

            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.BookingID,
                    b.BookingNumber,
                    b.BookingDate,
                    b.CheckInDate,
                    b.CheckOutDate,
                    b.CancellationDate,
                    GuestName = b.Guest.FirstName,
                    RoomNumber = b.Room.RoomNumber,
                    b.ActualCheckInDate,
                    b.ActualCheckOutDate,
                    b.NumberOfGuests,
                    b.TotalPrice,
                    b.Status,
                    b.CreatedAt,
                    b.UpdatedAt
                })
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalBookings, totalPages);
            return Ok(bookings);
        }

        // GET: api/bookings/{id}
        [HttpGet("{id}", Name = "GetBookingById")]
        public async Task<IActionResult> GetBookingById(Guid id)
        {
            var booking = await context.Bookings
                .Include(b => b.Guest)
                .Include(b => b.Room)
                .Where(b => b.BookingID == id)
                .Select(b => new
                {
                    b.BookingID,
                    b.BookingNumber,
                    b.BookingDate,
                    b.CheckInDate,
                    b.CheckOutDate,
                    b.CancellationDate,
                    GuestName = b.Guest.FirstName,
                    RoomNumber = b.Room.RoomNumber,
                    b.ActualCheckInDate,
                    b.ActualCheckOutDate,
                    b.NumberOfGuests,
                    b.TotalPrice,
                    b.Status,
                    b.CreatedAt,
                    b.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (booking == null)
                return NotFound();

            return Ok(booking);
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateBookingDTO bookingDto)
        {
            var validationResult = await createValidator.ValidateAsync(bookingDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var booking = new Booking
                {
                    BookingNumber = $"BK-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                    GuestID = bookingDto.GuestID,
                    RoomID = bookingDto.RoomID,
                    CheckInDate = bookingDto.CheckInDate,
                    CheckOutDate = bookingDto.CheckOutDate,
                    NumberOfGuests = bookingDto.NumberOfGuests,
                    TotalPrice = bookingDto.TotalPrice,
                    Status = bookingDto.Status,
                    BookingDate = bookingDto.BookingDate ?? DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                context.Bookings.Add(booking);
                await context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBookingById), new { id = booking.BookingID }, booking);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "BOOKING_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/bookings/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking([FromRoute] Guid id, [FromBody] UpdateBookingDTO updateDto)
        {
            updateDto.BookingID = id;

            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var booking = await context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.BookingNumber = updateDto.BookingNumber ?? booking.BookingNumber;
            booking.GuestID = updateDto.GuestID ?? booking.GuestID;
            booking.RoomID = updateDto.RoomID ?? booking.RoomID;
            booking.CheckInDate = updateDto.CheckInDate ?? booking.CheckInDate;
            booking.CheckOutDate = updateDto.CheckOutDate ?? booking.CheckOutDate;
            booking.NumberOfGuests = updateDto.NumberOfGuests ?? booking.NumberOfGuests;
            booking.TotalPrice = updateDto.TotalPrice ?? booking.TotalPrice;
            booking.Status = updateDto.Status ?? booking.Status;
            booking.ActualCheckInDate = updateDto.ActualCheckInDate ?? booking.ActualCheckInDate;
            booking.ActualCheckOutDate = updateDto.ActualCheckOutDate ?? booking.ActualCheckOutDate;
            booking.CancellationDate = updateDto.CancellationDate ?? booking.CancellationDate;
            booking.CancellationReason = updateDto.CancellationReason ?? booking.CancellationReason;
            booking.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "BOOKING_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/bookings/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(Guid id)
        {
            var booking = await context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            context.Bookings.Remove(booking);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "BOOKING_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/bookings/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<Booking>(context, dto.Ids, BookingConstants.ENTITY_NAME, "BookingID");
        }
    }
}