using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RoomTableChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_Hotels_HotelID",
                table: "Room");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Room",
                table: "Room");

            migrationBuilder.RenameTable(
                name: "Room",
                newName: "Rooms");

            migrationBuilder.RenameIndex(
                name: "IX_Room_HotelID",
                table: "Rooms",
                newName: "IX_Rooms_HotelID");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "RoomNumber",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<Guid>(
                name: "HotelID",
                table: "Rooms",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Rooms",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Rooms",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms",
                column: "RoomID");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Hotels_HotelID",
                table: "Rooms",
                column: "HotelID",
                principalTable: "Hotels",
                principalColumn: "HotelID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Hotels_HotelID",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Rooms");

            migrationBuilder.RenameTable(
                name: "Rooms",
                newName: "Room");

            migrationBuilder.RenameIndex(
                name: "IX_Rooms_HotelID",
                table: "Room",
                newName: "IX_Room_HotelID");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Room",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "RoomNumber",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "HotelID",
                table: "Room",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Room",
                table: "Room",
                column: "RoomID");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Hotels_HotelID",
                table: "Room",
                column: "HotelID",
                principalTable: "Hotels",
                principalColumn: "HotelID");
        }
    }
}
