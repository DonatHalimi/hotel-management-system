using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AmenitiesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HasWifi = table.Column<bool>(type: "bit", nullable: false),
                    HasParking = table.Column<bool>(type: "bit", nullable: false),
                    HasPool = table.Column<bool>(type: "bit", nullable: false),
                    HasGym = table.Column<bool>(type: "bit", nullable: false),
                    HasSpa = table.Column<bool>(type: "bit", nullable: false),
                    HasRestaurant = table.Column<bool>(type: "bit", nullable: false),
                    HasBar = table.Column<bool>(type: "bit", nullable: false),
                    IsPetFriendly = table.Column<bool>(type: "bit", nullable: false),
                    HasAirConditioning = table.Column<bool>(type: "bit", nullable: false),
                    HasHeating = table.Column<bool>(type: "bit", nullable: false),
                    HasRoomService = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Amenities");
        }
    }
}
