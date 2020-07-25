using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class AlterDeviceEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Latitude",
                table: "Devices",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Longitude",
                table: "Devices",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Zone",
                table: "Devices",
                maxLength: 16,
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Zone",
                table: "Devices");
        }
    }
}
