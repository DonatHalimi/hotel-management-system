using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RoomTableAddition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Amenities");

            migrationBuilder.AddColumn<bool>(
                name: "HasGym",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasParking",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasPool",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasSpa",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasWifi",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PetFriendly",
                table: "Hotels",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Room",
                columns: table => new
                {
                    RoomID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoomNumber = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    PricePerNight = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    HotelID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Room", x => x.RoomID);
                    table.ForeignKey(
                        name: "FK_Room_Hotels_HotelID",
                        column: x => x.HotelID,
                        principalTable: "Hotels",
                        principalColumn: "HotelID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Room_HotelID",
                table: "Room",
                column: "HotelID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Room");

            migrationBuilder.DropColumn(
                name: "HasGym",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "HasParking",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "HasPool",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "HasSpa",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "HasWifi",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "PetFriendly",
                table: "Hotels");

            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HasAirConditioning = table.Column<bool>(type: "bit", nullable: false),
                    HasBar = table.Column<bool>(type: "bit", nullable: false),
                    HasGym = table.Column<bool>(type: "bit", nullable: false),
                    HasHeating = table.Column<bool>(type: "bit", nullable: false),
                    HasParking = table.Column<bool>(type: "bit", nullable: false),
                    HasPool = table.Column<bool>(type: "bit", nullable: false),
                    HasRestaurant = table.Column<bool>(type: "bit", nullable: false),
                    HasRoomService = table.Column<bool>(type: "bit", nullable: false),
                    HasSpa = table.Column<bool>(type: "bit", nullable: false),
                    HasWifi = table.Column<bool>(type: "bit", nullable: false),
                    IsPetFriendly = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x.Id);
                });
        }
    }
}
