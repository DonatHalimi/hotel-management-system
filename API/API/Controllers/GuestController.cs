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
    [Route("api/guests")]
    [AdminOnly]
    public class GuestController(
        AppDbContext context,
        IValidator<CreateGuestDTO> createValidator,
        IValidator<UpdateGuestDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/guests
        [HttpGet]
        public async Task<IActionResult> GetGuests([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Guests.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(g =>
                    EF.Functions.Like(g.IdNumber!, s) ||
                    EF.Functions.Like(g.FirstName!, s) ||
                    EF.Functions.Like(g.LastName!, s) ||
                    EF.Functions.Like(g.Email!, s) ||
                    EF.Functions.Like(g.City!, s) ||
                    EF.Functions.Like(g.Country!, s));
            }

            var totalGuests = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalGuests, pageSize, page);

            if (errorResult != null) return errorResult;

            var guests = await query
                .OrderBy(g => g.LastName)
                .ThenBy(g => g.FirstName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalGuests, totalPages);
            return Ok(guests);
        }

        // GET: api/guests/{id}
        [HttpGet("{id}", Name = "GetGuestById")]
        public async Task<IActionResult> GetGuestById(Guid id)
        {
            var guest = await context.Guests.FindAsync(id);
            if (guest == null) return NotFound();
            return Ok(guest);
        }

        // POST: api/guests
        [HttpPost]
        public async Task<IActionResult> CreateGuest(CreateGuestDTO guestDto)
        {
            var validationResult = await createValidator.ValidateAsync(guestDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var guest = new Guest
                {
                    IdNumber = guestDto.IdNumber,
                    FirstName = guestDto.FirstName,
                    LastName = guestDto.LastName,
                    Email = guestDto.Email,
                    PhoneNumber = guestDto.PhoneNumber,
                    Street = guestDto.Street,
                    City = guestDto.City,
                    Country = guestDto.Country,
                    CreatedAt = DateTime.UtcNow
                };

                context.Guests.Add(guest);
                await context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGuestById), new { id = guest.GuestID }, guest);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "GUEST_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/guests/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGuest([FromRoute] Guid id, [FromBody] UpdateGuestDTO updateDto)
        {
            updateDto.GuestID = id;

            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var guest = await context.Guests.FindAsync(id);
            if (guest == null) return NotFound();

            guest.IdNumber = updateDto.IdNumber ?? guest.IdNumber;
            guest.FirstName = updateDto.FirstName ?? guest.FirstName;
            guest.LastName = updateDto.LastName ?? guest.LastName;
            guest.Email = updateDto.Email ?? guest.Email;
            guest.PhoneNumber = updateDto.PhoneNumber ?? guest.PhoneNumber;
            guest.Street = updateDto.Street ?? guest.Street;
            guest.City = updateDto.City ?? guest.City;
            guest.Country = updateDto.Country ?? guest.Country;
            guest.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "GUEST_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/guests/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuest(Guid id)
        {
            var guest = await context.Guests.FindAsync(id);
            if (guest == null) return NotFound();

            context.Guests.Remove(guest);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "GUEST_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/guests/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<Guest>(context, dto.Ids, GuestConstants.ENTITY_NAME, "GuestID");
        }
    }
}
