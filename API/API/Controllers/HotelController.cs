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
    [Route("api/hotels")]
    [AdminOnly]
    public class HotelController(
        AppDbContext context,
        IValidator<CreateHotelDTO> createValidator,
        IValidator<UpdateHotelDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/hotels
        [HttpGet]
        public async Task<IActionResult> GetHotels([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Hotels.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(h =>
                    EF.Functions.Like(h.Name, s) ||
                    EF.Functions.Like(h.Description, s) ||
                    EF.Functions.Like(h.Email, s) ||
                    EF.Functions.Like(h.City, s) ||
                    EF.Functions.Like(h.Country, s));
            }

            var totalHotels = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalHotels, pageSize, page);

            if (errorResult != null) return errorResult;

            var hotels = await query
                .Include(h => h.Rooms)
                .OrderBy(r => r.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalHotels, totalPages);
            return Ok(hotels);
        }

        // GET: api/hotels/{id}
        [HttpGet("{id}", Name = "GetHotelById")]
        public async Task<IActionResult> GetHotelById(Guid id)
        {
            var hotel = await context.Hotels.FindAsync(id);
            if (hotel == null) return NotFound();
            return Ok(hotel);
        }

        // POST: api/hotels
        [HttpPost]
        public async Task<IActionResult> CreateHotel(CreateHotelDTO hotelDto)
        {
            var validationResult = await createValidator.ValidateAsync(hotelDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var hotel = new Hotel
                {
                    Name = hotelDto.Name,
                    Description = hotelDto.Description,
                    Email = hotelDto.Email,
                    PhoneNumber = hotelDto.PhoneNumber,
                    City = hotelDto.City,
                    Country = hotelDto.Country,
                    HasWifi = hotelDto.HasWifi,
                    HasParking = hotelDto.HasParking,
                    HasPool = hotelDto.HasPool,
                    HasGym = hotelDto.HasGym,
                    HasSpa = hotelDto.HasSpa,
                    PetFriendly = hotelDto.PetFriendly,
                    CreatedAt = DateTime.UtcNow
                };

                context.Hotels.Add(hotel);

                await context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetHotelById), new { id = hotel.HotelID }, hotel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "HOTEL_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/hotels/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel([FromRoute] Guid id, [FromBody] UpdateHotelDTO updateDto)
        {
            updateDto.HotelID = id;

            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var hotel = await context.Hotels.FindAsync(id);
            if (hotel == null) return NotFound();

            hotel.Name = updateDto.Name ?? hotel.Name;
            hotel.Description = updateDto.Description ?? hotel.Description;
            hotel.Email = updateDto.Email ?? hotel.Email;
            hotel.PhoneNumber = updateDto.PhoneNumber ?? hotel.PhoneNumber;
            hotel.City = updateDto.City ?? hotel.City;
            hotel.Country = updateDto.Country ?? hotel.Country;

            hotel.HasWifi = updateDto.HasWifi ?? hotel.HasWifi;
            hotel.HasParking = updateDto.HasParking ?? hotel.HasParking;
            hotel.HasPool = updateDto.HasPool ?? hotel.HasPool;
            hotel.HasGym = updateDto.HasGym ?? hotel.HasGym;
            hotel.HasSpa = updateDto.HasSpa ?? hotel.HasSpa;
            hotel.PetFriendly = updateDto.PetFriendly ?? hotel.PetFriendly;

            hotel.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "HOTEL_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/hotels/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(Guid id)
        {
            var hotel = await context.Hotels.FindAsync(id);
            if (hotel == null) return NotFound();

            context.Hotels.Remove(hotel);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "HOTELS_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/roles/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            return await BulkDeleteHelper.Execute<Hotel>(context, dto.Ids, HotelConstants.ENTITY_NAME, "HotelID");

        }
    }
}