using Microsoft.EntityFrameworkCore.Migrations;

namespace TapLog.Infrastructure.Persistence.Migrations
{
    public partial class AlterTapData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TesterId",
                table: "Taps");

            migrationBuilder.AddColumn<string>(
                name: "Tester",
                table: "Taps",
                maxLength: 64,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tester",
                table: "Taps");

            migrationBuilder.AddColumn<int>(
                name: "TesterId",
                table: "Taps",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
