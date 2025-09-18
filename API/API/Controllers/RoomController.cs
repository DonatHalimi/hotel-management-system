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
    [Route("api/rooms")]
    //[AdminOnly]
    public class RoomController(
        AppDbContext context,
        IValidator<CreateRoomDTO> createValidator,
        IValidator<UpdateRoomDTO> updateValidator,
        IValidator<BulkDeleteDTO> bulkDeleteValidator) : ControllerBase
    {
        // GET: api/rooms
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
        {
            PaginationValidation.Validate(page, pageSize, search ?? string.Empty, out var validationResult);
            if (validationResult != null) return validationResult;

            var query = context.Rooms.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = $"%{search.Trim()}%";
                query = query.Where(r =>
                    EF.Functions.Like(r.RoomNumber.ToString(), s) ||
                    EF.Functions.Like(r.Type, s));
            }

            var totalRooms = await query.CountAsync();
            var (totalPages, errorResult) = PaginationHelper.GetPaginationInfo(totalRooms, pageSize, page);

            if (errorResult != null) return errorResult;

            var rooms = await query
                .OrderBy(r => r.RoomNumber)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            PaginationHelper.AppendPaginationHeaders(Response, totalRooms, totalPages);
            return Ok(rooms);
        }

        // GET: api/rooms/{id}
        [HttpGet("{id}", Name = "GetRoomById")]
        public async Task<IActionResult> GetRoomById(Guid id)
        {
            var room = await context.Rooms.FindAsync(id);
            if (room == null) return NotFound();
            return Ok(room);
        }

        // POST: api/rooms
        [HttpPost]
        public async Task<IActionResult> CreateRoom(CreateRoomDTO roomDto)
        {
            var validationResult = await createValidator.ValidateAsync(roomDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            try
            {
                var room = new Room
                {
                    RoomNumber = roomDto.RoomNumber,
                    Description = roomDto.Description,
                    Type = roomDto.Type,
                    PricePerNight = (int)roomDto.PricePerNight,
                    Capacity = roomDto.Capacity,
                    HotelID = roomDto.HotelID,
                };

                context.Rooms.Add(room);

                await context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetRoomById), new { id = room.RoomID }, room);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_CREATION_FAILED",
                    ex.Message
                });
            }
        }

        // PUT: api/rooms/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom([FromRoute] Guid id, [FromBody] UpdateRoomDTO updateDto)
        {
            var validationResult = await updateValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var room = await context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.RoomNumber = updateDto.RoomNumber;
            room.Description = updateDto.Description;
            room.Type = updateDto.Type;
            room.PricePerNight = (int)updateDto.PricePerNight;
            room.Capacity = updateDto.Capacity;
            room.HotelID = updateDto.HotelID;
            room.IsAvailable = updateDto.IsAvailable;

            room.UpdatedAt = DateTime.UtcNow;

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_UPDATE_FAILED",
                    ex.Message
                });
            }
        }

        // DELETE: api/rooms/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var room = await context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            context.Rooms.Remove(room);

            try
            {
                await context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    ErrorCode = "ROOM_DELETE_FAILED",
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

            return await BulkDeleteHelper.Execute<Room>(context, dto.Ids, RoomConstants.ENTITY_NAME, "RoomID");
        }
    }
}
