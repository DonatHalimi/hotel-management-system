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
    [Route("api/room-types")]
    [AdminOnly]
    public class RoomTypeController(
        AppDbContext context,
        IValidator<CreateRoomTypeDTO> createValidator,
        IValidator<UpdateRoomTypeDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/room-types
        [HttpGet]
        public async Task<IActionResult> GetRoomTypes([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] Guid? hotelId = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.RoomTypes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(rt =>
                    EF.Functions.Like(rt.Name, s) ||
                    EF.Functions.Like(rt.Description, s) ||
                    EF.Functions.Like(rt.BedType.ToString(), s));
            }

            var totalRoomTypes = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalRoomTypes, pageSize, page);

            if (errorResult != null) return errorResult;

            var roomTypes = await query
                .Include(rt => rt.Rooms)
                .OrderBy(rt => rt.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalRoomTypes, totalPages);
            return Ok(roomTypes);
        }

        // GET: api/room-types/{id}
        [HttpGet("{id}", Name = "GetRoomTypeById")]
        public async Task<IActionResult> GetRoomTypeById(Guid id)
        {
            var roomType = await context.RoomTypes
                .Include(rt => rt.Rooms)
                .FirstOrDefaultAsync(rt => rt.RoomTypeID == id);

            if (roomType == null) return NotFound();
            return Ok(roomType);
        }

        // GET: api/room-types/hotel/{hotelId}
        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetRoomTypesByHotel(Guid hotelId)
        {
            var hotel = await context.Hotels.FindAsync(hotelId);
            if (hotel == null) return NotFound("Hotel not found");

            var roomTypes = await context.RoomTypes
                .OrderBy(rt => rt.Name)
                .ToListAsync();

            return Ok(roomTypes);
        }

        // POST: api/room-types
        [HttpPost]
        public async Task<IActionResult> CreateRoomType([FromBody] CreateRoomTypeDTO roomTypeDto)
        {
            var validationResult = await createValidator.ValidateAsync(roomTypeDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var roomType = new RoomType
                {
                    Name = roomTypeDto.Name,
                    Description = roomTypeDto.Description,
                    MaxOccupancy = roomTypeDto.MaxOccupancy,
                    BedCount = roomTypeDto.BedCount,
                    BedType = roomTypeDto.BedType,
                    BasePrice = roomTypeDto.BasePrice,
                    SizeSqft = roomTypeDto.SizeSqft,
                    HasBalcony = roomTypeDto.HasBalcony,
                    HasKitchen = roomTypeDto.HasKitchen,
                    HasAirConditioning = roomTypeDto.HasAirConditioning,
                    HasWifi = roomTypeDto.HasWifi,
                    IsSmokingAllowed = roomTypeDto.IsSmokingAllowed,
                    IsActive = roomTypeDto.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                context.RoomTypes.Add(roomType);
                await context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRoomTypeById), new { id = roomType.RoomTypeID }, roomType);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_TYPE_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/room-types/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomType([FromRoute] Guid id, [FromBody] UpdateRoomTypeDTO updateDto)
        {
            updateDto.RoomTypeID = id;

            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var roomType = await context.RoomTypes.FindAsync(id);
            if (roomType == null) return NotFound();

            roomType.Name = updateDto.Name ?? roomType.Name;
            roomType.Description = updateDto.Description ?? roomType.Description;
            roomType.MaxOccupancy = updateDto.MaxOccupancy ?? roomType.MaxOccupancy;
            roomType.BedCount = updateDto.BedCount ?? roomType.BedCount;
            roomType.BedType = updateDto.BedType ?? roomType.BedType;
            roomType.BasePrice = updateDto.BasePrice ?? roomType.BasePrice;
            roomType.SizeSqft = updateDto.SizeSqft ?? roomType.SizeSqft;
            roomType.HasBalcony = updateDto.HasBalcony ?? roomType.HasBalcony;
            roomType.HasKitchen = updateDto.HasKitchen ?? roomType.HasKitchen;
            roomType.HasAirConditioning = updateDto.HasAirConditioning ?? roomType.HasAirConditioning;
            roomType.HasWifi = updateDto.HasWifi ?? roomType.HasWifi;
            roomType.IsSmokingAllowed = updateDto.IsSmokingAllowed ?? roomType.IsSmokingAllowed;
            roomType.IsActive = updateDto.IsActive ?? roomType.IsActive;
            roomType.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_TYPE_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/room-types/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomType(Guid id)
        {
            var roomType = await context.RoomTypes
                .Include(rt => rt.Rooms)
                .FirstOrDefaultAsync(rt => rt.RoomTypeID == id);

            if (roomType == null) return NotFound();

            if (roomType.Rooms.Count != 0)
            {
                return BadRequest(new
                {
                    ErrorCode = "ROOM_TYPE_IN_USE",
                    Message = "Cannot delete room type that is assigned to existing rooms"
                });
            }

            context.RoomTypes.Remove(roomType);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_TYPE_DELETE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/room-types/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkDeleteDTO dto)
        {
            var validationResult = await bulkDeleteValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var roomTypesInUse = await context.Rooms
                .Where(r => dto.Ids.Contains(r.RoomTypeID))
                .Select(r => r.RoomTypeID)
                .Distinct()
                .ToListAsync();

            if (roomTypesInUse.Count != 0)
            {
                return BadRequest(new
                {
                    ErrorCode = "ROOM_TYPES_IN_USE",
                    Message = "Cannot delete room types that are assigned to existing rooms",
                    RoomTypesInUse = roomTypesInUse
                });
            }

            return await BulkDeleteHelper.Execute<RoomType>(context, dto.Ids, RoomTypeConstants.ENTITY_NAME, "RoomTypeID");
        }
    }
}